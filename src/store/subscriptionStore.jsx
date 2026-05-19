// store/subscriptionStore.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const useSubscriptionStore = create((set, get) => ({
  plans: [],
  mySubscription: null,
  isLoading: false,
  isLoadingMyPlan: false,
  error: null,

  // ── Auth config ───
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

  // ── Error handler ──
  handleError: (error, fallbackMessage) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || fallbackMessage;
    if (status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logoutLocal?.(false);
    }
    set({ error: message, isLoading: false, isLoadingMyPlan: false });
    toast.error(message);
    return { success: false, error: message };
  },

  // ── Fetch All Plans ───
  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/plans`,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({ plans: response.data.data || [], isLoading: false });
        return { success: true, data: response.data.data };
      }
      set({ isLoading: false });
      return { success: false, error: "Failed to fetch plans" };
    } catch (error) {
      return get().handleError(error, "Failed to fetch plans");
    }
  },

  // ── Fetch My Subscription ───
  fetchMySubscription: async ({ silent = false } = {}) => {
    if (!silent) set({ isLoadingMyPlan: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/subscriptions/me`,
        get().getAuthConfig(),
      );
      if (response.data?.success) {
        set({
          mySubscription: response.data.data,
          isLoadingMyPlan: false,
          error: null,
        });
        return { success: true, data: response.data.data };
      }
      set({ isLoadingMyPlan: false });
      return { success: false, error: "Failed to fetch subscription" };
    } catch (error) {
      if (error?.response?.status === 404) {
        set({ mySubscription: null, isLoadingMyPlan: false, error: null });
        return { success: false, notFound: true };
      }
      return get().handleError(error, "Failed to fetch subscription");
    }
  },

  // ── Helpers ────
  clearError: () => set({ error: null }),
}));

export default useSubscriptionStore;
