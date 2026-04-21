// pages/employer/EmployerProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaUserTie,
  FaPhone,
  FaCamera,
  FaPencilAlt,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaIdCard,
  FaSpinner,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";
import useEmployerStore from "../../store/employerStore";

const EMPTY_FORM = {
  nameEmployer: "",
  designation: "",
  officePhone: "",
};

function mapProfileToForm(profile) {
  if (!profile) return EMPTY_FORM;
  return {
    nameEmployer: profile.nameEmployer || "",
    designation: profile.designation || "",
    officePhone: profile.officePhone || "",
  };
}

// Inline field error component
const FieldError = ({ message }) =>
  message ? (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-[fadeIn_0.2s_ease-in]">
      <FaExclamationCircle className="flex-shrink-0" />
      {message}
    </p>
  ) : null;

// Animated input wrapper
const FormField = ({ label, required, error, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-600">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
    <FieldError message={error} />
  </div>
);

function validate(form) {
  const errors = {};
  if (!form.nameEmployer.trim()) {
    errors.nameEmployer = "Full name is required";
  } else if (form.nameEmployer.trim().length < 2) {
    errors.nameEmployer = "Name must be at least 2 characters";
  }
  return errors;
}

const EmployerProfile = () => {
  const {
    employerProfile,
    isLoading,
    isUploading,
    fetchEmployerProfile,
    createEmployerProfile,
    updateEmployerProfile,
    uploadProfileImage,
  } = useEmployerStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [touched, setTouched] = useState({});

  const imageInputRef = useRef(null);

  // ── Load on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchEmployerProfile();
  }, []);

  // ── Sync form when profile loads or edit starts ────────────────────────
  useEffect(() => {
    if (!isEditing && !isCreating) {
      setForm(mapProfileToForm(employerProfile));
      setErrors({});
      setTouched({});
    }
  }, [employerProfile, isEditing, isCreating]);

  // ── Live validation on touched fields ─────────────────────────────────
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const errs = validate(form);
      const visibleErrs = {};
      Object.keys(touched).forEach((k) => {
        if (errs[k]) visibleErrs[k] = errs[k];
      });
      setErrors(visibleErrs);
    }
  }, [form, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleCancel = () => {
    setForm(mapProfileToForm(employerProfile));
    setErrors({});
    setTouched({});
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleSave = async () => {
    // Touch all fields to show all errors
    setTouched({ nameEmployer: true, designation: true, officePhone: true });
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSaving(true);
    const payload = {
      nameEmployer: form.nameEmployer.trim(),
      designation: form.designation.trim(),
      officePhone: form.officePhone.trim(),
    };

    const result = isCreating
      ? await createEmployerProfile(payload)
      : await updateEmployerProfile(payload);

    setIsSaving(false);
    if (result.success) {
      setIsEditing(false);
      setIsCreating(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadProfileImage(file);
    e.target.value = "";
  };

  // ── Loading state ──────────────────────────────────────────────────────
  if (isLoading && !employerProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#4EB956] text-4xl mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── No profile yet ─────────────────────────────────────────────────────
  if (!employerProfile && !isCreating) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Employer Profile
        </h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956]" />
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#1E2558]/10 to-[#4EB956]/10 flex items-center justify-center mx-auto mb-5">
              <FaUserTie className="text-4xl text-[#1E2558]" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Set Up Your Employer Profile
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              Create your profile to start posting jobs and managing your
              company on the platform.
            </p>
            <button
              onClick={() => {
                setIsCreating(true);
                setForm(EMPTY_FORM);
                setErrors({});
                setTouched({});
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all duration-200"
            >
              <FaPlus />
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Create form (full page) ────────────────────────────────────────────
  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Create Employer Profile
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Fill in your details to get started
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#1E2558] to-[#4EB956]" />
          <div className="p-8 space-y-6">
            <FormField label="Full Name" required error={errors.nameEmployer}>
              <input
                type="text"
                name="nameEmployer"
                value={form.nameEmployer}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. John Anderson"
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 ${
                  errors.nameEmployer
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10"
                }`}
              />
            </FormField>

            <FormField label="Designation" error={errors.designation}>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Senior HR Manager"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </FormField>

            <FormField label="Office Phone" error={errors.officePhone}>
              <input
                type="tel"
                name="officePhone"
                value={form.officePhone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. +1 (555) 123-4567"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </FormField>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all duration-200 disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <FaPlus /> Create Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main profile view / edit ───────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employer Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal employer information
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all duration-200 disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E2558] to-[#4EB956] text-white rounded-xl hover:shadow-lg hover:shadow-[#4EB956]/20 transition-all duration-200"
            >
              <FaPencilAlt /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#1E2558] to-[#4EB956]" />

        {/* Cover strip */}
        <div className="h-28 bg-gradient-to-r from-[#1E2558] to-[#4EB956] relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="flex justify-center -mt-14 mb-5">
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                {employerProfile?.profileImage ? (
                  <img
                    src={employerProfile.profileImage}
                    alt={employerProfile.nameEmployer}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1E2558] to-[#4EB956] flex items-center justify-center text-white text-4xl font-bold">
                    {employerProfile?.nameEmployer?.charAt(0) || "E"}
                  </div>
                )}
              </div>
              {/* Hidden image input */}
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {/* Always show upload button, not just in editing */}
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 bg-white border border-gray-100 shadow-md p-2 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                title="Change profile photo"
              >
                {isUploading ? (
                  <FaSpinner className="animate-spin text-[#4EB956] text-sm" />
                ) : (
                  <FaCamera className="text-gray-500 text-sm" />
                )}
              </button>
            </div>
          </div>

          {/* Profile ID badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-500">
              <FaIdCard className="text-[#4EB956]" />
              <code className="font-mono">
                {employerProfile?.employerProfileId}
              </code>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 border border-green-100 rounded-full text-xs text-green-600 font-medium">
              <FaCheckCircle />
              Active
            </span>
          </div>

          {/* Fields */}
          {isEditing ? (
            <div className="space-y-5 max-w-md mx-auto">
              <FormField label="Full Name" required error={errors.nameEmployer}>
                <input
                  type="text"
                  name="nameEmployer"
                  value={form.nameEmployer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 ${
                    errors.nameEmployer
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10"
                  }`}
                />
              </FormField>

              <FormField label="Designation" error={errors.designation}>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Senior HR Manager"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </FormField>

              <FormField label="Office Phone" error={errors.officePhone}>
                <input
                  type="tel"
                  name="officePhone"
                  value={form.officePhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. +1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#4EB956] focus:ring-2 focus:ring-[#4EB956]/10 transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </FormField>
            </div>
          ) : (
            <>
              {/* View mode — name + designation centered */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {employerProfile?.nameEmployer}
                </h2>
                {employerProfile?.designation && (
                  <p className="text-[#4EB956] font-medium mt-1">
                    {employerProfile.designation}
                  </p>
                )}
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-[#4EB956]/10 flex items-center justify-center flex-shrink-0">
                    <FaUserTie className="text-[#4EB956] text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Designation
                    </p>
                    <p className="text-sm text-gray-700 font-medium truncate">
                      {employerProfile?.designation || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-[#1E2558]/10 flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-[#1E2558] text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Office Phone
                    </p>
                    <p className="text-sm text-gray-700 font-medium truncate">
                      {employerProfile?.officePhone || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* System IDs */}
              <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 max-w-md mx-auto">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                  System Information
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Profile ID</span>
                    <code className="text-xs font-mono text-[#1E2558] bg-white px-2 py-0.5 rounded border border-gray-200">
                      {employerProfile?.employerProfileId}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">User ID</span>
                    <code className="text-xs font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 max-w-[160px] truncate">
                      {employerProfile?.userId}
                    </code>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
