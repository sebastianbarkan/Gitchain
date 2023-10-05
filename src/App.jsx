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
import Submissions from "./pages/Submissions/Submissions.jsx";
import CreateTask from "./pages/CreateTask/CreateTask.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";

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
        path: "submissions",
        element:
          <Auth>
            <Submissions />
          </Auth>
        ,
      },
      {
        path: "createtask",
        element:
          <Auth>
            <CreateTask />
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

export default function App() {

  const dispatch = useDispatch();

  useEffect(() => {
      // Retrieve transactions from localStorage
      const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || {};

      // Iterate over stored transactions and resume polling for any that are still 'pending'
      for (let transactionInfo in storedTransactions) {
          if (storedTransactions[transactionInfo] === 'pending') {
              dispatch(startTransactionPolling(transactionInfo, tronWeb)); // Make sure tronWeb is available here
          }
      }
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      <ToastContainer />
    </>

  )
}


