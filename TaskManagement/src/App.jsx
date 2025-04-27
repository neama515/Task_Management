import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { Button,  } from "flowbite-react";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import ProfilePage from "./Pages/ProfilePage";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import ProfileEdit from "./Pages/ProfileEdit/ProfileEdit";
import Usercontext from "./Components/UserContext/UserContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AddInformation from "./Pages/AddInformation/AddInformation";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import VerifyCode from "./Pages/VerifyCode/VerifyCode";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import Projects from "./Pages/Projects/Projects";

import MyTasks from "./Pages/MyTasks/MyTasks";
import Members from "./Pages/Members/Members";
import { jwtDecode } from "jwt-decode";
import Board from "./Pages/Board/Board";
import Teams from "./Components/Teams/Teams";
import BoardNav from './Components/BoardNav/BoardNav';
import NoFound from './Components/NoFound/NoFound';




const GOOGLE_CLIENT_ID =
  "880863870116-tarqejl8oj6phvimduii7k5p91edd9dp.apps.googleusercontent.com";

function App() {
  const handleGoogleSuccess = (response) => {
    const credential = response.credential;
    const user = jwtDecode(credential);
    console.log("Google User:", user);
  };

  const router = createBrowserRouter([
    { path: "/signin", element: <SignIn /> },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id",
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/projects",
      element: (
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      ),
    },
    
   
    {
      path: "/members/:projectId",
      element: (
        <ProtectedRoute>
          <Members />
        </ProtectedRoute>
      ),
    },
    {
      path: "/teams/:projectId",
      element: (
        <ProtectedRoute>
          {" "}
          <Teams />{" "}
        </ProtectedRoute>
      ),
    },
   
    {
      path: "/Board/:projectId",
      element: (
        <ProtectedRoute>
          <Board />
        </ProtectedRoute>
      ),
    },
 
    
    { path: "/signup", element: <SignUp /> },
    { path: "/addinfo", element: <AddInformation /> },
    { path: "/ForgetPassword", element: <ForgetPassword /> },
    { path: "/VerifyCode", element: <VerifyCode /> },
    { path: "/ResetPassword", element: <ResetPassword /> },
    { path: "/tasks", element: <MyTasks/> },
    { path: "/boardNav/:projectId", element: <BoardNav/> },
    { path: "/ProfileEdit", element: <ProtectedRoute><ProfileEdit /></ProtectedRoute> },
    { path: "*", element: <ProtectedRoute><NoFound /></ProtectedRoute> },
    { path: "/", element: <Layout />, children: [
        { index: true, element: <Home /> },
    ]}
  ]);

  

  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Usercontext>
        <RouterProvider router={router} />
        <ToastContainer />
      </Usercontext>
    </GoogleOAuthProvider>
  );
}

export default App;
