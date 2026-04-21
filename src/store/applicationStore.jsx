// store/jobPostStore.jsx
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const useApplicationStore = create((set, get) => ({
  // Job posts
  myJobs: [],
  publicJobs: [],
  publicMeta: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  // Categories
  categories: [],
  categoriesLoading: false,

  // ── Auth config ────────────────────────────────────────────────────────
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
    set({ error: message, isLoading: false, isSubmitting: false });
    toast.error(message);
    return { success: false, error: message };
  },

  // ── Fetch Categories (public, no auth needed) ──────────────────────────
  fetchCategories: async () => {
    set({ categoriesLoading: true });
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data?.success) {
        const active = (response.data.data || []).filter(
          (c) => c.isActive !== false,
        );
        set({ categories: active, categoriesLoading: false });
        return { success: true, data: active };
      }
      set({ categoriesLoading: false });
      return { success: false };
    } catch (error) {
      set({ categoriesLoading: false });
      return { success: false, error: error?.response?.data?.message };
    }
  },

  // ── Fetch My Jobs ──────────────────────────────────────────────────────
  fetchMyJobs: async ({ silent = false } = {}) => {
    if (!silent) set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/jobs/me`,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({
          myJobs: response.data.data || [],
          isLoading: false,
          error: null,
        });
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to fetch your jobs");
    }
  },

  // ── Create Job Post ────────────────────────────────────────────────────
  createJobPost: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/jobs/create`,
        payload,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        const newJob = response.data.data;
        set((state) => ({
          myJobs: [newJob, ...state.myJobs],
          isSubmitting: false,
        }));
        toast.success("Job posted successfully!");
        return { success: true, data: newJob };
      }
      set({ isSubmitting: false });
      return { success: false, error: "Failed to create job" };
    } catch (error) {
      return get().handleError(error, "Failed to create job post");
    }
  },

  // ── Update Job Post ────────────────────────────────────────────────────
  updateJobPost: async (jobId, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/jobs/update/${jobId}`,
        payload,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        const updated = response.data.data;
        set((state) => ({
          myJobs: state.myJobs.map((j) =>
            (j.jobId || j._id) === jobId ? updated : j,
          ),
          isSubmitting: false,
        }));
        toast.success("Job updated successfully!");
        return { success: true, data: updated };
      }
      set({ isSubmitting: false });
      return { success: false, error: "Failed to update job" };
    } catch (error) {
      return get().handleError(error, "Failed to update job post");
    }
  },

  // ── Update Job Status ──────────────────────────────────────────────────
  updateJobStatus: async (jobId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${API_URL}/jobs/${jobId}/status`,
        { status },
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        const updated = response.data.data;
        set((state) => ({
          myJobs: state.myJobs.map((j) =>
            (j.jobId || j._id) === jobId ? updated : j,
          ),
          isLoading: false,
        }));
        toast.success(`Job status updated to ${status}`);
        return { success: true, data: updated };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to update job status");
    }
  },

  // ── Delete Job Post ────────────────────────────────────────────────────
  deleteJobPost: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${API_URL}/jobs/${jobId}`,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set((state) => ({
          myJobs: state.myJobs.filter((j) => (j.jobId || j._id) !== jobId),
          isLoading: false,
        }));
        toast.success("Job deleted successfully!");
        return { success: true };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to delete job post");
    }
  },

  // ── List Public Jobs ───────────────────────────────────────────────────
  fetchPublicJobs: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs`, {
        params: query,
        withCredentials: true,
      });
      if (response.data?.success) {
        set({
          publicJobs: response.data.data?.items || [],
          publicMeta: response.data.data?.meta || null,
          isLoading: false,
        });
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to fetch jobs");
    }
  },

  // ── Admin: Approve ─────────────────────────────────────────────────────
  approveJob: async (jobId) => {
    set({ isLoading: true });
    try {
      const response = await axios.patch(
        `${API_URL}/jobs/admin/approve/${jobId}`,
        {},
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ isLoading: false });
        toast.success("Job approved and published!");
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to approve job");
    }
  },

  // ── Admin: Reject ──────────────────────────────────────────────────────
  rejectJob: async (jobId) => {
    set({ isLoading: true });
    try {
      const response = await axios.patch(
        `${API_URL}/jobs/admin/reject/${jobId}`,
        {},
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ isLoading: false });
        toast.success("Job rejected.");
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to reject job");
    }
  },

  // ── Helpers ────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),
}));

export default useApplicationStore;
