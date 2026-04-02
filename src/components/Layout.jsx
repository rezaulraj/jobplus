import React from "react";
import RootHeader from "./RootHeader";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div>
      <RootHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
