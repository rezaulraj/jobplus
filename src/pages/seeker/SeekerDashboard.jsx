import React, { useState, useEffect, useCallback } from "react";
import {
  FiBriefcase,
  FiHeart,
  FiBell,
  FiFileText,
  FiTrendingUp,
  FiSettings,
  FiCheckCircle,
  FiPlay,
  FiEye,
  FiCalendar,
  FiTarget,
  FiLoader,
  FiAward,
  FiMapPin,
  FiMail,
  FiPhone,
  FiArrowUpRight,
  FiStar,
  FiUser,
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
import useSeekerStore from "../../store/seekerStore";
import useJobStore from "../../store/JobStore";
import useAuthStore from "../../store/authStore";

const EM = "#10b981";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({
  label,
  value,
  change,
  icon: Icon,
  delay = 0,
  loading = false,
}) => (
  <div
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
        <Icon size={14} className="text-emerald-600" />
      </span>
    </div>
    <div className="flex items-end justify-between">
      {loading ? (
        <div className="h-8 w-12 bg-gray-100 animate-pulse rounded-lg" />
      ) : (
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      )}
      {change && !loading && (
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
          <FiArrowUpRight size={10} /> {change}
        </span>
      )}
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
        <Icon size={15} className="text-emerald-600" />
      </span>
      <h2 className="font-bold text-gray-800 text-sm tracking-tight">
        {title}
      </h2>
    </div>
    {action}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-emerald-100 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-gray-700">{label}</p>
      <p className="text-emerald-600 font-semibold">{payload[0].value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    applied: "bg-sky-50 text-sky-700 border-sky-100",
    under_review: "bg-amber-50 text-amber-700 border-amber-100",
    reviewed: "bg-purple-50 text-purple-700 border-purple-100",
    shortlisted: "bg-rose-50 text-rose-700 border-rose-100",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
    pending: "bg-gray-50 text-gray-500 border-gray-100",
  };
  const labels = {
    applied: "Applied",
    under_review: "Under Review",
    reviewed: "Reviewed",
    shortlisted: "Shortlisted",
    accepted: "Accepted",
    rejected: "Rejected",
    pending: "Pending",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded-full border ${map[status] || "bg-gray-50 text-gray-500 border-gray-100"}`}
    >
      {labels[status] || status}
    </span>
  );
};

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const SeekerDashboard = () => {
  const { fetchSeekerProfile, fetchMyApplications } = useSeekerStore();
  const { fetchJobById } = useJobStore();
  const { user } = useAuthStore();

  const [pageLoading, setPageLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [profile, setProfile] = useState({
    personalInfo: null,
    summary: "",
    experiences: [],
    skills: [],
    education: [],
    preferences: null,
    projects: [],
    languages: [],
    profileImage: null,
    videoCV: null,
  });

  // ── Real application stats ───
  const [appStats, setAppStats] = useState({
    total: 0,
    shortlisted: 0,
    savedJobs: 0,
    profileViews: 0,
    statusBreakdown: {},
    recentItems: [],
    monthlyData: [],
  });

  // ── Load profile ────
  const loadProfile = useCallback(async () => {
    const result = await fetchSeekerProfile();
    if (result?.success && result?.data) {
      const d = result.data;
      setProfile({
        personalInfo: d.personalInfo || null,
        summary: d.summary || "",
        experiences: d.experience || [],
        skills: d.skills || [],
        education: d.education || [],
        preferences: d.jobPreferences || null,
        projects: d.projects || [],
        languages: d.languages || [],
        profileImage: d.profileImage || null,
        videoCV: d.videoCV || null,
      });
    }
  }, [fetchSeekerProfile]);

  // ── Load application stats ──────────────────────────────────────────────────
  const loadApplicationStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      // Fetch all applications
      const result = await fetchMyApplications({ page: 1, limit: 100 });
      if (!result?.success) return;

      const items = result.data?.items || result.data || [];
      const meta = result.data?.meta || result.meta || {};

      // --- Count by status ---
      const statusBreakdown = {};
      let totalProfileViews = 0;
      items.forEach((app) => {
        const s = app.status || "applied";
        statusBreakdown[s] = (statusBreakdown[s] || 0) + 1;
        totalProfileViews += app.profileViews || 0;
      });

      const totalApplications = meta.total ?? items.length;
      const shortlistedCount = statusBreakdown["shortlisted"] || 0;

      // --- Monthly breakdown ---
      const monthMap = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString("en-US", { month: "short" });
        monthMap[key] = 0;
      }
      items.forEach((app) => {
        if (!app.createdAt) return;
        const d = new Date(app.createdAt);
        const key = d.toLocaleDateString("en-US", { month: "short" });
        if (key in monthMap) monthMap[key]++;
      });
      const monthlyData = Object.entries(monthMap).map(
        ([month, applications]) => ({
          month,
          applications,
        }),
      );

      // --- Enrich recent 5 applications with job info ---
      const recent = [...items]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const enriched = await Promise.all(
        recent.map(async (app) => {
          if (!app.jobId) return { ...app, job: null };
          const jobResult = await fetchJobById(app.jobId);
          return { ...app, job: jobResult?.success ? jobResult.data : null };
        }),
      );

      setAppStats({
        total: totalApplications,
        shortlisted: shortlistedCount,
        savedJobs: 0, // no saved-jobs API provided; hardcode 0
        profileViews: totalProfileViews,
        statusBreakdown,
        recentItems: enriched,
        monthlyData,
      });
    } finally {
      setStatsLoading(false);
    }
  }, [fetchMyApplications, fetchJobById]);

  // ── Bootstrap ───────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setPageLoading(true);
      await Promise.all([loadProfile(), loadApplicationStats()]);
      setPageLoading(false);
    })();
  }, [loadProfile, loadApplicationStats]);

  // ── Profile completion ───────────────────────────────────────────────────
  const completionItems = [
    { label: "Personal Info", done: !!profile.personalInfo },
    { label: "Work History", done: profile.experiences.length > 0 },
    { label: "Education", done: profile.education.length > 0 },
    { label: "Profile Picture", done: !!profile.profileImage },
    { label: "Summary", done: !!profile.summary },
    { label: "Skills", done: profile.skills.length > 0 },
    { label: "Projects", done: profile.projects.length > 0 },
    { label: "Languages", done: profile.languages.length > 0 },
    { label: "Job Preferences", done: !!profile.preferences },
    { label: "Video CV", done: !!profile.videoCV },
  ];
  const pct = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) *
      100,
  );

  const displayName =
    profile.personalInfo?.name || user?.fullName || "Your Name";
  const displayEmail = profile.personalInfo?.email || user?.email || "";
  const displayMobile = profile.personalInfo?.mobile || "";
  const displayCity = [
    profile.personalInfo?.city,
    profile.personalInfo?.country,
  ]
    .filter(Boolean)
    .join(", ");
  const careerLevel = profile.personalInfo?.careerLevel || "";

  // ── Pie chart data from real status breakdown ────────────────────────────
  const STATUS_COLORS = {
    applied: "#10b981",
    under_review: "#f59e0b",
    reviewed: "#8b5cf6",
    shortlisted: "#059669",
    accepted: "#34d399",
    rejected: "#f87171",
    pending: "#9ca3af",
  };
  const STATUS_LABELS = {
    applied: "Applied",
    under_review: "Under Review",
    reviewed: "Reviewed",
    shortlisted: "Shortlisted",
    accepted: "Accepted",
    rejected: "Rejected",
    pending: "Pending",
  };

  const pieData = Object.entries(appStats.statusBreakdown).map(
    ([key, val]) => ({
      name: STATUS_LABELS[key] || key,
      value: val,
      color: STATUS_COLORS[key] || "#9ca3af",
    }),
  );

  const activityData = [
    { day: "Mon", activity: 40 },
    { day: "Tue", activity: 60 },
    { day: "Wed", activity: 55 },
    { day: "Thu", activity: 75 },
    { day: "Fri", activity: 65 },
    { day: "Sat", activity: 45 },
    { day: "Sun", activity: 35 },
  ];

  const stats = [
    {
      label: "Total Applications",
      value: appStats.total,
      change: "",
      icon: FiBriefcase,
    },
    {
      label: "Profile Views",
      value: appStats.profileViews,
      change: "",
      icon: FiEye,
    },
    {
      label: "Saved Jobs",
      value: appStats.savedJobs,
      change: "",
      icon: FiHeart,
    },
    {
      label: "Shortlisted",
      value: appStats.shortlisted,
      change: "",
      icon: HiOutlineClipboardCheck,
    },
  ];

  const quickLinks = [
    {
      icon: FiHeart,
      label: "Saved Jobs",
      path: "/seeker/saved-jobs",
      count: appStats.savedJobs,
    },
    {
      icon: FiBell,
      label: "Job Alerts",
      path: "/seeker/job-alerts",
      count: null,
    },
    { icon: FiFileText, label: "My CV", path: "/seeker/cv-upload" },
    {
      icon: FiBriefcase,
      label: "Applications",
      path: "/seeker/applied-jobs",
      count: appStats.total,
    },
    { icon: FiTrendingUp, label: "Career Tips", path: "/features/career-tips" },
    {
      icon: FiEye,
      label: "Profile Views",
      path: "/seeker/profile",
      count: appStats.profileViews,
    },
    { icon: FiSettings, label: "Settings", path: "" },
    { icon: FiAward, label: "Achievements", path: "" },
  ];

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-200">
            <FiLoader size={28} className="text-white animate-spin" />
          </div>
          <p className="text-gray-500 font-medium text-sm">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 font-sans">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="py-3 flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="font-bold text-gray-800">Dashboard</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stat cards — real data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} delay={i * 60} loading={statsLoading} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-8/12 space-y-4">
            <Card>
              {/* Banner */}
              <div className="relative h-32 md:h-36 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400" />
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 left-12 w-28 h-28 rounded-full bg-emerald-700/30" />
              </div>

              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10">
                  <div className="flex items-end gap-4">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gray-100 overflow-hidden">
                        {profile.profileImage ? (
                          <img
                            src={profile.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                            <FiUser size={28} className="text-emerald-400" />
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="pb-1">
                      <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        {displayName}
                      </h1>
                      {careerLevel && (
                        <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100 mt-0.5">
                          {careerLevel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full sm:w-48 pt-20 pb-1">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">
                        Profile Strength
                      </span>
                      <span className="font-bold text-emerald-600">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {completionItems.filter((i) => !i.done).length > 0
                        ? `${completionItems.filter((i) => !i.done).length} sections incomplete`
                        : "Profile 100% complete! 🎉"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-gray-50">
                  {displayEmail && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FiMail size={12} className="text-emerald-500" />
                      <span>{displayEmail}</span>
                    </div>
                  )}
                  {displayMobile && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FiPhone size={12} className="text-emerald-500" />
                      <span>{displayMobile}</span>
                    </div>
                  )}
                  {displayCity && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FiMapPin size={12} className="text-emerald-500" />
                      <span>{displayCity}</span>
                    </div>
                  )}
                  {profile.preferences?.jobTypes?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FiTarget size={12} className="text-emerald-500" />
                      <span>
                        {profile.preferences.jobTypes.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {profile.skills.slice(0, 6).map((s) => (
                      <span
                        key={s.skillId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full border border-emerald-100"
                      >
                        <FiStar size={9} /> {s.skill}
                      </span>
                    ))}
                    {profile.skills.length > 6 && (
                      <span className="px-2.5 py-1 text-[10px] font-semibold text-gray-400 bg-gray-50 rounded-full border border-gray-100">
                        +{profile.skills.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Analytics */}
            <Card>
              <SectionHeader
                icon={FiTrendingUp}
                title="Application Analytics"
                action={
                  <div className="flex gap-1.5">
                    <button className="px-3 py-1.5 text-[11px] font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      Weekly
                    </button>
                    <button className="px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all">
                      Monthly
                    </button>
                  </div>
                }
              />
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bar chart — real monthly data */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-700 mb-3">
                      Monthly Applications
                    </p>
                    {statsLoading ? (
                      <div className="h-40 flex items-center justify-center">
                        <FiLoader
                          size={20}
                          className="text-emerald-400 animate-spin"
                        />
                      </div>
                    ) : (
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={appStats.monthlyData} barSize={10}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0fdf4"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="month"
                              stroke="#9ca3af"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#9ca3af"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              allowDecimals={false}
                            />
                            <Tooltip
                              content={<CustomTooltip />}
                              cursor={{ fill: "#ecfdf5" }}
                            />
                            <Bar
                              dataKey="applications"
                              fill={EM}
                              radius={[6, 6, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Pie chart — real status distribution */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-700 mb-3">
                      Status Distribution
                    </p>
                    {statsLoading ? (
                      <div className="h-40 flex items-center justify-center">
                        <FiLoader
                          size={20}
                          className="text-emerald-400 animate-spin"
                        />
                      </div>
                    ) : pieData.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-xs text-gray-400">
                        No applications yet
                      </div>
                    ) : (
                      <>
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={38}
                                outerRadius={58}
                                paddingAngle={2}
                                dataKey="value"
                                strokeWidth={0}
                              >
                                {pieData.map((e, i) => (
                                  <Cell key={i} fill={e.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  borderRadius: 12,
                                  border: "none",
                                  fontSize: 11,
                                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {pieData.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-[10px] text-gray-600 font-medium">
                                {item.name}: {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Area chart */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-700 mb-3">
                    Weekly Activity
                  </p>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient
                            id="actGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={EM}
                              stopOpacity={0.25}
                            />
                            <stop offset="95%" stopColor={EM} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                        <XAxis
                          dataKey="day"
                          stroke="#9ca3af"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ stroke: "#d1fae5", strokeWidth: 1 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="activity"
                          stroke={EM}
                          fill="url(#actGrad)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent applications — real enriched data */}
            <Card>
              <SectionHeader
                icon={FiBriefcase}
                title="Recent Applications"
                action={
                  <Link
                    to="/seeker/applied-jobs"
                    className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    View all <FiArrowUpRight size={11} />
                  </Link>
                }
              />
              <div className="p-2">
                {statsLoading ? (
                  <div className="space-y-2 p-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-14 bg-gray-50 animate-pulse rounded-2xl"
                      />
                    ))}
                  </div>
                ) : appStats.recentItems.length === 0 ? (
                  <div className="py-10 text-center text-xs text-gray-400">
                    No applications yet.{" "}
                    <Link
                      to="/jobs"
                      className="text-emerald-600 font-semibold underline"
                    >
                      Browse jobs
                    </Link>
                  </div>
                ) : (
                  appStats.recentItems.map((app, i) => (
                    <div
                      key={app._id || i}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-emerald-50/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-emerald-200 shrink-0">
                          {app.job?.company?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-tight">
                            {app.job?.title || "—"}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-gray-500">
                              {app.job?.company || "—"}
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                              <FiCalendar size={10} />{" "}
                              {formatDate(app.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge status={app.status} />
                        <span className="text-[10px] text-gray-400">
                          {formatDate(app.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:w-4/12 space-y-4">
            <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-600 to-teal-500 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-6 -translate-x-4" />
              <div className="relative">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <FiTarget size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Pro Tip</p>
                    <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
                      Complete your profile to get 3× more interview calls. Your
                      profile is {pct}% complete.
                    </p>
                  </div>
                </div>
                <Link to="/seeker/profile">
                  <button className="w-full py-2 bg-white text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-50 active:scale-95 transition-all">
                    Complete Profile →
                  </button>
                </Link>
              </div>
            </div>

            {/* Completion tracker */}
            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-gray-800 tracking-tight">
                    Profile Completion
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="space-y-2.5">
                  {completionItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${item.done ? "bg-emerald-500 shadow-sm shadow-emerald-200" : "border-2 border-gray-200"}`}
                      >
                        {item.done && (
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 12 10"
                            fill="none"
                          >
                            <path
                              d="M1 5l3.5 3.5L11 1"
                              stroke="white"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-xs ${item.done ? "text-gray-700 font-semibold" : "text-gray-400"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick links — counts from real data */}
            <Card>
              <SectionHeader icon={FiTarget} title="Quick Links" />
              <div className="p-4 grid grid-cols-2 gap-2">
                {quickLinks.map((link, i) => (
                  <Link
                    key={i}
                    to={link.path}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40 active:scale-95 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white mb-2 group-hover:scale-105 transition-transform shadow-sm shadow-emerald-100">
                      <link.icon size={15} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">
                      {link.label}
                    </span>
                    {link.count != null && (
                      <span className="text-[10px] font-bold text-emerald-600 mt-0.5">
                        {statsLoading ? "…" : link.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </Card>

            {/* Tutorial card */}
            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-gray-800 tracking-tight">
                    Dashboard Guide
                  </h3>
                  <FiPlay size={14} className="text-emerald-500" />
                </div>
                <div className="aspect-video bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center mb-3 overflow-hidden relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <button className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 active:scale-95 transition-all">
                    <FiPlay size={18} className="text-white ml-0.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  5 min tutorial to maximize your job search success
                </p>
                <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm shadow-emerald-200">
                  Watch Tutorial
                </button>
              </div>
            </Card>

            {/* Premium upsell */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-gray-800 to-gray-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/10 -translate-y-12 translate-x-12" />
              <div className="relative text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="text-sm font-bold mb-1">Unlock Premium</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Access exclusive features to supercharge your job search
                </p>
                <ul className="space-y-2 mb-4 text-left">
                  {[
                    "Priority Applications",
                    "Advanced Analytics",
                    "Direct HR Access",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-gray-300"
                    >
                      <FiCheckCircle
                        size={12}
                        className="text-emerald-400 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm shadow-emerald-900">
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
