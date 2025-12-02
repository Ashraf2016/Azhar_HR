import axios from "axios";
import { navigate } from "./navigate";


const axiosInstance = axios.create({
  baseURL: "https://university.roboeye-tec.com",
});

// نضيف التوكن تلقائياً في كل الطلبات
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// لو التوكن منتهي → خروج تلقائي 
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401 || message === "Invalid or expired token") {
     
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      navigate("/");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

