// axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Axios request config:", {
      url: config.url,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      headers: config.headers,
    }); // Log request details
    return config;
  },
  (error) => {
    console.error("Axios request error:", error); // Log request errors
    return Promise.reject(error);
  }
);