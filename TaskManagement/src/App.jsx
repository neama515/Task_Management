import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import ProfilePage from "./Pages/ProfilePage";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import ProfileEdit from "./Pages/ProfileEdit/ProfileEdit";
import Usercontext from "./Components/UserContext/UserContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Projects from "./Pages/Projects/Projects";
import MyTasks from "./Pages/MyTasks/MyTasks";
import Members from "./Pages/Members/Members";
import Board from "./Pages/Board/Board";
import Teams from "./Components/Teams/Teams";
import BoardNav from './Components/BoardNav/BoardNav';
import NoFound from './Components/NoFound/NoFound';

function App() {


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
    { path: "/tasks", element: <MyTasks/> },
    { path: "/boardNav/:projectId", element: <BoardNav/> },
    { path: "/ProfileEdit", element: <ProtectedRoute><ProfileEdit /></ProtectedRoute> },
    { path: "*", element: <ProtectedRoute><NoFound /></ProtectedRoute> },
    { path: "/", element: <Layout />, children: [
        { index: true, element: <Home /> },
    ]}
  ]);


  return (
   
      <Usercontext>
        <RouterProvider router={router} />
        <ToastContainer />
      </Usercontext>

  );
}

export default App;
