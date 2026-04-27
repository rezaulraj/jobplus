// jobstore.jsx
// store/JobStore.jsx
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const mapJob = (job) => {
  if (!job) return null;
  return {
    id: job.jobId || job._id,
    title: job.jobTitle,
    company: job.companyId?.nameCompany || "Unknown Company",
    location: job.jobLocation || "Remote",
    salary: {
      min: job.salaryMin || 0,
      max: job.salaryMax || 0,
      default: job.salaryMin || job.salaryMax ? "" : "Negotiable",
    },
    vacancy: job.vacancy || 1,
    category: job.jobCategoryId?.nameCategory || "General",
    experience: job.experienceLevel || "Fresher",
    type: job.jobType,
    jobType: job.jobType,
    jobPostedDate: job.publishedAt || job.createdAt,
    jobEndDate: job.endDate,
    description: job.jobDescription,
    clogo: job.companyId?.companyLogo || "/images/default-company.png",
    compnay: {
      website: job.companyId?.website || "",
      email: job.companyId?.emailCompany || "",
      phone: job.companyId?.phoneCompany || "",
      address: job.companyId?.address || "",
    },
    // Adding some defaults for fields that might be missing but expected by UI
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    skills: job.skills || [],
    gender: job.gender || "Anyone Can Apply",
    education: job.education || "As per company policy",
  };
};

const useJobStore = create((set, get) => ({
  jobs: [],
  meta: null,
  currentJob: null,
  categories: [],
  isLoading: false,
  error: null,

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
    set({ error: message, isLoading: false });
    // toast.error(message);
    return { success: false, error: message };
  },

  // ── Fetch Jobs (Public) ────────────────────────────────────────────────
  fetchJobs: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs`, {
        params: query,
        withCredentials: true,
      });
      if (response.data?.success) {
        const mappedJobs = (response.data.data?.items || []).map(mapJob);
        set({
          jobs: mappedJobs,
          meta: response.data.data?.meta || null,
          isLoading: false,
        });
        return { success: true, data: mappedJobs };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to fetch jobs");
    }
  },

  // ── Fetch Single Job ───────────────────────────────────────────────────
  fetchJobById: async (jobId) => {
    set({ isLoading: true, currentJob: null, error: null });
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`, {
        withCredentials: true,
      });
      if (response.data?.success) {
        const mapped = mapJob(response.data.data);
        set({
          currentJob: mapped,
          isLoading: false,
        });
        return { success: true, data: mapped };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to fetch job details");
    }
  },

  // ── Fetch Categories (Public) ──────────────────────────────────────────
  fetchCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`, {
        withCredentials: true,
      });
      if (response.data?.success) {
        set({ categories: response.data.data || [] });
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return { success: false };
    }
  },

  // ── Helpers ────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),
  clearCurrentJob: () => set({ currentJob: null }),
}));

export default useJobStore;
