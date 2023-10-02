import React, { useEffect } from "react"
import Home from './pages/Home/Home.jsx';
import Profile from './pages/Profile/Profile.jsx';
import SignIn from './pages/SignIn/SignIn';
import Auth from './pages/Auth/Auth';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import StandardLayout from './layouts/StandardLayout/StandardLayout';
import New from './pages/New/New';

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <StandardLayout />,
      children: [
        {
          index: true,
          element: 
          <Auth>
            <Home />
          </Auth>
          ,
        },
        {
          path: "profile",
          element: 
          <Auth>
            <Profile />
          </Auth>
          ,
        },
        {
          path: "profile",
          element: 
          <Auth>
            <New />
          </Auth>
          ,
        },
        {
          path: "signin",
          element: <SignIn />,
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}


