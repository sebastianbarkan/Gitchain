import './App.css'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import Home from './pages/Home/Home.jsx';
import Profile from './pages/Profile/Profile.jsx';
import SignIn from './pages/SignIn/SignIn';
import Auth from './pages/Auth/Auth';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Auth/>,
      children: [
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "signin",
          element: <SignIn />,
        },
      ],
    },
  ]);

  return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
  )
}

export default App
