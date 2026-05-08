import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const mapJob = (job) => {
  if (!job) return null;

  const jobTypeId =
    job.jobTypeId?.jobTypeId || job.jobTypeId?._id || job.jobTypeId || "";

  const jobTypeTitle =
    job.jobTypeId?.title || job.jobType?.title || job.jobType || "";

  return {
    id: job.jobId || job._id,

    jobId: job.jobId,
    title: job.jobTitle,
    description: job.jobDescription,

    companyId: job.companyId?.companyId || job.companyId?._id || job.companyId,
    company: job.companyId?.nameCompany || "Unknown Company",
    companyLogo: job.companyId?.companyLogo || "/images/default-company.png",

    categoryId:
      job.jobCategoryId?.jobCategoryId ||
      job.jobCategoryId?._id ||
      job.jobCategoryId,
    category:
      job.jobCategoryId?.title || job.jobCategoryId?.nameCategory || "General",

    countryId: job.countryId?.countryId || job.countryId?._id || job.countryId,
    country: job.countryId?.name || job.country || "",
    countryFlag: job.countryId?.flag || "",

    location: job.jobLocation || "Remote",

    salary: {
      min: job.salaryMin || 0,
      max: job.salaryMax || 0,
      default: job.salaryMin || job.salaryMax ? "" : "Negotiable",
    },

    vacancy: job.vacancy || 1,
    experience: job.experienceLevel || "Fresher",

    jobTypeId,
    type: jobTypeTitle,
    jobType: jobTypeTitle,

    status: job.status,
    jobPostedDate: job.publishedAt || job.createdAt,
    jobEndDate: job.endDate,

    clogo: job.companyId?.companyLogo || "/images/default-company.png",

    compnay: {
      website: job.companyId?.website || "",
      email: job.companyId?.emailCompany || "",
      phone: job.companyId?.phoneCompany || "",
      address: job.companyId?.address || "",
    },

    requirements: job.requirements || [],
    benefits: job.benefits || [],
    skills: job.skills || [],
    gender: job.gender || "Anyone Can Apply",
    education: job.education || "As per company policy",

    raw: job,
  };
};

const useJobStore = create((set, get) => ({
  jobs: [],
  meta: null,
  currentJob: null,

  categories: [],
  countries: [],
  companies: [],
  jobTypes: [],

  selectedCategoryId: "",
  selectedCompanyId: "",
  selectedCountryId: "",
  selectedJobTypeId: "",

  isLoading: false,
  error: null,

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

  handleError: (error, fallbackMessage) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || fallbackMessage;

    if (status === 401) {
      useAuthStore.getState().logoutLocal?.(false);
    }

    set({ error: message, isLoading: false });
    return { success: false, error: message };
  },

  fetchJobs: async (query = {}) => {
    set({ isLoading: true, error: null });

    try {
      const params = {
        page: query.page || 1,
        limit: query.limit || 10,
        sortBy: query.sortBy || "createdAt",
        order: query.order || "desc",

        ...(query.status ? { status: query.status } : {}),
        ...(query.jobCategoryId ? { jobCategoryId: query.jobCategoryId } : {}),
        ...(query.companyId ? { companyId: query.companyId } : {}),
        ...(query.countryId ? { countryId: query.countryId } : {}),
        ...(query.jobTypeId ? { jobTypeId: query.jobTypeId } : {}),
        ...(query.search ? { search: query.search } : {}),
      };

      const response = await axios.get(
        `${API_URL}/jobs`,
        get().getAuthConfig({ params }),
      );

      if (response.data?.success) {
        const items = response.data.data?.items || [];
        const mappedJobs = items.map(mapJob);

        set({
          jobs: mappedJobs,
          meta: response.data.data?.meta || null,
          isLoading: false,
        });

        return {
          success: true,
          data: mappedJobs,
          meta: response.data.data?.meta || null,
        };
      }

      set({ isLoading: false });
      return { success: false };
    } catch (error) {
      return get().handleError(error, "Failed to fetch jobs");
    }
  },

  fetchJobsByCategory: async (jobCategoryId, extraQuery = {}) => {
    set({ selectedCategoryId: jobCategoryId });

    return get().fetchJobs({
      ...extraQuery,
      jobCategoryId,
      page: extraQuery.page || 1,
    });
  },

  fetchJobsByCompany: async (companyId, extraQuery = {}) => {
    set({ selectedCompanyId: companyId });

    return get().fetchJobs({
      ...extraQuery,
      companyId,
      page: extraQuery.page || 1,
    });
  },

  fetchJobsByCountry: async (countryId, extraQuery = {}) => {
    set({ selectedCountryId: countryId });

    return get().fetchJobs({
      ...extraQuery,
      countryId,
      page: extraQuery.page || 1,
    });
  },

  fetchJobsByJobType: async (jobTypeId, extraQuery = {}) => {
    set({ selectedJobTypeId: jobTypeId });

    return get().fetchJobs({
      ...extraQuery,
      jobTypeId,
      page: extraQuery.page || 1,
    });
  },

  fetchJobById: async (jobId) => {
    set({ isLoading: true, currentJob: null, error: null });

    try {
      const response = await axios.get(
        `${API_URL}/jobs/${jobId}`,
        get().getAuthConfig(),
      );

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

  fetchCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        const active = (response.data.data || []).filter(
          (item) => item.isActive !== false,
        );

        set({ categories: active });
        return { success: true, data: active };
      }

      return { success: false };
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return { success: false };
    }
  },

  fetchCountries: async () => {
    try {
      const response = await axios.get(`${API_URL}/countries`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        const active = (response.data.data || []).filter(
          (item) => item.isActive !== false,
        );

        set({ countries: active });
        return { success: true, data: active };
      }

      return { success: false };
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      return { success: false };
    }
  },

  fetchJobTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/job-types`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        const active = (response.data.data || []).filter(
          (item) => item.isActive !== false,
        );

        set({ jobTypes: active });
        return { success: true, data: active };
      }

      return { success: false };
    } catch (error) {
      console.error("Failed to fetch job types:", error);
      return { success: false };
    }
  },

  fetchCompanies: async () => {
    try {
      const response = await axios.get(`${API_URL}/company`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        const companies = response.data.data?.items || response.data.data || [];

        set({ companies });

        return { success: true, data: companies };
      }

      return { success: false };
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      return { success: false };
    }
  },

  fetchJobFilters: async () => {
    const [categories, countries, companies, jobTypes] = await Promise.all([
      get().fetchCategories(),
      get().fetchCountries(),
      get().fetchCompanies(),
      get().fetchJobTypes(),
    ]);

    return {
      success:
        categories.success ||
        countries.success ||
        companies.success ||
        jobTypes.success,
      categories,
      countries,
      companies,
      jobTypes,
    };
  },

  setSelectedCategoryId: (jobCategoryId) =>
    set({ selectedCategoryId: jobCategoryId }),

  setSelectedCompanyId: (companyId) => set({ selectedCompanyId: companyId }),

  setSelectedCountryId: (countryId) => set({ selectedCountryId: countryId }),

  setSelectedJobTypeId: (jobTypeId) => set({ selectedJobTypeId: jobTypeId }),

  clearFilters: () =>
    set({
      selectedCategoryId: "",
      selectedCompanyId: "",
      selectedCountryId: "",
      selectedJobTypeId: "",
    }),

  clearError: () => set({ error: null }),
  clearCurrentJob: () => set({ currentJob: null }),
}));

export default useJobStore;
