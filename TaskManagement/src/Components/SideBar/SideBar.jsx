import React from "react";
import { Button, Drawer } from "flowbite-react";
import { useState } from "react";
import styles from "../../CSS/Profile.module.scss";
import { ListGroup } from "flowbite-react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const proj1 = localStorage.getItem("proj1");
  const proj2 = localStorage.getItem("proj2");

  return (
    <div>
      <div className="">
        <i
          onClick={() => setIsOpen(true)}
          className={`fa-solid fa-bars  px-3 ${styles.profile_nav_i}  cursor-pointer`}
        ></i>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 shadow-xl left-0 z-40 w-78 h-full bg-white dark:bg-gray-800 transition-transform duration-300 ${
            isOpen ? "transform translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Sidebar"
        >
          <div className="flex justify-between">
            <h1 className="text-[25px] p-5 font-extrabold text-[#93cee0]">
              CoNetic
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 flex justify-between p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="h-full px-3 py-4 overflow-y-auto ">
            <ul className=" font-medium">
             
              <hr className="border-gray-300 my-5" />
              <div className="text-black flex justify-between">
                {" "}
                <h3 className="text-[#93cee0] pl-3 font-semibold">
                  My Projects
                </h3>{" "}
                <Link to="/projects" className="pr-3 text-[14px]">
                  View All
                </Link>
              </div>
              {proj1 ? (
                <ul className="text-black pl-6 py-1">
                  <li className="py-2 flex items-center w-fit">
                    <div className="w-3 h-3 bg-[#93cee0] rounded-full mx-1"></div>
                    {proj1}
                  </li>
                  <li className="py-2 flex items-center w-fit">
                    {" "}
                    <div className="w-3 h-3 bg-slate-400 rounded-full mx-1"></div>
                    {proj2 ? (
                      proj2
                    ) : (
                      <Link to="/projects" className="text-black w-[100%]">
                        Create your Second project
                      </Link>
                    )}
                  </li>
                </ul>
              ) : (
                <div className="flex items-center">
                  {" "}
                  <div className="w-3 h-3 bg-[#93cee0] rounded-full mx-1"></div>
                  <Link to="/projects" className="text-black">
                    Create your first project
                  </Link>
                </div>
              )}
              <hr className="border-gray-300 my-5" />
            
           
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
