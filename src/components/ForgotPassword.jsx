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
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-rose-400">
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
      {/* Subtle radial glow behind card */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / brand mark */}
        <div className="flex justify-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-indigo-600/40">
            <svg
              width="22"
              height="22"
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
        <h1 className="font-bold text-4xl text-gray-700 text-center ">
          Forget Password
        </h1>
        {/* Card */}
        <div className="bg-gray-100 border border-white/[0.07] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Progress bar */}
          <div className="h-0.5 bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>

          <div className="px-8 pt-8 pb-10">
            {/* Step bubbles */}
            <div className="flex items-center justify-center gap-0 mb-10">
              {steps.map((label, idx) => {
                const num = idx + 1;
                const done = step > num;
                const active = step === num;
                return (
                  <div key={label} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
                        ${done ? "bg-indigo-900 text-white" : active ? "bg-indigo-900 text-white ring-4 ring-indigo-600/25" : "bg-white/5 text-slate-500"}
                      `}
                      >
                        {done ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
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
                        className={`text-[10px] font-medium tracking-wide ${active ? "text-indigo-800" : done ? "text-slate-400" : "text-slate-600"}`}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`w-16 h-px mx-2 mb-5 transition-colors duration-300 ${step > num ? "bg-indigo-900/60" : "bg-white/8"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── SUCCESS state ─────────────────────────────────────────── */}
            {success && (
              <div className="text-center py-6 flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Password reset!
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Redirecting you to login…
                  </p>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
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
                <div>
                  <h1 className="text-xl font-semibold text-gray-700">
                    Forgot password?
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    We'll send a one-time code to your email.
                  </p>
                </div>

                <Field label="Email address" error={errors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    className={`
                      w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-gray-500 placeholder-slate-600
                      outline-none transition-all duration-200
                      focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/50
                      ${errors.email ? "border-rose-500/60" : "border-white/10 hover:border-white/20"}
                    `}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-indigo-900 hover:bg-indigo-800 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner /> Sending code…
                    </span>
                  ) : (
                    "Send reset code"
                  )}
                </button>

                <p className="text-center text-xs text-slate-500">
                  Remembered it?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Back to Home
                  </button>
                </p>
              </form>
            )}

            {/* ── STEP 2: OTP ───────────────────────────────────────────── */}
            {!success && step === STEP.OTP && (
              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Check your inbox
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Enter the 6-digit code sent to{" "}
                    <span className="text-indigo-400 font-medium">{email}</span>
                  </p>
                </div>

                <Field error={errors.otp}>
                  <div
                    className="flex gap-2.5 justify-between"
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
                          w-12 h-14 text-center text-xl font-bold rounded-xl
                          bg-white/5 border outline-none text-white caret-indigo-400
                          transition-all duration-200
                          focus:bg-white/[0.09] focus:ring-2 focus:ring-indigo-500/50
                          ${errors.otp ? "border-rose-500/60" : digit ? "border-indigo-500/70" : "border-white/10 hover:border-white/20"}
                        `}
                      />
                    ))}
                  </div>
                </Field>

                {/* Timer / resend */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {otpTimer > 0 ? (
                      <span>
                        Resend in{" "}
                        <span className="text-indigo-400 font-mono font-semibold">
                          {formatTimer(otpTimer)}
                        </span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                      >
                        Resend code
                      </button>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(STEP.EMAIL)}
                    className="text-slate-500 hover:text-slate-400 transition-colors"
                  >
                    Wrong email?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.some((d) => !d)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
                >
                  Verify code
                </button>
              </form>
            )}

            {/* ── STEP 3: New password ───────────────────────────────────── */}
            {!success && step === STEP.PASSWORD && (
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-6"
              >
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Create new password
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Must be at least 8 characters with a number and uppercase
                    letter.
                  </p>
                </div>

                <Field label="New password" error={errors.newPassword}>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      className={`
                        w-full bg-white/5 border rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600
                        outline-none transition-all duration-200
                        focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/50
                        ${errors.newPassword ? "border-rose-500/60" : "border-white/10 hover:border-white/20"}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <Eye open={showNew} />
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPassword && <StrengthBar password={newPassword} />}
                </Field>

                <Field label="Confirm password" error={errors.confirmPassword}>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`
                        w-full bg-white/5 border rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600
                        outline-none transition-all duration-200
                        focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/50
                        ${errors.confirmPassword ? "border-rose-500/60" : "border-white/10 hover:border-white/20"}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <Eye open={showConfirm} />
                    </button>
                  </div>
                </Field>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner /> Resetting…
                    </span>
                  ) : (
                    "Reset password"
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
    "bg-rose-500",
    "bg-amber-400",
    "bg-blue-400",
    "bg-emerald-400",
  ];
  const textColors = [
    "",
    "text-rose-400",
    "text-amber-400",
    "text-blue-400",
    "text-emerald-400",
  ];

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-white/10"}`}
          />
        ))}
      </div>
      {score > 0 && (
        <span className={`text-[11px] font-medium ${textColors[score]}`}>
          {labels[score]}
        </span>
      )}
    </div>
  );
}

// ── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        opacity=".3"
      />
      <path d="M12 2v4" />
    </svg>
  );
}