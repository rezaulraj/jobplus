import React, { useState } from "react";
import {
  FiHome,
  FiBell,
  FiPlus,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiTarget,
  FiClock,
  FiX,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

const SeekerJobsAlert = () => {
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      name: "Frontend Developer",
      keywords: "React, JavaScript, TypeScript",
      careerLevel: "Mid-Level",
      experience: "3-5 years",
      salary: "60,000 - 80,000 BDT",
      city: "Dhaka",
      status: "active",
      lastMatch: "Today, 10:30 AM",
      matches: 12,
    },
    {
      id: 2,
      name: "UI/UX Designer",
      keywords: "Figma, Adobe XD, Wireframing",
      careerLevel: "Junior",
      experience: "1-2 years",
      salary: "40,000 - 50,000 BDT",
      city: "Chittagong",
      status: "active",
      lastMatch: "Yesterday, 3:15 PM",
      matches: 8,
    },
    {
      id: 3,
      name: "Project Manager",
      keywords: "Agile, Scrum, Team Management",
      careerLevel: "Senior",
      experience: "6-10 years",
      salary: "100,000 - 150,000 BDT",
      city: "Remote",
      status: "paused",
      lastMatch: "2 days ago",
      matches: 5,
    },
  ]);

  const [formData, setFormData] = useState({
    alertName: "",
    keywords: "",
    keywordType: "jobTitle",
    careerLevel: "",
    experience: "",
    salary: "",
    city: "",
  });

  const careerLevels = [
    "Entry Level",
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Manager",
    "Director",
    "Executive",
  ];

  const experienceOptions = [
    "No experience",
    "Less than 1 year",
    "1-2 years",
    "3-5 years",
    "6-10 years",
    "11-15 years",
    "More than 15 years",
  ];

  const salaryRanges = [
    "20,000 - 40,000 BDT",
    "40,000 - 60,000 BDT",
    "60,000 - 80,000 BDT",
    "80,000 - 100,000 BDT",
    "100,000 - 150,000 BDT",
    "150,000 - 200,000 BDT",
    "200,000+ BDT",
    "Negotiable",
  ];

  const cities = [
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Khulna",
    "Rajshahi",
    "Barisal",
    "Rangpur",
    "Remote",
    "Any",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAlert = {
      id: alerts.length + 1,
      name: formData.alertName,
      keywords: formData.keywords,
      careerLevel: formData.careerLevel,
      experience: formData.experience,
      salary: formData.salary,
      city: formData.city,
      status: "active",
      lastMatch: "Just now",
      matches: 0,
    };
    setAlerts((prev) => [...prev, newAlert]);
    setShowCreateAlert(false);
    setFormData({
      alertName: "",
      keywords: "",
      keywordType: "jobTitle",
      careerLevel: "",
      experience: "",
      salary: "",
      city: "",
    });
  };

  const toggleAlertStatus = (id) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              status: alert.status === "active" ? "paused" : "active",
            }
          : alert,
      ),
    );
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-2">
          <div className="py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FiHome size={16} />
              <span>/</span>
              <span className="text-[#1e2558] font-medium">My Job Alerts</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Manage Your Job Alerts
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-gray-600">
              Get notified when jobs matching your criteria are posted
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Active: {alerts.filter((a) => a.status === "active").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Paused: {alerts.filter((a) => a.status === "paused").length}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowCreateAlert(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#4eb956] to-[#3da844] text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <FiPlus size={20} /> Create Alert
          </button>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {alert.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          alert.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {alert.status === "active" ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiClock size={14} />
                      <span>Last match: {alert.lastMatch}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlertStatus(alert.id)}
                      className={`p-2 rounded-lg ${
                        alert.status === "active"
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                      title={
                        alert.status === "active"
                          ? "Pause Alert"
                          : "Activate Alert"
                      }
                    >
                      {alert.status === "active" ? "⏸️" : "▶️"}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      title="Delete Alert"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FiSearch
                      className="text-gray-400 mt-1 shrink-0"
                      size={16}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Keywords</p>
                      <p className="text-gray-900">{alert.keywords}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <FiBriefcase
                        className="text-gray-400 mt-1 shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Career Level</p>
                        <p className="text-gray-900">{alert.careerLevel}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiTarget
                        className="text-gray-400 mt-1 shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-gray-900">{alert.experience}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiDollarSign
                        className="text-gray-400 mt-1 shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="text-gray-900">{alert.salary}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiMapPin
                        className="text-gray-400 mt-1 shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="text-gray-900">{alert.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiBell className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recent Matches</p>
                      <p className="font-semibold text-gray-900">
                        {alert.matches} new jobs
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    View Matches
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {alerts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBell className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Job Alerts Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first job alert to get notified when matching jobs are
              posted
            </p>
            <button
              onClick={() => setShowCreateAlert(true)}
              className="px-8 py-3 bg-gradient-to-r from-[#4eb956] to-[#3da844] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <FiPlus className="inline mr-2" /> Create Your First Alert
            </button>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-[#1e2558] to-[#4eb956] rounded-2xl p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
              <FiAlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">
                Tips for Effective Job Alerts
              </h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>
                    Use specific keywords related to your skills and desired
                    role
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>
                    Set realistic salary expectations based on your experience
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>
                    Choose multiple cities or "Remote" for more opportunities
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>
                    Pause alerts when you're not actively job searching
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="mt-1 shrink-0" />
                  <span>
                    Regularly update your alerts as your career goals evolve
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {showCreateAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Create Job Alert
                </h3>
                <p className="text-gray-600 mt-1">
                  Please fill the form to create job alert for
                </p>
              </div>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Name *
                    <span className="text-xs text-gray-500 ml-2">
                      (e.g., "Frontend Developer Jobs")
                    </span>
                  </label>
                  <input
                    type="text"
                    name="alertName"
                    value={formData.alertName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                    placeholder="Enter alert name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords *
                    <span className="text-xs text-gray-500 ml-2">
                      (Separate with commas)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                    placeholder="e.g., React, JavaScript, Frontend"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Keyword is *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Job Title", "Skills", "Company"].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.keywordType ===
                          type.toLowerCase().replace(" ", "")
                            ? "border-[#4eb956] bg-green-50 text-[#4eb956]"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="keywordType"
                          value={type.toLowerCase().replace(" ", "")}
                          checked={
                            formData.keywordType ===
                            type.toLowerCase().replace(" ", "")
                          }
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Career Level *
                  </label>
                  <select
                    name="careerLevel"
                    value={formData.careerLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                    required
                  >
                    <option value="">Select career level</option>
                    {careerLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Experience *
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                    required
                  >
                    <option value="">Select experience</option>
                    {experienceOptions.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Expected Salary (BDT) *
                  </label>
                  <select
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                    required
                  >
                    <option value="">Select salary range</option>
                    {salaryRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                    required
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateAlert(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#4eb956] to-[#3da844] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Create Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerJobsAlert;
