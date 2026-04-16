import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EmployerSidebar from "../components/EmployerSidebar";
import EmployerHeader from "../components/EmployerHeader";

const EmployerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <EmployerHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <EmployerSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        } ${isMobile ? "ml-0" : ""}`}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <div className="container mx-auto">
            {/* Breadcrumb or Page Title can go here */}
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Footer Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-30">
          <div className="flex justify-around items-center">
            <Link
              to="/employer/dashboard"
              className="flex flex-col items-center text-gray-600 hover:text-[#4EB956] transition-colors"
            >
              <span className="text-xs">Dashboard</span>
            </Link>
            <Link
              to="/employer/jobs"
              className="flex flex-col items-center text-gray-600 hover:text-[#4EB956] transition-colors"
            >
              <span className="text-xs">Jobs</span>
            </Link>
            <Link
              to="/employer/post-job"
              className="flex flex-col items-center -mt-8"
            >
              <div className="w-12 h-12 bg-linear-to-r from-[#1E2558] to-[#4EB956] rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="text-xl">+</span>
              </div>
            </Link>
            <Link
              to="/employer/applications"
              className="flex flex-col items-center text-gray-600 hover:text-[#4EB956] transition-colors"
            >
              <span className="text-xs">Apps</span>
            </Link>
            <Link
              to="/employer/profile"
              className="flex flex-col items-center text-gray-600 hover:text-[#4EB956] transition-colors"
            >
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerLayout;
