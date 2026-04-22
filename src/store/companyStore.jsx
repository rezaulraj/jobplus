// store/companyStore.jsx
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const useCompanyStore = create((set, get) => ({
  company: null,
  companies: [],
  companiesMeta: null,
  isLoading: false,
  isUploading: false,
  error: null,

  // ── Auth config (mirrors seekerStore pattern) ──────────────────────────
  getAuthConfig: (extraConfig = {}) => {
    const { getBearerToken } = useAuthStore.getState();
    const token = getBearerToken();
    return {
      withCredentials: true,
      ...extraConfig,
      headers: {
        ...(extraConfig.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  },

  // ── Error handler (mirrors seekerStore pattern) ────────────────────────
  handleError: (error, fallbackMessage) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || fallbackMessage;

    if (status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logoutLocal?.(false);
    }

    set({ error: message, isLoading: false, isUploading: false });
    toast.error(message);
    return { success: false, error: message };
  },

  // ── Create Company ─────────────────────────────────────────────────────
  createCompany: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/company/create`,
        payload,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ company: response.data.data, isLoading: false });
        toast.success("Company created successfully!");
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to create company" };
    } catch (error) {
      return get().handleError(error, "Failed to create company");
    }
  },

  // ── Get My Company ─────────────────────────────────────────────────────
  fetchMyCompany: async ({ silent = false } = {}) => {
    if (!silent) set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/company/me`,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ company: response.data.data, isLoading: false, error: null });
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to fetch company" };
    } catch (error) {
      // 404 means no company yet — treat as empty state, not a real error
      if (error?.response?.status === 404) {
        set({ company: null, isLoading: false, error: null });
        return { success: false, notFound: true };
      }
      return get().handleError(error, "Failed to fetch company");
    }
  },

  // ── Update Company ─────────────────────────────────────────────────────
  updateCompany: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/company/update`,
        payload,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ company: response.data.data, isLoading: false });
        toast.success("Company updated successfully!");
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to update company" };
    } catch (error) {
      return get().handleError(error, "Failed to update company");
    }
  },

  // ── Update Company Logo ────────────────────────────────────────────────
  updateCompanyLogo: async (file) => {
    set({ isUploading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("companyLogo", file);
      const response = await axios.patch(
        `${API_URL}/company/update/logo`,
        formData,
        get().getAuthConfig({
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
      if (response.data?.success) {
        set({ company: response.data.data, isUploading: false });
        toast.success("Logo updated successfully!");
        return { success: true, data: response.data.data };
      }
      set({ isUploading: false });
      return { success: false, error: "Failed to update logo" };
    } catch (error) {
      return get().handleError(error, "Failed to update logo");
    }
  },

  // ── Remove Company Logo ────────────────────────────────────────────────
  removeCompanyLogo: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${API_URL}/company/delete/logo`,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ company: response.data.data, isLoading: false });
        toast.success("Logo removed successfully!");
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to remove logo" };
    } catch (error) {
      return get().handleError(error, "Failed to remove logo");
    }
  },

  // ── Update Company Cover ───
  updateCompanyCover: async (file) => {
    set({ isUploading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("companyCover", file);
      const response = await axios.patch(
        `${API_URL}/company/update/cover`,
        formData,
        get().getAuthConfig({
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
      if (response.data?.success) {
        set({ company: response.data.data, isUploading: false });
        toast.success("Cover updated successfully!");
        return { success: true, data: response.data.data };
      }
      set({ isUploading: false });
      return { success: false, error: "Failed to update cover" };
    } catch (error) {
      return get().handleError(error, "Failed to update cover");
    }
  },

  // ── Remove Company Cover ───────────────────────────────────────────────
  removeCompanyCover: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${API_URL}/company/delete/cover`,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ company: response.data.data, isLoading: false });
        toast.success("Cover removed successfully!");
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to remove cover" };
    } catch (error) {
      return get().handleError(error, "Failed to remove cover");
    }
  },

  // ── List Companies (public/admin) ──────────────────────────────────────
  fetchCompanies: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/company/`,
        get().getAuthConfig({ params: { page, limit } }),
      );
      if (response.data?.success) {
        set({
          companies: response.data.data?.items || [],
          companiesMeta: response.data.data?.meta || null,
          isLoading: false,
        });
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to fetch companies" };
    } catch (error) {
      return get().handleError(error, "Failed to fetch companies");
    }
  },

  // ── Admin: Verify / Unverify Company ──────────────────────────────────
  setCompanyVerified: async (companyId, isVerified) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/company/admin/${companyId}/verified`,
        { isVerified },
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ isLoading: false });
        toast.success(
          `Company ${isVerified ? "verified" : "unverified"} successfully!`,
        );
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to update verification" };
    } catch (error) {
      return get().handleError(error, "Failed to update verification");
    }
  },

  // ── Helpers ────────────────────────────────────────────────────────────
  clearCompany: () => set({ company: null, error: null }),
  clearError: () => set({ error: null }),
}));

export default useCompanyStore;
