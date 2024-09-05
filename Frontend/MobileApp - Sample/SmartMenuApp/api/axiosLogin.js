import axios from "axios";
import Toast from "react-native-toast-message";
import {
  convertKeysToCamelCase,
  convertKeysToKebabCase,
} from "../utils/keyCaseConverter";

import { API_HOST, API_PORT, IS_DEVELOPMENT, API_DEPLOY } from "@env";

const BASE_URL = `http://10.0.2.2:7001/api`
  
const axiosLogin = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a Request interceptor
axiosLogin.interceptors.request.use(
  async function (config) {
    // Initialize header if not already defined
    if (config.data) {
      config.data = convertKeysToKebabCase(config.data);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Custom error handler function
const handleAxiosError = (error) => {
  if (error.message === "Network Error" && !error.response) {
    Toast.show({
      type: "error",
      text1: "Vui lòng kiểm tra kết nối!",
    });
  } else if (error.response && error.response.status === 403) {
    Toast.show({
      type: "error",
      text1: error.response.data.message,
    });
  } else if (error.response && error.response.status === 401) {
    Toast.show({
      type: "error",
      text1: error.response.data.message,
    });
  } else if (error.response && error.response.status === 400) {
    Toast.show({
      type: "error",
      text1: "Đăng nhập thất bại",
    });
  } else {
    // Custom handling for other errors
    Toast.show({
      type: "error",
      text1: "Đã xảy ra lỗi, vui lòng thử lại sau.",
    });
  }
  return Promise.reject(error);
};

// Add Response interceptor
axiosLogin.interceptors.response.use(
  function (response) {
    if (response.data) {
      response.data = convertKeysToCamelCase(response.data);
    }
    return response;
  },
  async function (error) {
    handleAxiosError(error);
    return Promise.reject(error);
  }
);

export default axiosLogin;
