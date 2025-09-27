// useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast"; 

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      console.log("Checking auth with request to /auth/check"); // Log request start
      const res = await axiosInstance.get("/auth/check");
      console.log("CheckAuth response:", res.data); // Log response
      set({ authUser: res.data });
      if (res.data?.username) {
        get().connectSocket();
      }
    } catch (error) {
      console.error("CheckAuth error:", error.response?.data || error.message); // Log error
      if (error.response?.status === 401) {
        // Retry once after a delay
        setTimeout(async () => {
          try {
            console.log("Retrying auth check after 500ms");
            const retryRes = await axiosInstance.get("/auth/check");
            console.log("Retry CheckAuth response:", retryRes.data); // Log retry response
            set({ authUser: retryRes.data });
            if (retryRes.data?.username) {
              get().connectSocket();
            }
          } catch {
            console.error("Retry CheckAuth failed");
            set({ authUser: null });
          }
        }, 500);
      } else {
        set({ authUser: null });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Signup failed";
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyOtp: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", data);
      set({ authUser: { email: data.email } });
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "OTP verification failed";
    }
  },

  setUsername: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/set-username", data);
      set({ authUser: res.data });
      get().connectSocket();
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Username setup failed";
    }
  },

  forgotPassword: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Forgot password request failed";
    }
  },

  resetPassword: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Password reset failed";
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      console.log("Login API response:", res.data); // Log login response
      if (res.status === 200 && res.data) {
        set({ authUser: res.data });
        get().connectSocket();
        return res.data;
      } else {
        throw new Error(res.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message); // Log login error
      throw error.response?.data?.message || error.message || "Login failed";
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out successfully", { duration: 3000 });
    } catch (error) {
      console.error("Logout error:", error);
      throw error.response?.data?.message || "Logout failed";
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/update-profile", data);
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Profile update failed";
    }
  },

  blockUser: async (blockUserId) => {
    try {
      const res = await axiosInstance.post("/auth/block", { blockUserId });
      set({ authUser: res.data.user });
      toast.success("User blocked");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to block user");
    }
  },

  unblockUser: async (unblockUserId) => {
    try {
      const res = await axiosInstance.post("/auth/unblock", { unblockUserId });
      set({ authUser: res.data.user });
      toast.success("User unblocked");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("youAreBlocked", (data) => {
      toast.error(`You have been blocked by @${data.byUser.username}`);
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));