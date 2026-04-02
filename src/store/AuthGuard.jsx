import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./authStore";
import { useEffect, useState } from "react";
import axios from "axios";

// ─── Smooth full-page loader ──────────────────────────────────────────────────
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
      @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
      @keyframes fadeOut  { from { opacity: 1 } to { opacity: 0 } }
      @keyframes spinRing { to { stroke-dashoffset: 0 } }
      @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      @keyframes slideUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
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
        {/* Track */}
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#d1fae5"
          strokeWidth="5"
        />
        {/* Spinner arc */}
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

    <style>{`
      @keyframes spin {
        from { transform: rotate(-90deg); }
        to   { transform: rotate(270deg); }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH GUARD
// ═══════════════════════════════════════════════════════════════════════════════
const AuthGuard = () => {
  const {
    isAuthenticated,
    tokens,
    refreshTokens,
    fetchMe,
    logoutLocal,
    setAuthHeader,
  } = useAuthStore();
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "fail"

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

      // Try to hit /me with current token
      const meResult = await fetchMe();

      if (cancelled) return;

      if (meResult?.success) {
        setStatus("ok");
        return;
      }

      // If 401 (token expired) → try refresh
      if (meResult?.unauthorized) {
        const refreshResult = await refreshTokens();

        if (cancelled) return;

        if (refreshResult?.success) {
          // Re-fetch me after refresh
          const meRetry = await fetchMe();
          if (cancelled) return;
          if (meRetry?.success) {
            setStatus("ok");
          } else {
            logoutLocal(false);
            setStatus("fail");
          }
        } else {
          logoutLocal(false);
          setStatus("fail");
        }
        return;
      }

      // Network / server error — keep session if we're locally authenticated
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

  if (status === "checking") return <SplashLoader />;
  if (status === "fail") return <Navigate to="/jobseeker/login" replace />;
  return <Outlet />;
};

export default AuthGuard;
