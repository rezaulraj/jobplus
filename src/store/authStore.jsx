import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

let isRefreshing = false;
let failedQueue = [];
let hasShownSessionExpiredToast = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const clearAuthState = (set) => {
  delete axios.defaults.headers.common["Authorization"];
  set({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
  });
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      otpTimer: 0,
      otpEmail: null,
      registrationData: null,

      // ── Helpers ─────────────────────────────────────────────────────────
      getBearerToken: () => {
        return get().tokens?.accessToken || null;
      },

      setAuthHeader: (token) => {
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common["Authorization"];
        }
      },

      // Returns "seeker" | "employer" | null
      getRole: () => {
        return get().user?.role || null;
      },

      logoutLocal: (showToast = true) => {
        clearAuthState(set);
        if (showToast) {
          toast.success("Logged out successfully!");
        }
      },

      // ── fetchMe ──────────────────────────────────────────────────────────
      fetchMe: async () => {
        const accessToken = get().tokens?.accessToken;

        if (!accessToken) {
          return { success: false, error: "No token found" };
        }

        try {
          get().setAuthHeader(accessToken);

          const response = await axios.get(`${API_URL}/users/me`);

          if (response.data?.success) {
            const me = response.data.data;

            set((state) => ({
              user: {
                ...state.user,
                ...me,
                // ensure role is always saved from latest /me response
                role: me.role || state.user?.role,
              },
              isAuthenticated: true,
            }));

            return { success: true, data: me };
          }

          return { success: false, error: "Failed to fetch user" };
        } catch (error) {
          const status = error?.response?.status;

          console.error(
            "Fetch me error:",
            error.response?.data || error.message,
          );

          if (status === 401) {
            return {
              success: false,
              unauthorized: true,
              error: "Unauthorized",
            };
          }

          return {
            success: false,
            error: error.response?.data?.message || "Failed to fetch user",
          };
        }
      },

      // ── initializeAuth ───────────────────────────────────────────────────
      initializeAuth: async () => {
        const accessToken = get().tokens?.accessToken;

        if (!accessToken) {
          get().setAuthHeader(null);
          set({ isAuthenticated: false });
          return { success: false, error: "No token found" };
        }

        get().setAuthHeader(accessToken);

        const meResult = await get().fetchMe();
        if (meResult.success) return meResult;

        if (meResult.unauthorized) {
          const refreshResult = await get().refreshTokens();
          if (refreshResult.success) {
            return await get().fetchMe();
          }
          get().logoutLocal(false);
          return {
            success: false,
            error: refreshResult.error || "Session expired",
          };
        }

        return meResult;
      },

      // ── register ─────────────────────────────────────────────────────────
      register: async (userData) => {
        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/auth/register`, {
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            role: userData.role || "seeker",
          });

          if (
            response.data.success ||
            response.data.message ===
              "Registration successful. Please verify your email."
          ) {
            set({
              registrationData: userData,
              otpEmail: userData.email,
              otpTimer: 600,
              isLoading: false,
            });

            const timerInterval = setInterval(() => {
              const currentTimer = get().otpTimer;
              if (currentTimer > 0) {
                set({ otpTimer: currentTimer - 1 });
              } else {
                clearInterval(timerInterval);
              }
            }, 1000);

            toast.success(
              "Registration successful! Please check your email for OTP.",
            );

            return { success: true, data: response.data };
          }

          set({ isLoading: false });
          return { success: false, error: "Registration failed" };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Registration failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ── verifyOtp ────────────────────────────────────────────────────────
      verifyOtp: async (email, otp) => {
        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/auth/verify-email`, {
            email,
            otp,
          });

          if (response.data.success) {
            set({
              otpTimer: 0,
              isLoading: false,
              registrationData: null,
            });

            toast.success("Email verified successfully! You can now login.");
            return { success: true, data: response.data };
          }

          set({ isLoading: false });
          return { success: false, error: "OTP verification failed" };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "OTP verification failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ── login ────────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
          });

          if (response.data.success) {
            const { user: loginUser, tokens } = response.data.data;
            const accessToken = tokens?.accessToken || null;

            set({
              tokens: { accessToken },
              // preserve role from API response
              user: loginUser || null,
              isAuthenticated: true,
              isLoading: false,
            });

            get().setAuthHeader(accessToken);
            hasShownSessionExpiredToast = false;

            toast.success("Logged in successfully!");

            // Return role so the login page can redirect correctly
            return {
              success: true,
              data: response.data,
              role: loginUser?.role || null,
            };
          }

          set({ isLoading: false });
          return { success: false, error: "Login failed" };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Login failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ── googleAuth ───────────────────────────────────────────────────────
      googleAuth: async (idToken) => {
        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/auth/google`, {
            idToken,
          });

          if (response.data.success) {
            const { user, tokens } = response.data.data;
            const accessToken = tokens?.accessToken || null;

            set({
              tokens: { accessToken },
              user: user || null,
              isAuthenticated: true,
              isLoading: false,
            });

            get().setAuthHeader(accessToken);
            hasShownSessionExpiredToast = false;

            toast.success("Google login successful!");
            return {
              success: true,
              data: response.data,
              role: user?.role || null,
            };
          }

          set({ isLoading: false });
          return { success: false, error: "Google authentication failed" };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Google authentication failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ── refreshTokens ────────────────────────────────────────────────────
      refreshTokens: async () => {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh-tokens`);

          if (response.data?.success) {
            const { user, accessToken } = response.data.data;

            set((state) => ({
              tokens: { accessToken },
              user: user
                ? {
                    ...state.user,
                    ...user,
                    role: user.role || state.user?.role,
                  }
                : state.user,
              isAuthenticated: true,
            }));

            get().setAuthHeader(accessToken);
            hasShownSessionExpiredToast = false;

            return { success: true, data: response.data };
          }

          return { success: false, error: "Token refresh failed" };
        } catch (error) {
          console.error(
            "Token refresh failed:",
            error.response?.data || error.message,
          );
          return {
            success: false,
            error: error.response?.data?.message || "Session expired",
            status: error.response?.status || null,
          };
        }
      },

      // ── forgotPassword ───────────────────────────────────────────────────
      forgotPassword: async (email) => {
        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/auth/forgot-password`, {
            email,
          });

          if (response.data.success) {
            set({
              otpEmail: email,
              otpTimer: 600,
              isLoading: false,
            });

            const timerInterval = setInterval(() => {
              const currentTimer = get().otpTimer;
              if (currentTimer > 0) {
                set({ otpTimer: currentTimer - 1 });
              } else {
                clearInterval(timerInterval);
              }
            }, 1000);

            toast.success("Password reset OTP sent to your email!");
            return { success: true, data: response.data };
          }

          set({ isLoading: false });
          return { success: false, error: "Failed to send OTP" };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Failed to send OTP";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ── resetPassword ────────────────────────────────────────────────────
      resetPassword: async (email, otp, newPassword) => {
        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/auth/reset-password`, {
            email,
            otp,
            newPassword,
          });

          if (response.data.success) {
            set({
              isLoading: false,
              otpTimer: 0,
              otpEmail: null,
            });

            toast.success("Password reset successfully! You can now login.");
            return { success: true, data: response.data };
          }

          set({ isLoading: false });
          return { success: false, error: "Failed to reset password" };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Failed to reset password";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ── resendOtp ────────────────────────────────────────────────────────
      resendOtp: async (email) => {
        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/auth/resend-otp`, {
            email,
          });

          if (response.data.success) {
            set({
              otpTimer: 600,
              isLoading: false,
            });

            toast.success("OTP resent successfully!");
            return { success: true, data: response.data };
          }

          set({ isLoading: false });
          return { success: false, error: "Failed to resend OTP" };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Failed to resend OTP";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ── logout ───────────────────────────────────────────────────────────
      logout: async (showToast = true) => {
        try {
          await axios.post(`${API_URL}/auth/logout`);
        } catch (error) {
          console.error(
            "Logout API failed:",
            error.response?.data || error.message,
          );
        } finally {
          get().logoutLocal(showToast);
        }
      },
    }),

    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, // role is inside user object
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        otpTimer: state.otpTimer,
        otpEmail: state.otpEmail,
        registrationData: state.registrationData,
      }),
      onRehydrateStorage: () => (state) => {
        state?.initializeAuth?.();
      },
    },
  ),
);

// ── Axios response interceptor ────────────────────────────────────────────
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (originalRequest.url?.includes("/auth/refresh-tokens")) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) return Promise.reject(error);

    if (originalRequest._retry) return Promise.reject(error);

    const authState = useAuthStore.getState();
    const hasToken = !!authState.tokens?.accessToken;

    if (!hasToken) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const result = await authState.refreshTokens();

      if (result.success) {
        const newToken = useAuthStore.getState().tokens?.accessToken;
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return axios(originalRequest);
      }

      processQueue(new Error(result.error || "Refresh failed"), null);
      useAuthStore.getState().logoutLocal(false);

      if (!hasShownSessionExpiredToast) {
        toast.error("Session expired. Please log in again.");
        hasShownSessionExpiredToast = true;
      }

      return Promise.reject(error);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logoutLocal(false);

      if (!hasShownSessionExpiredToast) {
        toast.error("Session expired. Please log in again.");
        hasShownSessionExpiredToast = true;
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default useAuthStore;
