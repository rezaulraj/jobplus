import React, { useState } from "react";
import {
  FiUpload,
  FiBriefcase,
  FiHeart,
  FiBell,
  FiFileText,
  FiTrendingUp,
  FiSettings,
  FiCheckCircle,
  FiPlay,
  FiLinkedin,
  FiEye,
  FiCalendar,
  FiHome,
  FiTarget,
} from "react-icons/fi";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const SeekerDashboard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [userName, setUserName] = useState("John Doe");

  const profileCompletion = 65;

  const applicationData = [
    { name: "Applied", value: 42, color: "#4eb956" },
    { name: "Viewed", value: 28, color: "#3da845" },
    { name: "Pending", value: 18, color: "#2c9735" },
    { name: "Shortlisted", value: 12, color: "#1b8625" },
  ];

  const monthlyData = [
    { month: "Jan", applications: 8 },
    { month: "Feb", applications: 12 },
    { month: "Mar", applications: 15 },
    { month: "Apr", applications: 10 },
    { month: "May", applications: 18 },
    { month: "Jun", applications: 14 },
  ];

  const activityData = [
    { day: "Mon", activity: 40 },
    { day: "Tue", activity: 60 },
    { day: "Wed", activity: 55 },
    { day: "Thu", activity: 75 },
    { day: "Fri", activity: 65 },
    { day: "Sat", activity: 45 },
    { day: "Sun", activity: 35 },
  ];

  const quickLinks = [
    {
      icon: <FiHeart size={22} />,
      label: "Saved Jobs",
      path: "/seeker/saved-jobs",
      count: 18,
    },
    {
      icon: <FiBell size={22} />,
      label: "Job Alerts",
      path: "/seeker/job-alerts",
      count: 7,
    },
    {
      icon: <FiFileText size={22} />,
      label: "My CV",
      path: "/seeker/cv-upload",
    },
    {
      icon: <FiBriefcase size={22} />,
      label: "Applications",
      path: "/seeker/applied-jobs",
      count: 42,
    },
    {
      icon: <FiTrendingUp size={22} />,
      label: "Career Tips",
      path: "/features/career-tips",
    },
    {
      icon: <FiEye size={22} />,
      label: "Profile Views",
      path: "/seeker/profile",
      count: 128,
    },
    { icon: <FiSettings size={22} />, label: "Settings", path: "" },
    { icon: <FiLinkedin size={22} />, label: "LinkedIn", path: "" },
  ];

  const recentApplications = [
    {
      company: "TechCorp Solutions",
      position: "Senior Frontend Developer",
      date: "Today",
      time: "2 hours ago",
      status: "New",
    },
    {
      company: "DesignStudio Pro",
      position: "UI/UX Designer",
      date: "Yesterday",
      time: "1 day ago",
      status: "Viewed",
    },
    {
      company: "StartupXYZ Inc",
      position: "Product Manager",
      date: "Jun 15",
      time: "1 week ago",
      status: "Processing",
    },
    {
      company: "GlobalTech Ltd",
      position: "Full Stack Developer",
      date: "Jun 10",
      time: "2 weeks ago",
      status: "Completed",
    },
    {
      company: "DigitalAgency Co",
      position: "React Native Developer",
      date: "Jun 5",
      time: "3 weeks ago",
      status: "Viewed",
    },
  ];

  const stats = [
    {
      label: "Total Applications",
      value: "42",
      change: "+18%",
      icon: <FiBriefcase />,
    },
    { label: "Profile Views", value: "28", change: "+32%", icon: <FiEye /> },
    { label: "Saved Jobs", value: "18", change: "+5%", icon: <FiHeart /> },
    {
      label: "Shortlisted Jobs",
      value: "12",
      change: "",
      icon: <HiOutlineClipboardCheck />,
    },
  ];

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to={"/"}>Home</Link>
              <span>/</span>
              <span className="text-[#1e2558] font-medium">Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </span>
                .. <div className="text-secondary">{stat.icon}</div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-8/12 w-full space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-32 md:h-40 rounded-t-xl overflow-hidden">
                {backgroundImage ? (
                  <img
                    src={backgroundImage}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
                )}
                <label className="absolute top-2 right-2 bg-white text-gray-700 px-2 py-1 rounded-lg cursor-pointer transition-all hover:bg-gray-50 flex items-center space-x-1 shadow-sm text-xs">
                  <FiUpload size={12} />
                  <span>Upload</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                  />
                </label>
              </div>

              <div className="px-4 pb-4 -mt-10 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md bg-linear-to-r from-[#1e2558] to-[#4eb956] overflow-hidden">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                            {userName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-[#4eb956] text-white p-1 sm:p-1.5 rounded-full cursor-pointer hover:bg-[#3da845] transition-colors shadow-sm">
                        <FiUpload size={10} className="sm:w-3 sm:h-3" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                        />
                      </label>
                    </div>

                    <div className="mt-2 sm:mt-0">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="text-lg sm:text-xl font-bold bg-transparent border-none outline-none text-gray-900 mb-1 w-full sm:w-auto"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiBriefcase size={14} />
                          <span>Frontend Developer</span>
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <FiTarget size={14} />
                          <span>Active Job Seeker</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Profile Strength</span>
                      <span className="font-semibold text-[#4eb956]">
                        {profileCompletion}%
                      </span>
                    </div>
                    <div className="w-full sm:w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-secondary to-[#3da845]"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Application Analytics
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    Weekly
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-secondary text-white rounded-lg hover:bg-[#3da845]">
                    Monthly
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Monthly Applications
                  </h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                          vertical={false}
                        />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "6px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            fontSize: "11px",
                          }}
                        />
                        <Bar
                          dataKey="applications"
                          fill="#4eb956"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Status Distribution
                  </h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={applicationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={1}
                          dataKey="value"
                        >
                          {applicationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {applicationData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-xs text-gray-600">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Weekly Activity
                </h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="activity"
                        stroke="#4eb956"
                        fill="url(#activityGradient)"
                        strokeWidth={1.5}
                      />
                      <defs>
                        <linearGradient
                          id="activityGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4eb956"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4eb956"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Applications
                </h2>
                <button className="text-sm text-secondary font-medium hover:text-[#3da845]">
                  View all →
                </button>
              </div>

              <div className="space-y-3">
                {recentApplications.map((application, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-secondary hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-r from-secondary to-[#3da845] flex items-center justify-center text-white font-bold">
                        {application.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary">
                          {application.position}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-600">
                            {application.company}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <FiCalendar size={12} className="mr-1" />
                            {application.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          application.status === "New"
                            ? "bg-blue-100 text-blue-700"
                            : application.status === "Viewed"
                              ? "bg-green-100 text-green-700"
                              : application.status === "Processing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {application.status}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {application.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-4/12 w-full space-y-4">
            <div className="bg-linear-to-br from-[#1e2558] to-[#4eb956] rounded-xl p-4 text-white">
              <div className="flex items-start space-x-3">
                <div className="bg-white text-secondary bg-opacity-20 p-2 rounded-lg">
                  <FiTarget size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Pro Tip</h4>
                  <p className="text-xs opacity-90 leading-relaxed">
                    Complete your profile to get 3x more interview calls. Update
                    your skills regularly.
                  </p>
                </div>
              </div>
              <button className="w-full mt-3 py-2 bg-white text-[#4eb956] text-sm font-semibold rounded-lg hover:bg-opacity-95 transition-colors">
                Complete Profile
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-100 hover:border-[#4eb956] hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4eb956] to-[#3da845] flex items-center justify-center text-white mb-2 group-hover:scale-105 transition-transform">
                      {link.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-900 text-center mb-1">
                      {link.label}
                    </span>
                    {(link.count || link.version) && (
                      <span className="text-xs font-semibold text-[#4eb956]">
                        {link.count || link.version}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">
                  Dashboard Guide
                </h3>
                <FiPlay className="text-[#4eb956]" size={16} />
              </div>
              <div className="aspect-video bg-gradient-to-br from-[#1e2558] to-[#4eb956] rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                <button className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                  <FiPlay className="text-secondary" size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                5 min tutorial to maximize your job search success
              </p>
              <button className="w-full py-2.5 bg-gradient-to-r from-[#4eb956] to-[#3da845] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all">
                Watch Tutorial
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#1e2558] to-[#2c3e91] rounded-xl p-4 text-white">
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold">✨</span>
                </div>
                <h3 className="text-sm font-bold mb-2">Unlock Premium</h3>
                <p className="text-xs opacity-90 mb-3">
                  Access exclusive features
                </p>
                <ul className="space-y-2 mb-4 text-left">
                  <li className="flex items-center text-xs">
                    <FiCheckCircle className="mr-2" size={14} />
                    Priority Applications
                  </li>
                  <li className="flex items-center text-xs">
                    <FiCheckCircle className="mr-2" size={14} />
                    Advanced Analytics
                  </li>
                  <li className="flex items-center text-xs">
                    <FiCheckCircle className="mr-2" size={14} />
                    Direct HR Access
                  </li>
                </ul>
                <button className="w-full py-2.5 bg-white text-[#1e2558] text-sm font-bold rounded-lg hover:bg-opacity-95 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeekerDashboard;
