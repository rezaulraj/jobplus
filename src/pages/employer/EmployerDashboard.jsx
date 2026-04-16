// pages/employer/EmployerDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaFileAlt, FaEye, FaUsers } from "react-icons/fa";

const EmployerDashboard = () => {
  const stats = [
    {
      label: "Active Jobs",
      value: 5,
      icon: <FaBriefcase />,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Total Applications",
      value: 47,
      icon: <FaFileAlt />,
      color: "from-green-500 to-green-600",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Interviews",
      value: 8,
      icon: <FaUsers />,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      label: "Profile Views",
      value: 234,
      icon: <FaEye />,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
  ];

  const recentApplications = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Senior Developer",
      applied: "2 hours ago",
      status: "pending",
      avatar: "SJ",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "UX Designer",
      applied: "5 hours ago",
      status: "reviewed",
      avatar: "MC",
    },
    {
      id: 3,
      name: "Emily Brown",
      position: "Product Manager",
      applied: "1 day ago",
      status: "shortlisted",
      avatar: "EB",
    },
    {
      id: 4,
      name: "David Wilson",
      position: "Marketing Lead",
      applied: "2 days ago",
      status: "rejected",
      avatar: "DW",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "reviewed":
        return "bg-blue-100 text-blue-600";
      case "shortlisted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Here's what's happening with your job postings today.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/employer/post-job"
            className="inline-flex items-center px-4 py-2 bg-linear-to-r from-[#1E2558] to-[#4EB956] text-white rounded-lg hover:shadow-lg transition-all"
          >
            <span className="mr-2">+</span>
            Post New Job
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center ${stat.text}`}
              >
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs text-green-600 font-medium">↑ 12%</span>
              <span className="text-xs text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Applications Overview
          </h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400">Chart Component Here</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Recent Applications
          </h3>
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#1E2558] to-[#4EB956] flex items-center justify-center text-white font-bold text-sm">
                    {app.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{app.name}</p>
                    <p className="text-xs text-gray-500">{app.position}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {app.applied}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/employer/applications"
            className="block text-center text-sm text-[#4EB956] hover:text-[#1E2558] mt-4"
          >
            View All Applications →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Active Job Postings</h3>
          <Link
            to="/employer/jobs"
            className="text-sm text-[#4EB956] hover:text-[#1E2558]"
          >
            Manage Jobs
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Job Title</th>
                <th className="pb-3 font-medium">Applications</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Posted</th>
                <th className="pb-3 font-medium">Expires</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-3">
                  <div>
                    <p className="font-medium text-gray-800">
                      Senior React Developer
                    </p>
                    <p className="text-xs text-gray-500">Full-time • Remote</p>
                  </div>
                </td>
                <td className="py-3">
                  <span className="font-medium text-gray-800">12</span>
                </td>
                <td className="py-3">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Active
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-600">2 days ago</td>
                <td className="py-3 text-sm text-gray-600">30 days left</td>
                <td className="py-3">
                  <button className="text-[#4EB956] hover:text-[#1E2558] text-sm">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
