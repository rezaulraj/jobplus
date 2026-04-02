import React from "react";
import SeekerHeader from "../components/SeekerHeader";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const SeekerLayout = () => {
  return (
    <div>
      <SeekerHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default SeekerLayout;
