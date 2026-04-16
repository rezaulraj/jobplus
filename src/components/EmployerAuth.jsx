import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const EmployerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [timer, setTimer] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [role, setRole] = useState("employer");
  // Get auth store state and actions
  const {
    register,
    verifyOtp,
    login,
    googleAuth,
    resendOtp,
    isLoading,
    otpTimer,
    isAuthenticated,
  } = useAuthStore();

  const colors = {
    primary: "#1e2558",
    secondary: "#4eb956",
    lightBg: "#f8f9ff",
    border: "#e0e3ff",
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/seeker/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Update timer from store
  useEffect(() => {
    setTimer(otpTimer);
  }, [otpTimer]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show signup form
  const handleShowSignup = () => {
    setIsLogin(false);
    setShowSignup(true);
    setShowOtpVerification(false);
  };

  // Show login form
  const handleShowLogin = () => {
    setIsLogin(true);
    setShowSignup(false);
    setShowOtpVerification(false);
  };

  // Go back to signup from OTP
  const handleBackToSignup = () => {
    setShowOtpVerification(false);
    setShowSignup(true);
    setFormData((prev) => ({ ...prev, otp: "" }));
  };

  // Step 1: Handle Registration
  const handleRegister = async () => {
    // Validation
    if (!formData.fullName) {
      toast.error("Please enter your full name");
      return;
    }

    if (formData.fullName.split(" ").length < 2) {
      toast.error("Please enter both first and last name");
      return;
    }

    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter a password");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must contain at least one letter and one number");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: role,
    };

    const result = await register(userData);
    if (result?.success) {
      setShowSignup(false);
      setShowOtpVerification(true);
    }
  };

  // Step 2: Handle OTP Verification
  const handleVerifyOtp = async () => {
    if (formData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!formData.otp.match(/^\d+$/)) {
      toast.error("OTP must contain only numbers");
      return;
    }

    const result = await verifyOtp(formData.email, formData.otp);

    if (result?.success) {
      setRegistrationSuccess(true);

      // Show success message and redirect to login
      setTimeout(() => {
        setRegistrationSuccess(false);
        setShowOtpVerification(false);
        handleShowLogin(); // Switch to login
        setFormData({
          fullName: "",
          email: formData.email, // Keep email for login convenience
          password: "",
          confirmPassword: "",
          otp: "",
          role: role,
        });
        toast.success("Please login with your credentials");
      }, 2000);
    }
  };

  // Handle Google Auth
  const handleGoogleAuth = async () => {
    await googleAuth();
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result?.success) {
      navigate("/employer/dashboard");
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (timer === 0) {
      const result = await resendOtp(formData.email);
      if (result?.success) {
        toast.success("OTP resent successfully");
      }
    }
  };

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#eef1ff] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Panel - Branding - Hidden on mobile */}
        <div
          className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#1e2558] to-[#2a3570] text-white p-8 lg:p-12 flex-col justify-between"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary}, #2a3570)`,
          }}
        >
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-white/20 rounded-xl">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Employer Account</h1>
                <p className="text-blue-100">Find your Expert Team</p>
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {isLogin ? "Welcome Back!" : "Start Your Journey"}
            </h2>
            <p className="text-blue-100 mb-8">
              {isLogin
                ? "Sign in to access your personalized job recommendations."
                : "Join thousands of professionals finding their dream careers."}
            </p>
            {!isLogin && !showSignup && !showOtpVerification && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-semibold">1</span>
                  </div>
                  <span>Create account</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-semibold">2</span>
                  </div>
                  <span>Verify email with OTP</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-semibold">3</span>
                  </div>
                  <span>Login to dashboard</span>
                </div>
              </div>
            )}
            {(showSignup || showOtpVerification) && (
              <div className="space-y-4">
                <div
                  className={`flex items-center space-x-3 ${showOtpVerification ? "text-green-300" : "text-white"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      showOtpVerification ? "bg-green-500" : "bg-white/20"
                    }`}
                  >
                    {showOtpVerification ? (
                      <FaCheckCircle className="text-sm" />
                    ) : (
                      <span className="font-semibold">1</span>
                    )}
                  </div>
                  <span>Account Created</span>
                </div>
                <div
                  className={`flex items-center space-x-3 ${showOtpVerification ? "text-white" : "text-blue-200"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      showOtpVerification ? "bg-white/30" : "bg-white/20"
                    }`}
                  >
                    <span className="font-semibold">2</span>
                  </div>
                  <span>Email Verification</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-200">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-semibold">3</span>
                  </div>
                  <span>Login</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <p className="text-sm text-blue-100">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-white">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-white">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-3/5 bg-white p-6 lg:p-12">
          {/* Mobile header - visible only on mobile */}
          <div className="lg:hidden mb-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#1e2558] to-[#2a3570] rounded-xl text-white">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Job Employer</h1>
                <p className="text-gray-600">Find your Expert Team</p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {registrationSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#4eb956] to-green-400 rounded-full flex items-center justify-center mb-6"
                >
                  <FaCheckCircle className="text-4xl text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  Email Verified Successfully!
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Your account is now active.
                </p>
                <p className="text-gray-500 text-center">
                  Redirecting to login...
                </p>
                <div className="w-12 h-12 border-4 border-[#4eb956] border-t-transparent rounded-full animate-spin mt-4"></div>
              </motion.div>
            ) : (
              <>
                {/* LOGIN FORM */}
                {isLogin && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex justify-between items-center mb-6 lg:mb-8">
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                        Sign In
                      </h2>
                      <button
                        onClick={handleShowSignup}
                        className="text-sm lg:text-base cursor-pointer text-[#1e2558] hover:text-[#4eb956] font-medium"
                      >
                        Create account
                      </button>
                    </div>

                    <button
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-3 p-3 lg:p-4 border-2 border-gray-200 rounded-xl hover:border-[#4285f4] hover:shadow-lg transition-all duration-300 mb-4 lg:mb-6 group disabled:opacity-50"
                    >
                      <FaGoogle className="text-[#4285f4] text-lg lg:text-xl" />
                      <span className="font-medium text-gray-700 group-hover:text-[#4285f4] text-sm lg:text-base">
                        {isLoading ? "Loading..." : "Continue with Google"}
                      </span>
                    </button>

                    <div className="relative mb-4 lg:mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 text-xs lg:text-sm">
                          Or with email
                        </span>
                      </div>
                    </div>

                    <form
                      onSubmit={handleLogin}
                      className="space-y-4 lg:space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm lg:text-base" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                            placeholder="you@company.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm lg:text-base" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-[#4eb956] rounded focus:ring-[#4eb956]"
                          />
                          <span className="text-xs lg:text-sm text-gray-600">
                            Remember me
                          </span>
                        </label>
                        <a
                          href="#"
                          className="text-xs lg:text-sm text-[#1e2558] hover:text-[#4eb956] hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#1e2558] to-[#2a3570] text-white py-3 lg:py-4 rounded-xl font-semibold hover:from-[#4eb956] hover:to-[#3da345] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm lg:text-base"
                      >
                        <FaSignInAlt />
                        <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* SIGNUP FORM */}
                {!isLogin && showSignup && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center mb-6 lg:mb-8">
                      <button
                        onClick={handleShowLogin}
                        className="mr-4 text-gray-600 hover:text-[#1e2558]"
                      >
                        <FaArrowLeft />
                      </button>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                        Create Account
                      </h2>
                    </div>

                    <button
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-3 p-3 lg:p-4 border-2 border-gray-200 rounded-xl hover:border-[#4285f4] hover:shadow-lg transition-all duration-300 mb-4 lg:mb-6 group disabled:opacity-50"
                    >
                      <FaGoogle className="text-[#4285f4] text-lg lg:text-xl" />
                      <span className="font-medium text-gray-700 group-hover:text-[#4285f4] text-sm lg:text-base">
                        {isLoading ? "Loading..." : "Sign up with Google"}
                      </span>
                    </button>

                    <div className="relative mb-4 lg:mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 text-xs lg:text-sm">
                          Or sign up with email
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm lg:text-base" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm lg:text-base" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                            placeholder="Create password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm lg:text-base" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4eb956] focus:border-transparent"
                            placeholder="Confirm password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      {/* Password requirements */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Password must:
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                formData.password.length >= 8
                                  ? "bg-[#4eb956]"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span
                              className={`text-xs ${
                                formData.password.length >= 8
                                  ? "text-[#4eb956]"
                                  : "text-gray-500"
                              }`}
                            >
                              Be at least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                /[A-Za-z]/.test(formData.password) &&
                                /\d/.test(formData.password)
                                  ? "bg-[#4eb956]"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span
                              className={`text-xs ${
                                /[A-Za-z]/.test(formData.password) &&
                                /\d/.test(formData.password)
                                  ? "text-[#4eb956]"
                                  : "text-gray-500"
                              }`}
                            >
                              Contain letters and numbers
                            </span>
                          </div>
                          {formData.confirmPassword &&
                            formData.password !== formData.confirmPassword && (
                              <p className="text-red-500 text-xs mt-2">
                                Passwords do not match
                              </p>
                            )}
                        </div>
                      </div>

                      <button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#1e2558] to-[#2a3570] text-white py-3 lg:py-4 rounded-xl font-semibold hover:from-[#4eb956] hover:to-[#3da345] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm lg:text-base"
                      >
                        <FaUserPlus />
                        <span>
                          {isLoading ? "Creating Account..." : "Create Account"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* OTP VERIFICATION FORM */}
                {!isLogin && showOtpVerification && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center mb-6 lg:mb-8">
                      <button
                        onClick={handleBackToSignup}
                        className="mr-4 text-gray-600 hover:text-[#1e2558]"
                      >
                        <FaArrowLeft />
                      </button>
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                        Verify Email
                      </h2>
                    </div>

                    <div className="text-center mb-6 lg:mb-8">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mb-3 lg:mb-4">
                        <FaShieldAlt className="text-xl lg:text-2xl text-[#4eb956]" />
                      </div>
                      <p className="text-sm lg:text-base text-gray-600 mb-2">
                        Enter the 6-digit code sent to
                      </p>
                      <p className="font-semibold text-[#1e2558] text-sm lg:text-base">
                        {formData.email}
                      </p>

                      <div className="relative max-w-xs mx-auto mt-4">
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          maxLength="6"
                          className="w-full text-center text-2xl lg:text-3xl font-bold tracking-widest py-3 lg:py-4 border-2 border-gray-300 rounded-xl focus:border-[#4eb956] focus:ring-2 focus:ring-[#4eb956]/20"
                          placeholder="000000"
                          autoFocus
                        />
                      </div>

                      <div className="mt-3 lg:mt-4">
                        {timer > 0 ? (
                          <p className="text-xs lg:text-sm text-gray-500">
                            Code expires in {formatTime(timer)}
                          </p>
                        ) : (
                          <button
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            className="text-xs lg:text-sm text-[#4eb956] hover:text-[#3da345] font-medium hover:underline disabled:opacity-50"
                          >
                            {isLoading ? "Sending..." : "Resend code"}
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={formData.otp.length !== 6 || isLoading}
                      className={`w-full py-3 lg:py-4 rounded-xl font-semibold transition-all duration-300 text-sm lg:text-base ${
                        formData.otp.length === 6 && !isLoading
                          ? "bg-gradient-to-r from-[#1e2558] to-[#2a3570] text-white hover:from-[#4eb956] hover:to-[#3da345] hover:shadow-lg transform hover:-translate-y-1"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isLoading ? "Verifying..." : "Verify & Continue"}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                      Didn't receive the code? Check your spam folder
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EmployerAuth;
