import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { convertKeysToCamelCase, convertKeysToKebabCase } from "../utils/keyCaseConverter";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_DEVELOPMENT = import.meta.env.VITE_API_DEVELOPMENT;
const API_DEPLOY = import.meta.env.VITE_API_DEPLOY;

const BASE_URL = API_DEVELOPMENT == "true" ? `${API_HOST}:${API_PORT}/api` : `${API_DEPLOY}/api`;


const axiosLogin: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosLogin.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    if (config.data) {
      config.data = convertKeysToKebabCase(config.data);
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add Response interceptor
axiosLogin.interceptors.response.use(
  function (response: AxiosResponse) {
    if (response.data) {
      response.data = convertKeysToCamelCase(response.data);
    }
    return response;
  },

  function (error) {
    if (error.message === "Network Error" && !error.response) {
      toast.error("Lỗi mạng, vui lòng kiểm tra kết nối!");
    }
    if (error.response && error.response.status === 403) {
      toast.error(error.response.data.message);
    }
    if (error.response && error.response.status === 401) {
      toast.error(error.response.data.message);
    }
    if (error.response && error.response.status === 400) {
      toast.error("Đăng nhập thất bại");
    }
    return Promise.reject(error);
  },
);

export default axiosLogin;
