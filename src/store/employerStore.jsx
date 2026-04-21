// store/employerStore.jsx
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const useEmployerStore = create((set, get) => ({
  employerProfile: null,
  isLoading: false,
  isUploading: false,
  error: null,

  // ── Auth config (same pattern as seekerStore) ──────────────────────────
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

  // ── Error handler ──────────────────────────────────────────────────────
  handleError: (error, fallbackMessage) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || fallbackMessage;
    if (status === 401) {
      useAuthStore.getState().logoutLocal?.(false);
    }
    set({ error: message, isLoading: false, isUploading: false });
    toast.error(message);
    return { success: false, error: message };
  },

  // ── Fetch My Employer Profile ──────────────────────────────────────────
  fetchEmployerProfile: async ({ silent = false } = {}) => {
    if (!silent) set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/employers/me`,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({
          employerProfile: response.data.data,
          isLoading: false,
          error: null,
        });
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to fetch profile" };
    } catch (error) {
      if (error?.response?.status === 404) {
        set({ employerProfile: null, isLoading: false, error: null });
        return { success: false, notFound: true };
      }
      return get().handleError(error, "Failed to fetch employer profile");
    }
  },

  // ── Create Employer Profile ────────────────────────────────────────────
  createEmployerProfile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/employers/me/create`,
        payload,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ employerProfile: response.data.data, isLoading: false });
        toast.success("Employer profile created successfully!");
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to create profile" };
    } catch (error) {
      // 409 = already exists, fetch instead
      if (error?.response?.status === 409) {
        set({ isLoading: false });
        return await get().fetchEmployerProfile();
      }
      return get().handleError(error, "Failed to create employer profile");
    }
  },

  // ── Update Employer Profile ────────────────────────────────────────────
  updateEmployerProfile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/employers/me/update`,
        payload,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ employerProfile: response.data.data, isLoading: false });
        toast.success("Profile updated successfully!");
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to update profile" };
    } catch (error) {
      return get().handleError(error, "Failed to update employer profile");
    }
  },

  // ── Upload Profile Image ───────────────────────────────────────────────
  uploadProfileImage: async (file) => {
    set({ isUploading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      const response = await axios.patch(
        `${API_URL}/employers/me/profile-assets`,
        formData,
        get().getAuthConfig({
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
      if (response.data?.success) {
        set({ employerProfile: response.data.data, isUploading: false });
        toast.success("Profile image updated!");
        return { success: true, data: response.data.data };
      }
      set({ isUploading: false });
      return { success: false, error: "Failed to upload image" };
    } catch (error) {
      return get().handleError(error, "Failed to upload profile image");
    }
  },

  // ── Helpers ────────────────────────────────────────────────────────────
  clearEmployerProfile: () => set({ employerProfile: null, error: null }),
  clearError: () => set({ error: null }),
}));

export default useEmployerStore;
