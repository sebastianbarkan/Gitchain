// Importing necessary modules using ES6 import syntax
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Set up middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Replace with your React app's URL
  credentials: true  // Allows cookies to be sent with requests from the client
}));

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

// Sample endpoint to simulate authentication
app.post('/auth', (req, res) => {
  // Assume getAuthId is a function that retrieves the TRONLink wallet auth ID
  // const authId = getAuthId();  
  const authId = 'sample-auth-id';  // Placeholder
  req.session.authId = authId;  // Store the authId in the session
  res.send('Authentication successful');
});

// Endpoint to fetch session data
app.get('/session-data', (req, res) => {
  if (!req.session.authId) {
    res.status(401).send('Unauthorized');
    return;
  }
  const data = {
    authId: req.session.authId,
    // ... other session data
  };
  res.json(data);
});

// Start the server
app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
