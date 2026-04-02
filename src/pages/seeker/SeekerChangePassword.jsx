import React, { useState } from "react";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";

const SeekerChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    alphabet: false,
    number: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const checkPasswordStrength = (password) => {
    const strength = {
      length: password.length >= 8,
      alphabet: /[a-zA-Z]/.test(password),
      number: /\d/.test(password),
    };
    setPasswordStrength(strength);
    return strength.length && strength.alphabet && strength.number;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setErrorMessage("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (!checkPasswordStrength(formData.newPassword)) {
      setErrorMessage("Password does not meet requirements");
      setIsSubmitting(false);
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setErrorMessage("New password must be different from old password");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setSuccessMessage("Password updated successfully!");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength({
        length: false,
        alphabet: false,
        number: false,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const calculateStrengthScore = () => {
    const { length, alphabet, number } = passwordStrength;
    const total = Object.values(passwordStrength).filter(Boolean).length;
    return Math.round((total / 3) * 100);
  };

  const strengthScore = calculateStrengthScore();

  const getStrengthColor = () => {
    if (strengthScore < 50) return "bg-red-500";
    if (strengthScore < 100) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-secondary to-[#3da844] rounded-full mb-4 shadow-lg">
            <FiShield className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Change Password
          </h1>
          <p className="text-gray-600">
            Set a strong password to protect your account
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Old Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Old Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiLock />
                    </div>
                    <input
                      type={showPasswords.oldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      placeholder="Enter your old password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("oldPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.oldPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiLock />
                    </div>
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.newPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </button>
                  </div>

                  {/* Password */}
                  {formData.newPassword && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Password Strength
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {strengthScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStrengthColor()} transition-all duration-500`}
                          style={{ width: `${strengthScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiLock />
                    </div>
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                        formData.confirmPassword &&
                        formData.newPassword !== formData.confirmPassword
                          ? "border-red-300"
                          : formData.confirmPassword &&
                              formData.newPassword === formData.confirmPassword
                            ? "border-green-300"
                            : "border-gray-300"
                      }`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirmPassword ? (
                        <FiEyeOff size={20} />
                      ) : (
                        <FiEye size={20} />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.newPassword === formData.confirmPassword && (
                      <p className="text-green-600 text-sm flex items-center gap-2">
                        <FiCheck /> Passwords match
                      </p>
                    )}
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <FiAlertCircle />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                    <FiCheck />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                    isSubmitting
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-linear-to-r from-secondary to-[#3da844] hover:from-[#3da844] hover:to-secondary transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating Password...
                    </span>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiAlertCircle className="text-blue-600" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Hints for Password
                </h3>
              </div>

              <div className="space-y-6">
                {/* Password */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">
                    Password Requirements:
                  </h4>
                  <ul className="space-y-3">
                    <li
                      className={`flex items-start gap-3 ${passwordStrength.length ? "text-green-600" : "text-gray-600"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          passwordStrength.length
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {passwordStrength.length ? (
                          <FiCheck className="text-green-600" size={12} />
                        ) : (
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <span>At least 8 characters or more</span>
                    </li>
                    <li
                      className={`flex items-start gap-3 ${passwordStrength.alphabet ? "text-green-600" : "text-gray-600"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          passwordStrength.alphabet
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {passwordStrength.alphabet ? (
                          <FiCheck className="text-green-600" size={12} />
                        ) : (
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <span>At least one alphabet (A-Z, a-z)</span>
                    </li>
                    <li
                      className={`flex items-start gap-3 ${passwordStrength.number ? "text-green-600" : "text-gray-600"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          passwordStrength.number
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {passwordStrength.number ? (
                          <FiCheck className="text-green-600" size={12} />
                        ) : (
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <span>At least one number (0-9)</span>
                    </li>
                  </ul>
                </div>

                {/* Security Tips */}
                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-800">
                    Security Tips:
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">
                          !
                        </span>
                      </div>
                      <span>
                        Avoid using personal information like names or birthdays
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">
                          !
                        </span>
                      </div>
                      <span>
                        Don't reuse passwords across different accounts
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">
                          !
                        </span>
                      </div>
                      <span>
                        Consider using a mix of uppercase, lowercase, and
                        special characters
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-purple-600">
                          !
                        </span>
                      </div>
                      <span>
                        Update your password regularly for better security
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-800">
                    Password Strength:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Weak - Less than 50%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Medium - 50-99%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Strong - 100%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            <FiShield className="inline mr-2" />
            Your password is encrypted and securely stored. Never share your
            password with anyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeekerChangePassword;
