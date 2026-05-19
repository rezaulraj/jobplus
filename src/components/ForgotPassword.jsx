import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// ── Step constants ──────────────────────────────────────────────────────────
const STEP = { EMAIL: 1, OTP: 2, PASSWORD: 3 };

// ── Eye icon (inline svg, no deps) ─────────────────────────────────────────
const Eye = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// ── Spinner Component ───────────────────────────────────────────────────────
const Spinner = () => (
  <svg
    className="animate-spin"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// ── Main component ──────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword, otpTimer, otpEmail, isLoading } =
    useAuthStore();

  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const otpRefs = useRef([]);

  // Sync email from store when navigating back here
  useEffect(() => {
    if (otpEmail) setEmail(otpEmail);
  }, [otpEmail]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const validate = {
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? null
        : "Enter a valid email address",
    otp: (arr) =>
      arr.every((d) => /^\d$/.test(d)) ? null : "Enter the 6-digit code",
    password: (v) => {
      if (v.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter";
      if (!/[0-9]/.test(v)) return "Include at least one number";
      return null;
    },
    confirm: (v, pw) => (v === pw ? null : "Passwords do not match"),
  };

  // ── Step 1: send OTP ──────────────────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const err = validate.email(email);
    if (err) return setErrors({ email: err });
    setErrors({});
    const res = await forgotPassword(email);
    if (res.success) setStep(STEP.OTP);
  };

  // ── Step 2: verify OTP ────────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length) {
      const next = paste.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(next);
      otpRefs.current[Math.min(paste.length, 5)]?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const err = validate.otp(otp);
    if (err) return setErrors({ otp: err });
    setErrors({});
    setStep(STEP.PASSWORD);
  };

  // ── Step 3: reset password ────────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const pwErr = validate.password(newPassword);
    const cfErr = validate.confirm(confirmPassword, newPassword);
    if (pwErr || cfErr)
      return setErrors({ newPassword: pwErr, confirmPassword: cfErr });
    setErrors({});

    const res = await resetPassword(email, otp.join(""), newPassword);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (otpTimer > 0) return;
    await forgotPassword(email);
  };

  // ── Shared field wrapper ──────────────────────────────────────────────────
  const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="12" opacity=".15" />
            <path
              d="M12 7v6M12 17h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );

  // ── Step indicator ────────────────────────────────────────────────────────
  const steps = ["Email", "Verify", "Reset"];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        {/* Logo / brand mark */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <h1 className="font-bold text-3xl text-gray-800 text-center mb-8">
          Forgot Password
        </h1>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Progress bar - GREEN */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>

          <div className="px-8 pt-8 pb-10">
            {/* Step bubbles - GREEN for active/done */}
            <div className="flex items-center justify-center gap-0 mb-10">
              {steps.map((label, idx) => {
                const num = idx + 1;
                const done = step > num;
                const active = step === num;
                return (
                  <div key={label} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`
                          w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                          ${done ? "bg-green-500 text-white" : active ? "bg-green-500 text-white ring-4 ring-green-100" : "bg-gray-100 text-gray-400"}
                        `}
                      >
                        {done ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          num
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${active ? "text-green-600" : done ? "text-green-500" : "text-gray-400"}`}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`w-14 h-0.5 mx-2 mb-6 transition-colors duration-300 ${step > num ? "bg-green-500" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── SUCCESS state ─────────────────────────────────────────── */}
            {success && (
              <div className="text-center py-8 flex flex-col items-center gap-5 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Password Reset!
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Redirecting to login…
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 1: Email ── */}
            {!success && step === STEP.EMAIL && (
              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Forgot your password?
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter your email and we'll send you a verification code.
                  </p>
                </div>

                <Field label="Email Address" error={errors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    className={`
                      w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400
                      outline-none transition-all duration-200
                      focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-400
                      ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}
                    `}
                  />
                </Field>

                {/* BLUE Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner /> Sending Code…
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>

                <p className="text-center text-xs text-gray-500">
                  Remembered your password?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Back to Login
                  </button>
                </p>
              </form>
            )}

            {/* ── STEP 2: OTP ───────────────────────────────────────────── */}
            {!success && step === STEP.OTP && (
              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Check Your Email
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the 6-digit code sent to{" "}
                    <span className="text-green-600 font-medium">{email}</span>
                  </p>
                </div>

                <Field error={errors.otp}>
                  <div
                    className="flex gap-2.5 justify-center"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`
                          w-12 h-14 text-center text-lg font-bold rounded-xl
                          bg-gray-50 border outline-none text-gray-800 caret-green-500
                          transition-all duration-200
                          focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-400
                          ${errors.otp ? "border-red-400 bg-red-50" : digit ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-300"}
                        `}
                      />
                    ))}
                  </div>
                </Field>

                {/* Timer / resend */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {otpTimer > 0 ? (
                      <span>
                        Resend in{" "}
                        <span className="text-green-600 font-mono font-semibold">
                          {formatTimer(otpTimer)}
                        </span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-green-600 hover:text-green-700 transition-colors font-medium"
                      >
                        Resend Code
                      </button>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(STEP.EMAIL)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Wrong email?
                  </button>
                </div>

                {/* BLUE Button */}
                <button
                  type="submit"
                  disabled={isLoading || otp.some((d) => !d)}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                >
                  Verify Code
                </button>
              </form>
            )}

            {/* ── STEP 3: New password ───────────────────────────────────── */}
            {!success && step === STEP.PASSWORD && (
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-6"
              >
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Create New Password
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Must be at least 8 characters with uppercase & number.
                  </p>
                </div>

                <Field label="New Password" error={errors.newPassword}>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      className={`
                        w-full bg-gray-50 border rounded-xl px-4 py-3 pr-11 text-sm text-gray-700 placeholder-gray-400
                        outline-none transition-all duration-200
                        focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-400
                        ${errors.newPassword ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye open={showNew} />
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPassword && <StrengthBar password={newPassword} />}
                </Field>

                <Field label="Confirm Password" error={errors.confirmPassword}>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`
                        w-full bg-gray-50 border rounded-xl px-4 py-3 pr-11 text-sm text-gray-700 placeholder-gray-400
                        outline-none transition-all duration-200
                        focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-400
                        ${errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye open={showConfirm} />
                    </button>
                  </div>
                </Field>

                {/* BLUE Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner /> Resetting…
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Password strength indicator ─────────────────────────────────────────────
function StrengthBar({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-green-500",
  ];
  const textColors = [
    "",
    "text-red-500",
    "text-amber-500",
    "text-blue-500",
    "text-green-600",
  ];

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-gray-200"}`}
          />
        ))}
      </div>
      {score > 0 && (
        <span className={`text-xs font-medium ${textColors[score]}`}>
          {labels[score]}
        </span>
      )}
    </div>
  );
}
