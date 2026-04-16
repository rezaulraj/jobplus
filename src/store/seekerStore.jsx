import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const useSeekerStore = create((set, get) => ({
  seekerProfile: null,
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
      const authStore = useAuthStore.getState();
      authStore.logoutLocal?.(false);
    }

    set({ error: message, isLoading: false });
    toast.error(message);
    return { success: false, error: message };
  },

  runRequest: async (requestFn, successMessage = "", options = {}) => {
    const {
      updateProfile = true,
      refetchProfile = false,
      keepReturnedDataOnly = false,
    } = options;

    set({ isLoading: true, error: null });

    try {
      const response = await requestFn();

      if (!response?.data?.success) {
        set({ isLoading: false });
        return { success: false, error: "Request failed" };
      }

      if (refetchProfile) {
        await get().fetchSeekerProfile({ silent: true });
      } else if (updateProfile && response.data.data && !keepReturnedDataOnly) {
        set({ seekerProfile: response.data.data });
      }

      set({ isLoading: false, error: null });

      if (successMessage) {
        toast.success(successMessage);
      }

      return { success: true, data: response.data.data };
    } catch (error) {
      return get().handleError(error, "Request failed");
    }
  },

  fetchSeekerProfile: async ({ silent = false } = {}) => {
    if (!silent) {
      set({ isLoading: true, error: null });
    }

    try {
      const response = await axios.get(
        `${API_URL}/seekers/me`,
        get().getAuthConfig(),
      );

      if (response.data.success) {
        set({
          seekerProfile: response.data.data,
          isLoading: false,
          error: null,
        });
        return { success: true, data: response.data.data };
      }

      set({ isLoading: false });
      return { success: false, error: "Failed to fetch profile" };
    } catch (error) {
      return get().handleError(error, "Failed to fetch profile");
    }
  },

  getPersonalInfo: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/seekers/me/personal-info`,
        get().getAuthConfig(),
      );

      if (response.data.success) {
        set((state) => ({
          seekerProfile: {
            ...(state.seekerProfile || {}),
            personalInfo: response.data.data || {},
          },
          isLoading: false,
          error: null,
        }));

        return { success: true, data: response.data.data };
      }

      return { success: false, error: "Failed to fetch personal info" };
    } catch (error) {
      return get().handleError(error, "Failed to fetch personal info");
    }
  },

  updatePersonalInfo: async (personalInfoData) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/personal-info`,
          personalInfoData,
          get().getAuthConfig(),
        ),
      "Personal information updated successfully!",
      { refetchProfile: true },
    ),

  deletePersonalInfo: async () =>
    get().runRequest(
      () =>
        axios.delete(
          `${API_URL}/seekers/me/personal-info`,
          get().getAuthConfig(),
        ),
      "Personal information removed successfully!",
      { refetchProfile: true, updateProfile: false },
    ),

  updateSummary: async (summary) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/summary`,
          { summary },
          get().getAuthConfig(),
        ),
      "Summary updated successfully!",
    ),

  addSkill: async (skillData) =>
    get().runRequest(
      () =>
        axios.post(
          `${API_URL}/seekers/me/skills`,
          { skills: [skillData] },
          get().getAuthConfig(),
        ),
      "Skill added successfully!",
      { refetchProfile: true },
    ),

  updateSkill: async (skillId, skillData) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/skills/${skillId}`,
          skillData,
          get().getAuthConfig(),
        ),
      "Skill updated successfully!",
      { refetchProfile: true },
    ),

  deleteSkill: async (skillId) =>
    get().runRequest(
      () =>
        axios.delete(
          `${API_URL}/seekers/me/skills/${skillId}`,
          get().getAuthConfig(),
        ),
      "Skill deleted successfully!",
      { refetchProfile: true, updateProfile: false },
    ),

  addExperience: async (experienceData) =>
    get().runRequest(
      () =>
        axios.post(
          `${API_URL}/seekers/me/experience`,
          experienceData,
          get().getAuthConfig(),
        ),
      "Experience added successfully!",
    ),

  updateExperience: async (expId, experienceData) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/experience/${expId}`,
          experienceData,
          get().getAuthConfig(),
        ),
      "Experience updated successfully!",
    ),

  deleteExperience: async (expId) =>
    get().runRequest(
      () =>
        axios.delete(
          `${API_URL}/seekers/me/experience/${expId}`,
          get().getAuthConfig(),
        ),
      "Experience deleted successfully!",
    ),

  addEducation: async (educationData) =>
    get().runRequest(
      () =>
        axios.post(
          `${API_URL}/seekers/me/education`,
          educationData,
          get().getAuthConfig(),
        ),
      "Education added successfully!",
      { refetchProfile: true },
    ),

  updateEducation: async (eduId, educationData) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/education/${eduId}`,
          educationData,
          get().getAuthConfig(),
        ),
      "Education updated successfully!",
      { refetchProfile: true },
    ),

  deleteEducation: async (eduId) =>
    get().runRequest(
      () =>
        axios.delete(
          `${API_URL}/seekers/me/education/${eduId}`,
          get().getAuthConfig(),
        ),
      "Education deleted successfully!",
      { refetchProfile: true, updateProfile: false },
    ),

  addProject: async (projectData) =>
    get().runRequest(
      () =>
        axios.post(
          `${API_URL}/seekers/me/projects`,
          projectData,
          get().getAuthConfig(),
        ),
      "Project added successfully!",
      { refetchProfile: true },
    ),

  updateProject: async (projectId, projectData) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/projects/${projectId}`,
          projectData,
          get().getAuthConfig(),
        ),
      "Project updated successfully!",
      { refetchProfile: true },
    ),

  deleteProject: async (projectId) =>
    get().runRequest(
      () =>
        axios.delete(
          `${API_URL}/seekers/me/projects/${projectId}`,
          get().getAuthConfig(),
        ),
      "Project deleted successfully!",
      { refetchProfile: true, updateProfile: false },
    ),

  updateJobPreferences: async (preferences) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/job-preferences`,
          preferences,
          get().getAuthConfig(),
        ),
      "Job preferences updated successfully!",
    ),

  removeJobPreferences: async () =>
    get().runRequest(
      () =>
        axios.delete(
          `${API_URL}/seekers/me/job-preferences`,
          get().getAuthConfig(),
        ),
      "Job preferences removed successfully!",
    ),

  addLanguage: async (languageData) =>
    get().runRequest(
      () =>
        axios.post(
          `${API_URL}/seekers/me/languages`,
          languageData,
          get().getAuthConfig(),
        ),
      "Language added successfully!",
      { refetchProfile: true },
    ),

  updateLanguage: async (language, proficiency) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/languages/${encodeURIComponent(language)}`,
          { proficiency },
          get().getAuthConfig(),
        ),
      "Language updated successfully!",
      { refetchProfile: true },
    ),

  deleteLanguage: async (language) =>
    get().runRequest(
      () =>
        axios.delete(
          `${API_URL}/seekers/me/languages/${encodeURIComponent(language)}`,
          get().getAuthConfig(),
        ),
      "Language deleted successfully!",
      { refetchProfile: true, updateProfile: false },
    ),

  uploadProfileAssets: async (formData) =>
    get().runRequest(
      () =>
        axios.post(
          `${API_URL}/seekers/me/profile-assets`,
          formData,
          get().getAuthConfig({
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
        ),
      "Profile assets uploaded successfully!",
    ),

  uploadResumeVideo: async (formData) =>
    get().runRequest(
      () =>
        axios.post(
          `${API_URL}/seekers/me/resume-video`,
          formData,
          get().getAuthConfig({
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
        ),
      "Resume video uploaded successfully!",
      { updateProfile: false },
    ),

  uploadResumeFile: async (formData) =>
    get().runRequest(
      () =>
        axios.post(
          `${API_URL}/seekers/me/resume-file`,
          formData,
          get().getAuthConfig({
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
        ),
      "Resume file uploaded successfully!",
      { updateProfile: false },
    ),

  updateResumeAssetVisibility: async (resumeAssetId, visibility) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/resume-assets/${resumeAssetId}/visibility`,
          { visibility },
          get().getAuthConfig(),
        ),
      "Resume asset visibility updated!",
      { updateProfile: false },
    ),

  setResumeAssetActive: async (resumeAssetId, isActive) =>
    get().runRequest(
      () =>
        axios.patch(
          `${API_URL}/seekers/me/resume-assets/${resumeAssetId}/active`,
          { isActive },
          get().getAuthConfig(),
        ),
      "Resume asset status updated!",
      { updateProfile: false },
    ),

  deleteResumeAsset: async (resumeAssetId) =>
    get().runRequest(
      () =>
        axios.delete(
          `${API_URL}/seekers/me/resume-assets/delete/${resumeAssetId}`,
          get().getAuthConfig(),
        ),
      "Resume asset deleted successfully!",
      { updateProfile: false },
    ),

  clearSeekerProfile: () => {
    set({ seekerProfile: null, error: null, isLoading: false });
  },
}));

export default useSeekerStore;
