"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RxResume } from "react-icons/rx";
import "../../CSS/Navbar/NavbarHome.scss";
import collaborationImg from "../../Images/collaboration6.png";
import styles from "../../CSS/_common.module.scss";
export default function Home() {
  const words = [
    "work",
    "collaboration",
    "project management",
    "integration",
    "AI",
  ]; // Words to cycle through
  // const colors = ["text-purple-600", "text-blue-600", "text-green-600", "text-red-600"]; // Colors to switch

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="text-center mt-40 mx-0 w-full">
        {/* Animated Text */}
        <div className=" font-bold flex justify-center items-center txt_home_anim text-6xl">
          <span className="text-black">Where&nbsp;</span>
          <motion.span
            key={words[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-[#93cee0] font-bold"
          >
            {words[index]}
          </motion.span>
          <span className="text-black">&nbsp;happens</span>
        </div>

        <div className="text-center max-w-3xl mx-auto mt-10 px-6">
          <p className="text-2xl font-semibold text-gray-900 leading-tight">
            Get everyone working in a single platform <br />
            designed to manage any type of work.
          </p>
        </div>
        {/* Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          {/* Get Started Button */}
          <button className="bg-[#93cee0] text-white font-bold py-3 px-6 rounded-md text-lg transition ">
            GET STARTED
          </button>

          <div className="pr-4">
            <button className="flex items-center justify-center border border-gray-800 text-gray-800 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition">
              <RxResume className="mr-2" /> See Demo
            </button>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <section
          id="msg"
          className="flex flex-col md:flex-row w-full items-center justify-center gap-8 px-6 md:px-16 py-16 m-0 bg-gray-100"
        >
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left ">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              Instant Messaging
            </h2>
            <p className="text-gray-600 mt-4 text-lg text-center">
              Stay connected and collaborate in real-time with our instant
              messaging features. Send and receive messages instantly,
              facilitating quick communication, efficient decision-making, and
              seamless teamwork.
            </p>
          </div>

          {/* Right Side: Messaging UI Image */}
          <div className="w-full md:w-1/2">
            <img
              src={collaborationImg}
              alt="Messaging UI"
              className={`w-full h-auto rounded-lg shadow-lg ${styles.home_custom_shadow}`}
            />
          </div>
        </section>
        <section
          id="wboard"
          className="flex flex-col md:flex-row items-center justify-center gap-8 px-6 md:px-16 py-16 bg-white"
        >
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2">
            <img
              src={collaborationImg}
              alt="Messaging UI"
              className={`w-full h-auto rounded-lg shadow-lg ${styles.home_custom_shadow}`}
            />
          </div>
          {/* Right Side: Messaging UI Image */}

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              Shared whiteboard
            </h2>
            <p className="text-gray-600 mt-4 text-lg text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. In,
              reprehenderit perspiciatis quo fuga vitae eveniet totam odit quod
              quia eos aut provident? Dolore animi incidunt accusamus cum
              aliquid laboriosam placeat.
            </p>
          </div>
        </section>
        <section
          id="dashboard"
          className="flex flex-col md:flex-row items-center justify-center gap-8 px-6 md:px-16 py-16 bg-gray-100"
        >
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              Dashborad
            </h2>
            <p className="text-gray-600 mt-4 text-lg text-center">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Architecto qui ducimus fuga, molestias nesciunt aspernatur sit
              voluptatum. Rerum aliquam pariatur magni iste ab quaerat aut quos
              odio? Soluta, obcaecati fuga?
            </p>
          </div>

          {/* Right Side: Messaging UI Image */}
          <div className="w-full md:w-1/2">
            <img
              src={collaborationImg}
              alt="Messaging UI"
              className={`w-full h-auto rounded-lg shadow-lg ${styles.home_custom_shadow}`}
            />
          </div>
        </section>
      </div>

      {/* <div className="flex justify-center space-x-4 mt-6 fixed end-0 start-0 ">
      <button className="border border-gray-400 text-gray-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition">
        Communication
      </button>
      <button className="border border-gray-400 text-gray-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition">
        Recommendation
      </button>
      <button className="border border-gray-400 text-gray-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition">
        Coordination
      </button>

      
    </div> */}
    </>
  );
}
