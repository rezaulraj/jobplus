import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./authStore";
import { useEffect, useState } from "react";
import axios from "axios";

// ── Splash Loader ────────────────────────────────────────────────────────────
const SplashLoader = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)",
      zIndex: 9999,
      animation: "fadeIn 0.2s ease",
    }}
  >
    <style>{`
      @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
      @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin    { from { transform: rotate(-90deg); } to { transform: rotate(270deg); } }
    `}</style>

    {/* Spinner ring */}
    <div
      style={{ position: "relative", width: 80, height: 80, marginBottom: 24 }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        style={{ animation: "pulse 2s ease-in-out infinite" }}
      >
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#d1fae5"
          strokeWidth="5"
        />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#10b981"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="213.6"
          strokeDashoffset="160"
          style={{
            transformOrigin: "center",
            animation: "spin 1s linear infinite",
          }}
        />
      </svg>

      {/* Logo dot */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(16,185,129,0.4)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        </div>
      </div>
    </div>

    <p
      style={{
        color: "#065f46",
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: "0.05em",
        animation: "slideUp 0.4s ease 0.1s both",
      }}
    >
      Verifying your session…
    </p>
    <p
      style={{
        color: "#6ee7b7",
        fontSize: 12,
        marginTop: 4,
        animation: "slideUp 0.4s ease 0.2s both",
      }}
    >
      Please wait a moment
    </p>
  </div>
);

// ── Shared auth verify hook ──────────────────────────────────────────────────
// Returns "checking" | "ok" | "fail"
const useAuthVerify = () => {
  const {
    isAuthenticated,
    tokens,
    refreshTokens,
    fetchMe,
    logoutLocal,
    setAuthHeader,
  } = useAuthStore();

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      // No token at all → fail immediately
      if (!tokens?.accessToken) {
        if (!cancelled) setStatus("fail");
        return;
      }

      // Set auth header
      setAuthHeader(tokens.accessToken);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${tokens.accessToken}`;

      // Try /me with current token
      const meResult = await fetchMe();
      if (cancelled) return;

      if (meResult?.success) {
        setStatus("ok");
        return;
      }

      // Token expired → try refresh
      if (meResult?.unauthorized) {
        const refreshResult = await refreshTokens();
        if (cancelled) return;

        if (refreshResult?.success) {
          const meRetry = await fetchMe();
          if (cancelled) return;

          if (meRetry?.success) {
            setStatus("ok");
            return;
          }
        }

        logoutLocal(false);
        setStatus("fail");
        return;
      }

      // Network / server error — keep session if locally authenticated
      if (isAuthenticated) {
        setStatus("ok");
      } else {
        setStatus("fail");
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, []); // run once on mount

  return status;
};

// ── Seeker Guard ─────────────────────────────────────────────────────────────
// Allows only users with role === "seeker"
// If employer tries to access → redirect to employer dashboard
export const SeekerGuard = () => {
  const status = useAuthVerify();
  const user = useAuthStore((s) => s.user);

  if (status === "checking") return <SplashLoader />;

  // Not authenticated at all
  if (status === "fail") return <Navigate to="/jobseeker/login" replace />;

  // Authenticated but wrong role → send employer to their own dashboard
  if (user?.role === "employer") {
    return <Navigate to="/employer/dashboard" replace />;
  }

  return <Outlet />;
};

// ── Employer Guard ────────────────────────────────────────────────────────────
// Allows only users with role === "employer"
// If seeker tries to access → redirect to seeker dashboard
export const EmployerGuard = () => {
  const status = useAuthVerify();
  const user = useAuthStore((s) => s.user);

  if (status === "checking") return <SplashLoader />;

  // Not authenticated at all
  if (status === "fail") return <Navigate to="/employer/login" replace />;

  // Authenticated but wrong role → send seeker to their own dashboard
  if (user?.role === "seeker") {
    return <Navigate to="/seeker/dashboard" replace />;
  }

  return <Outlet />;
};

// Default export kept for any legacy imports
export default SeekerGuard;
