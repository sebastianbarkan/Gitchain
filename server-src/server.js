// Importing necessary modules using ES6 import syntax
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import qs from "qs"
import mysql from "mysql2"
import axios from "axios"
// Load environment variables from .env file
dotenv.config();

const app = express();
// Set up middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));


const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});

app.use(express.json());  // Parse JSON bodies
app.use(session({
  secret: process.env.SECRET_KEY,  // Use a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,  // Set to true if your app is served over HTTPS
    sameSite: 'Lax'  // Helps prevent CSRF
  }
}));

app.post('/create-task', async (req, res) => {
  const { taskId, description, githubRepo, category, languages, amount } = req.body;

  // 1. Data validation
  if (!taskId || !description || !githubRepo || !category || !languages || !Array.isArray(languages) || !amount) {
    return res.status(400).send('Invalid data provided.');
  }

  // 2. Convert languages array of objects to string (comma-separated)
  const languagesStr = languages.map(lang => lang.value).join(',');

  // 3. Convert amount to a suitable decimal format
  const formattedAmount = parseFloat(amount).toFixed(2);

  // 4. Insert into database
  const query = 'INSERT INTO gitchain.tasks (taskId, description, githubRepo, category, languages, amount) VALUES (?, ?, ?, ?, ?, ?)';

  connection.query(query, [taskId, description, githubRepo, category, languagesStr, formattedAmount], (error, results) => {
    if (error) {
      console.error("Error inserting into database:", error);
      return res.status(500).send('Server error.');
    }
    res.status(201).send('Task successfully created.');
  });
});


app.get('/fetch-tasks', async (req, res) => {
  const query = 'SELECT * FROM gitchain.tasks';

  connection.query(query, (error, results) => {
      if (error) {
          console.error("Error fetching data from database:", error);
          return res.status(500).send('Server error.');
      }
      // Convert languages string back to an array of objects for consistency with the POST data
      const tasksWithFormattedLanguages = results.map(task => ({
          ...task,
          languages: task.languages.split(',').map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))  // This assumes the language labels are capitalized versions of the values
      }));
      res.status(200).json(tasksWithFormattedLanguages);
  });
});


app.post('/auth', (req, res) => {
  const address = req.body.address
  if (!address) {
    res.status(400).send('Address is required');
    return;
  }

  req.session.address = address;  // Store the authId in the session
  res.send('Authentication successful');
});


app.get('/session-data', (req, res) => {
  if (!req.session.address) {
    res.status(401).send('Unauthorized');
    return;
  }

  const data = {
    address: req.session.address,
  };

  res.json(data);
});

app.get('/auth/github', (req, res) => {
  const githubAuthUrl = 'https://github.com/login/oauth/authorize?' + qs.stringify({
    client_id: process.env.APP_CLIENT_ID,
    redirect_uri: 'http://localhost:3001/auth/github/callback',
    scope: 'read:user',
  });
  res.redirect(githubAuthUrl);
});

app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.APP_CLIENT_ID,
      client_secret: process.env.APP_CLIENT_SECRET,
      code,
    }, {
      headers: {
        accept: 'application/json',
      },
    });
    const accessToken = tokenResponse.data.access_token;
    req.session.accessToken = accessToken;  // Store the accessToken in the session
    res.redirect('http://localhost:5173');  // Redirect back to your React app
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});

app.get('/user-data', async (req, res) => {
  if (!req.session.accessToken) {
    res.status(401).send('No Access Token!');
    return
  }

  try {
    const userRepos = await getUserRepos(req.session.accessToken);
    const languageData = await Promise.all(userRepos.map(repo => getRepoLanguages(req.session.accessToken, repo)));
    // Assuming contributions need to be fetched from each repo
    const contributions = await Promise.all(userRepos.map(repo => getUserContributions(req.session.accessToken, repo)));
    // ... process languageData and contributions to desired format ...
    res.json({ contributions, languageData });
  } catch (error) {
    res.status(500).send('Failed to fetch user data');
  }
});

async function getUserRepos(accessToken) {
  const config = {
    headers: {
      'Authorization': `token ${accessToken}`
    },
    params: {
      per_page: 100  // Set page size to maximum allowed limit
    }
  };
  const response = await axios.get('https://api.github.com/user/repos', config);
  return response.data;
}

async function getRepoLanguages(accessToken, repo) {

  const config = {
    headers: {
      'Authorization': `token ${accessToken}`
    },
    params: {
      per_page: 100  // Set page size to maximum allowed limit
    }
  };
  const repoOwner = repo.owner.login;
  const repoName = repo.name;
  try {
    const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/languages`, config);
    return response.data;

  } catch (err) {
    console.log("CATCH error", err)
    return 500
  }

}

async function getUserContributions(accessToken, repo) {
  const config = {
    headers: {
      'Authorization': `token ${accessToken}`
    },
    params: {
      per_page: 100  // Set page size to maximum allowed limit
    }
  };
  const repoOwner = repo.owner.login;
  const repoName = repo.name;

  try {
    // Fetching authenticated user details.
    const userResponse = await axios.get('https://api.github.com/user', config);
    const username = userResponse.data.login;

    // Fetching all commits from the repository.
    const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`, config);

    // Filtering commits based on the authenticated user’s username.
    const userCommits = response.data.filter(commit => commit.author && commit.author.login === username);

    // Returning the count of commits made by the authenticated user.
    return userCommits.length;
  } catch (err) {
    console.error("Error getting user contributions: ", err.message);
    return 0; // Return 0 or some error identifier. Avoid returning 500 which might imply server error.
  }
}

// Start the server
app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
