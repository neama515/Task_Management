import React from "react";
import NavbarHome from "../NavbarHome/NavbarHome";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

export default function Layout() {
  return (
    <>
      <NavbarHome />
      <div className=" mx-auto py-10 ">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
