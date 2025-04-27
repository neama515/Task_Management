"use client";
import React, { useState } from "react";
import { IoIosNotifications, IoMdArrowDropdown } from "react-icons/io";
import { SiGoogletranslate  } from "react-icons/si";
import  {FaGlobe} from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import  "../../CSS/Navbar/NavbarHome.scss";
import logoH from "../../Images/LogoHome.jpg";
// import { useAuthContext } from "../../../Contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [clicked, setClicked] = useState(false)
  // const navigate = useNavigate();
  // const { user, setUser } = useAuthContext();

  // const handleLogout = () => {
  //   localStorage.removeItem("auth");
  //   Cookies.remove("auth");
  //   setUser(false);
  // };

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200 ">
        <div className="flex  justify-between px-6 py-3  ml-auto">
          {/* Logo */}
          <a href="/">
            <img src={logoH} alt="logo" className="h-14" />
          </a>
          
          <ul id="con" className={clicked ? "#con active" : "#con"} >
            {/* Features Dropdown */}
            <li className="relative ">
              <button
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center text-gray-700 hover:text-black px-4 py-2 active"
              >
                Features <IoMdArrowDropdown className="ml-1" />
              </button>

              {isFeaturesOpen && (
                <div className="absolute left-0 mt-2 w-[700px] bg-white  border-[3px] border-black shadow-lg rounded-md z-50 p-6 flex justify-center">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Communication Section */}
                    <div className=" pr-4 border-r-[3px] border-black">
                      <h3 className="text-md font-bold text-black flex items-center">
                        <img src="Connection 1.svg" className="w-6 h-6 mr-2" alt="connection" />
                        Communication
                      </h3>
                      <ul className="mt-2 space-y-2 text-sm text-gray-700">
                        <li><a href="#msg" className="hover:text-[#5DCCDB]">Instant messaging</a></li>
                        <li><a href="#convo" className="hover:text-[#5DCCDB]">Project conversation</a></li>
                        <li><a href="#vid" className="hover:text-[#5DCCDB]">Video conference</a></li>
                      </ul>
                    </div>

                    {/* Collaboration Section */}
                    <div className="border-r-[3px] border-black">
                      <h3 className="text-md font-bold text-black flex items-center">
                        <img src="Collaborate 1.svg" className="w-6 h-6 mr-2" alt="collaborate" />
                        Collaboration
                      </h3>
                      <ul className="mt-2 space-y-2 text-sm text-gray-700">
                        <li><a href="#wboard" className="hover:text-[#5DCCDB]">Shared whiteboard</a></li>
                        <li><a href="#wiki" className="hover:text-[#5DCCDB]">Wikis</a></li>
                      </ul>
                    </div>

                    {/* Coordination Section */}
                    <div className="pl-4 ">
                      <h3 className="text-md font-bold text-black flex items-center">
                        <img src="Coordination 3.svg" className="w-6 h-6 mr-2" alt="coordination" />
                        Coordination
                      </h3>
                      <ul className="mt-2 space-y-2 text-sm text-gray-700  grid grid-cols-2 gap-3">
                        <li><a href="#calendar" className="hover:text-[#5DCCDB]">Group calendar</a></li>
                        <li><a href="#dashboard" className="hover:text-[#5DCCDB]">Dashboard</a></li>
                        <li><a href="#board" className="hover:text-[#5DCCDB]">Board view</a></li>
                        <li><a href="#list" className="hover:text-[#5DCCDB]">List view</a></li>
                        <li><a href="#gantt" className="hover:text-[#5DCCDB]">Gantt chart</a></li>
                        <li><a href="#report" className="hover:text-[#5DCCDB]">Reports</a></li>
                        <li><a href="#files" className="hover:text-[#5DCCDB]">Files Archive</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li><a href="/" className="text-gray-700 hover:text-black active">Pricing</a></li>
            <li><a href="/EditProfile" className="text-gray-700 hover:text-black active">About</a></li>

            {/* Language Dropdown */}
            <li className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center text-gray-700 hover:text-black px-4 py-2 active"
              >
                <FaGlobe className="mr-2 " /> English <IoMdArrowDropdown className="ml-1" />
              </button>

              {isLanguageOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">English</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">عربي</a></li>
                  </ul>
                </div>
              )}
            </li>

            {/* User Profile Dropdown */}
            {/* {user ? (
              <li className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-gray-700 hover:text-black px-4 py-2"
                >
                  <img src={user.image} className="w-8 h-8 rounded-full" alt="User" />
                  <MdArrowDropDown className="ml-2" />
                </button>

                {isProfileOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                    <ul className="py-2 text-sm text-gray-700">
                      <li><a href={`/profile/${user._id}`} className="block px-4 py-2 hover:bg-gray-100">Profile</a></li>
                      <li><a href="/Edit" className="block px-4 py-2 hover:bg-gray-100">Settings</a></li>
                      <li><button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-gray-100">Logout</button></li>
                    </ul>
                  </div>
                )}
              </li>
              */}
               
                <li><a href="/signin" className="text-gray-700 hover:text-black">Login</a></li>
                <li><a href="/signup" className=" px-4 py-2 rounded-md nav_btn">Get Started</a></li>
 
          
          </ul>
        </div>
      </nav>
    </>
  );
}
