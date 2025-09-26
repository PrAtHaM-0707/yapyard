import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://yapyard-20fr.onrender.com/api" : "/api",
  withCredentials: true,
});
