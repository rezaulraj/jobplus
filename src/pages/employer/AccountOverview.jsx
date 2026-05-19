import React, { useEffect, useState } from "react";
import useCompanyStore from "../../store/companyStore";
import useSubscriptionStore from "../../store/subscriptionStore";

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const Icon = {
  Check: () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#4eb956" />
      <path
        d="M4.5 8l2.5 2.5 4.5-5"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Crown: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 12h12l-1.5-6L9 9 8 4 7 9 3.5 6z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 14V4l5-2v12H2zm7 0V6l5-2v10H9zm-5-8h1v1H4V6zm0 3h1v1H4V9zm5-1h1v1H9V8zm0 3h1v1H9v-1z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.5 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM11 7a2 2 0 100-4 2 2 0 000 4zM1 13c0-2 2-3.5 4.5-3.5S10 11 10 13H1zm9.5-1c0-1-.4-2-1.1-2.8A5.5 5.5 0 0115 13h-4.5z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.5c.7 0 1.6 1 2.1 2.5H5.9C6.4 3.5 7.3 2.5 8 2.5zM3.2 5.5h9.6c.1.5.2 1 .2 1.5v.5H3V7c0-.5.1-1 .2-1.5zm-.1 3.5h9.8c-.2.5-.4 1-.7 1.5-.5.8-1.1 1.2-1.7 1.4V11H5.5v.4c-.6-.2-1.2-.6-1.7-1.4-.3-.5-.5-1-.7-1.5H3.1z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5 1v1.5H3.5A1.5 1.5 0 002 4v9a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0014 13V4a1.5 1.5 0 00-1.5-1.5H11V1H9.5v1.5h-3V1H5zm-1.5 5h9v7h-9V6z" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9 1L3 9h5l-1 6 7-8H9z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 3a1 1 0 011-1h2a1 1 0 011 1v.5h3A1.5 1.5 0 0114.5 5v7A1.5 1.5 0 0113 13.5H3A1.5 1.5 0 011.5 12V5A1.5 1.5 0 013 3.5h3V3zm1 .5v.5h2V3.5H7zM3 5v7h10V5H3z" />
    </svg>
  ),
  Dot: ({ active }) => (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
        active ? "animate-pulse" : "bg-gray-300"
      }`}
      style={active ? { background: "#4eb956" } : {}}
    />
  ),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysLeft(dateStr) {
  if (!dateStr) return null;
  return Math.max(0, Math.ceil((new Date(dateStr) - new Date()) / 86400000));
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PLAN_FEATURES = {
  free: [
    "3 active job posts",
    "Basic candidate search",
    "Email support",
    "Standard listing",
  ],
  basic: [
    "5 active job posts",
    "Advanced candidate search",
    "Priority email support",
    "Featured listing badge",
    "Basic analytics",
  ],
  premium: [
    "10 active job posts",
    "AI-powered candidate matching",
    "Priority phone & email support",
    "Featured & boosted listings",
    "Advanced analytics",
    "Unlimited candidate views",
  ],
  enterprise: [
    "Unlimited job posts",
    "Dedicated account manager",
    "Custom branding",
    "Full analytics suite",
    "API access",
    "SLA guarantee",
    "Onboarding assistance",
  ],
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// ── Tab Bar ───────────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-1 shadow-sm gap-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            active === t.id
              ? "text-white shadow"
              : "text-gray-500 hover:text-gray-800"
          }`}
          style={active === t.id ? { background: "#1e2558" } : {}}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Company Hero Card ─────────────────────────────────────────────────────────
function CompanyHeroCard({ company }) {
  const plan = company?.plan;
  const remaining = daysLeft(plan?.premiumUntil);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-5">
      {/* top color bar */}
      <div
        className="h-1.5"
        style={{
          background: "linear-gradient(90deg, #1e2558 0%, #4eb956 100%)",
        }}
      />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            {company?.companyLogo ? (
              <img
                src={company.companyLogo}
                alt={company.nameCompany}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                style={{ background: "#1e2558" }}
              >
                {company?.nameCompany?.[0] || "C"}
              </div>
            )}
            {company?.isPremium && (
              <span
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow"
                style={{ background: "#4eb956" }}
              >
                <Icon.Crown />
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2
                className="text-2xl font-black text-gray-900 truncate"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {company?.nameCompany}
              </h2>
              {company?.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                  <Icon.Check /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {company?.tagline || company?.industry}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2">
              {company?.industry && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                  <Icon.Building /> {company.industry}
                </span>
              )}
              {company?.companySize && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                  <Icon.Users /> {company.companySize}
                </span>
              )}
              {company?.foundedYear && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                  <Icon.Calendar /> Est. {company.foundedYear}
                </span>
              )}
              {company?.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:opacity-80"
                  style={{
                    background: "#f0faf0",
                    color: "#4eb956",
                    borderColor: "#c6edc7",
                  }}
                >
                  <Icon.Globe /> Website ↗
                </a>
              )}
            </div>
          </div>

          {/* Plan badge */}
          {plan && (
            <div className="flex-shrink-0 sm:text-right self-start">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1.5">
                Current Plan
              </p>
              <span
                className="inline-block text-sm font-bold capitalize px-4 py-1.5 rounded-xl border"
                style={{
                  background: "#eef9ef",
                  color: "#1e2558",
                  borderColor: "#c6edc7",
                }}
              >
                {plan.planKey}
              </span>
              {remaining !== null && (
                <p
                  className={`text-xs mt-1.5 font-medium ${remaining <= 7 ? "text-red-500" : "text-gray-400"}`}
                >
                  {remaining}d remaining
                </p>
              )}
            </div>
          )}
        </div>

        {/* Stats strip */}
        {plan && (
          <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Job Slots",
                value: plan.activeJobLimit ?? "∞",
                icon: <Icon.Briefcase />,
              },
              {
                label: "Monthly Posts",
                value: plan.monthlyPostLimit ?? "∞",
                icon: <Icon.Zap />,
              },
              {
                label: "AI Credits",
                value: plan.aiCreditsMonthly ?? "0",
                icon: <Icon.Star />,
              },
              {
                label: "Renews",
                value: formatDate(plan.premiumUntil),
                icon: <Icon.Calendar />,
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  {icon} {label}
                </div>
                <p
                  className="text-base font-black"
                  style={{ color: "#1e2558" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan, isCurrent, isPopular }) {
  const key = plan?.planKey?.toLowerCase() || "free";
  const features = PLAN_FEATURES[key] || plan?.features || [];
  const price = plan?.price ?? plan?.monthlyPrice ?? null;
  const name = plan?.name || plan?.planKey || "Plan";

  return (
    <div
      className="relative flex flex-col rounded-3xl bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        border: isCurrent ? "2px solid #4eb956" : "1px solid #e5e7eb",
        boxShadow: isCurrent ? "0 4px 24px rgba(78,185,86,0.12)" : undefined,
      }}
    >
      {/* top accent */}
      <div
        className="h-1"
        style={{
          background: isCurrent
            ? "#4eb956"
            : isPopular
              ? "linear-gradient(90deg, #1e2558, #4eb956)"
              : "#f3f4f6",
        }}
      />

      {isCurrent && (
        <div
          className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ background: "#4eb956" }}
        >
          Your Plan
        </div>
      )}
      {isPopular && !isCurrent && (
        <div
          className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border"
          style={{
            background: "#eef9ef",
            color: "#4eb956",
            borderColor: "#c6edc7",
          }}
        >
          Popular
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-0.5">
          Plan
        </p>
        <h3
          className="text-xl font-black text-gray-900 capitalize mb-3"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {name}
        </h3>

        {price !== null && price > 0 ? (
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-black" style={{ color: "#1e2558" }}>
              ${price}
            </span>
            <span className="text-sm text-gray-400 mb-1.5">/mo</span>
          </div>
        ) : (
          <span className="text-4xl font-black text-gray-900 mb-1">Free</span>
        )}

        <div className="border-t border-gray-100 my-4" />

        <ul className="flex-1 space-y-2.5 mb-5">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <span className="mt-0.5">
                <Icon.Check />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <button
          disabled={isCurrent}
          className="w-full py-3 rounded-2xl text-sm font-bold transition-all duration-200"
          style={
            isCurrent
              ? {
                  background: "#eef9ef",
                  color: "#4eb956",
                  cursor: "default",
                  border: "1.5px solid #c6edc7",
                }
              : { background: "#1e2558", color: "#fff", cursor: "pointer" }
          }
        >
          {isCurrent ? "✓ Current Plan" : "Upgrade Now"}
        </button>
      </div>
    </div>
  );
}

// ── Subscription Detail ───────────────────────────────────────────────────────
function SubscriptionDetail({ plan }) {
  const remaining = daysLeft(plan?.premiumUntil);
  const features = PLAN_FEATURES[plan?.planKey?.toLowerCase()] || [];
  const isActive = plan?.planStatus === "active";
  const usedDays = Math.max(0, 30 - (remaining ?? 30));
  const pct = Math.min(100, Math.round((usedDays / 30) * 100));

  return (
    <div className="space-y-4">
      {/* Main card */}
      <div
        className="bg-white rounded-3xl overflow-hidden shadow-md"
        style={{ border: "2px solid #4eb956" }}
      >
        <div
          className="h-1.5"
          style={{
            background: "linear-gradient(90deg, #1e2558 0%, #4eb956 100%)",
          }}
        />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                Active Plan
              </p>
              <h3
                className="text-4xl font-black capitalize"
                style={{ color: "#1e2558", fontFamily: "'Georgia', serif" }}
              >
                {plan.planKey}
              </h3>
            </div>
            <div className="flex items-center gap-2 self-start">
              <Icon.Dot active={isActive} />
              <span
                className={`text-sm font-bold capitalize px-4 py-1.5 rounded-full border ${
                  isActive
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {plan.planStatus}
              </span>
            </div>
          </div>

          {/* Usage boxes */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Job Slots",
                value: plan.activeJobLimit ?? "∞",
                icon: <Icon.Briefcase />,
              },
              {
                label: "Monthly Posts",
                value: plan.monthlyPostLimit ?? "∞",
                icon: <Icon.Zap />,
              },
              {
                label: "AI Credits",
                value: plan.aiCreditsMonthly ?? "0",
                icon: <Icon.Star />,
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center"
              >
                <div className="flex justify-center text-gray-400 mb-1.5">
                  {icon}
                </div>
                <p className="text-2xl font-black" style={{ color: "#1e2558" }}>
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Period progress */}
          {plan.premiumUntil && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-sm font-semibold text-gray-700">
                  Billing period
                </span>
                <span
                  className={`text-sm font-bold ${remaining !== null && remaining <= 7 ? "text-red-500" : "text-gray-500"}`}
                >
                  {remaining} days remaining
                </span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #1e2558, #4eb956)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                <span>Renews {formatDate(plan.premiumUntil)}</span>
                <span>{pct}% used</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Included features */}
      {features.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            What's Included
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2.5 text-sm text-gray-700"
              >
                <Icon.Check /> {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription ID */}
      {plan?.planMeta?.subscriptionId && (
        <div className="bg-white rounded-2xl border border-gray-200 px-5 py-3.5 flex items-center justify-between shadow-sm">
          <span className="text-xs font-medium text-gray-400">
            Subscription ID
          </span>
          <span className="text-xs font-mono text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
            {plan.planMeta.subscriptionId}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ message, action, onAction }) {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-14 flex flex-col items-center text-center shadow-sm">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4"
        style={{ background: "#1e2558" }}
      >
        <Icon.Crown />
      </div>
      <p className="text-gray-700 font-semibold mb-1">{message}</p>
      <p className="text-sm text-gray-400 mb-5">
        Get started by choosing a plan.
      </p>
      {action && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "#4eb956" }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const AccountOverview = () => {
  const {
    company,
    isLoading: companyLoading,
    fetchMyCompany,
  } = useCompanyStore();
  const {
    plans,
    isLoading: plansLoading,
    isLoadingMyPlan,
    fetchPlans,
    fetchMySubscription,
  } = useSubscriptionStore();

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchMyCompany({ silent: true });
    fetchPlans();
    fetchMySubscription({ silent: true });
  }, []);

  const currentPlanKey = company?.plan?.planKey;

  const displayPlans =
    plans.length > 0
      ? plans
      : [
          { planKey: "free", name: "Free", price: 0 },
          { planKey: "basic", name: "Basic", price: 29 },
          { planKey: "premium", name: "Premium", price: 79 },
          { planKey: "enterprise", name: "Enterprise", price: 199 },
        ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "plans", label: "All Plans" },
    { id: "subscription", label: "My Subscription" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-7">
          <p
            className="text-xs uppercase tracking-widest font-bold mb-1"
            style={{ color: "#4eb956" }}
          >
            Dashboard
          </p>
          <h1
            className="text-3xl sm:text-4xl font-black text-gray-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Account Overview
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-7">
          <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        {/* ── Overview tab ── */}
        {activeTab === "overview" && (
          <div>
            {companyLoading ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-5 shadow-sm">
                <div className="flex gap-5">
                  <Skeleton className="w-24 h-24 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-3 pt-1">
                    <Skeleton className="h-6 w-52" />
                    <Skeleton className="h-4 w-36" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-7 w-24 rounded-full" />
                      <Skeleton className="h-7 w-28 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ) : company ? (
              <CompanyHeroCard company={company} />
            ) : (
              <EmptyState
                message="No company profile found."
                action="View Plans"
                onAction={() => setActiveTab("plans")}
              />
            )}

            {/* Info cards */}
            {company && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    label: "Plan Status",
                    value: company?.plan?.planStatus || "Free",
                    dot: true,
                  },
                  {
                    label: "Plan Type",
                    value: company?.plan?.planKey || "Free",
                    dot: false,
                  },
                  {
                    label: "Company Size",
                    value: company?.companySize || "—",
                    dot: false,
                  },
                  {
                    label: "Member Since",
                    value: formatDate(company?.createdAt),
                    dot: false,
                  },
                ].map(({ label, value, dot }) => (
                  <div
                    key={label}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                      {label}
                    </p>
                    <div className="flex items-center gap-2">
                      {dot && <Icon.Dot active={value === "active"} />}
                      <p
                        className="text-sm font-black capitalize"
                        style={{ color: "#1e2558" }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Plans tab ── */}
        {activeTab === "plans" && (
          <div>
            <div className="mb-6">
              <h2
                className="text-xl font-black text-gray-900 mb-1"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Choose Your Plan
              </h2>
              <p className="text-sm text-gray-500">
                Scale your hiring with the right features.
              </p>
            </div>

            {plansLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-3"
                  >
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-full rounded-2xl" />
                    {[...Array(4)].map((__, j) => (
                      <Skeleton key={j} className="h-3 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayPlans.map((plan, i) => (
                  <PlanCard
                    key={plan.planKey || i}
                    plan={plan}
                    isCurrent={plan.planKey === currentPlanKey}
                    isPopular={plan.planKey === "premium"}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Subscription tab ── */}
        {activeTab === "subscription" && (
          <div>
            <div className="mb-6">
              <h2
                className="text-xl font-black text-gray-900 mb-1"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                My Subscription
              </h2>
              <p className="text-sm text-gray-500">
                Active plan details, usage, and billing.
              </p>
            </div>

            {isLoadingMyPlan || companyLoading ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-4">
                <Skeleton className="h-10 w-40" />
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-2xl" />
                  ))}
                </div>
                <Skeleton className="h-14 rounded-2xl" />
              </div>
            ) : company?.plan ? (
              <SubscriptionDetail plan={company.plan} />
            ) : (
              <EmptyState
                message="No active subscription."
                action="Browse Plans"
                onAction={() => setActiveTab("plans")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOverview;
