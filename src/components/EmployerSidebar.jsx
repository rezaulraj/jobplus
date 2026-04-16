import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaBuilding,
  FaBriefcase,
  FaShareAlt,
  FaKey,
  FaUserCircle,
  FaFileAlt,
  FaCog,
  FaUsers,
  FaEnvelope,
  FaCalendarAlt,
  FaHeart,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const EmployerSidebar = ({
  isOpen,
  isCollapsed,
  setIsCollapsed,
  isMobile,
  onClose,
}) => {
  const menuItems = [
    {
      section: "Main",
      items: [
        {
          label: "Dashboard",
          icon: <MdDashboard />,
          path: "/employer/dashboard",
          end: true,
        },
        {
          label: "Company Profile",
          icon: <FaBuilding />,
          path: "/employer/company",
        },
        {
          label: "Posted Jobs",
          icon: <FaBriefcase />,
          path: "/employer/jobs",
          badge: 5,
        },
        {
          label: "Applications",
          icon: <FaFileAlt />,
          path: "/employer/applications",
          badge: 12,
        },
      ],
    },
    {
      section: "Team & Access",
      items: [
        {
          label: "Share Access",
          icon: <FaShareAlt />,
          path: "/employer/share-access",
          badge: "New",
        },
        {
          label: "Team Members",
          icon: <FaUsers />,
          path: "/employer/team",
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          label: "Profile",
          icon: <FaUserCircle />,
          path: "/employer/profile",
        },
        {
          label: "Change Password",
          icon: <FaKey />,
          path: "/employer/change-password",
        },
        {
          label: "Account Overview",
          icon: <FaChartBar />,
          path: "/employer/account-overview",
        },
        // {
        //   label: "Settings",
        //   icon: <FaCog />,
        //   path: "/employer/settings",
        // },
      ],
    },
    {
      section: "Engagement",
      items: [
        {
          label: "Messages",
          icon: <FaEnvelope />,
          path: "/employer/messages",
          badge: 3,
        },
        {
          label: "Calendar",
          icon: <FaCalendarAlt />,
          path: "/employer/calendar",
        },
        {
          label: "Saved Candidates",
          icon: <FaHeart />,
          path: "/employer/saved-candidates",
        },
        {
          label: "Reviews",
          icon: <FaStar />,
          path: "/employer/reviews",
        },
      ],
    },
  ];

  const sidebarClasses = `
    fixed left-0 top-0 h-full bg-white shadow-xl z-50
    transition-all duration-300 ease-in-out
    ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
    ${isCollapsed ? "w-20" : "w-64"}
    flex flex-col
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Sidebar Header */}
      <div
        className={`flex items-center h-20 px-4 border-b border-gray-100 ${isCollapsed ? "justify-center" : "justify-between"}`}
      >
        {!isCollapsed && (
          <span className="text-xl font-bold bg-linear-to-r from-[#1E2558] to-[#4EB956] bg-clip-text text-transparent">
            Employer Panel
          </span>
        )}

        {/* Collapse Toggle - Hidden on mobile */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#4EB956] hover:text-white transition-colors"
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        )}

        {/* Close Button - Mobile only */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  end={item.end}
                  onClick={isMobile ? onClose : undefined}
                  className={({ isActive }) => `
                    flex items-center ${isCollapsed ? "justify-center" : "justify-start"} 
                    space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-linear-to-r from-[#1E2558]/10 to-[#4EB956]/10 text-[#1E2558]"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <span
                    className={`text-lg ${isCollapsed ? "" : "text-gray-400"} group-hover:text-[#4EB956] transition-colors`}
                  >
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            typeof item.badge === "number"
                              ? "bg-red-500 text-white"
                              : "bg-[#4EB956] text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {isCollapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer - Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-linear-to-r from-[#1E2558]/5 to-[#4EB956]/5 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#4EB956] flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">John Doe</p>
                <p className="text-[10px] text-gray-500">HR Manager</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <p className="text-xs font-bold text-[#1E2558]">5</p>
                <p className="text-[8px] text-gray-500">Active Jobs</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#4EB956]">12</p>
                <p className="text-[8px] text-gray-500">Applications</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default EmployerSidebar;
