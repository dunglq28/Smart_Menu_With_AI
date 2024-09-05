import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  convertKeysToCamelCase,
  convertKeysToKebabCase,
} from "../utils/keyCaseConverter";
import { API_HOST, API_PORT, IS_DEVELOPMENT, API_DEPLOY } from "@env";

const BASE_URL = `http://10.0.2.2:7001/api`
  
const axiosMultipartForm = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Thêm interceptor cho request
axiosMultipartForm.interceptors.request.use(
  async function (config) {
    // Lấy token từ AsyncStorage
    const token = await AsyncStorage.getItem("AccessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Chuyển đổi dữ liệu sang dạng kebab-case nếu có
    // if (config.data) {
    //   config.data = convertKeysToKebabCase(config.data);
    // }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Hàm xử lý lỗi tùy chỉnh
const handleAxiosError = (error) => {
  if (error.message === "Network Error" && !error.response) {
    Toast.show({
      type: "error",
      text1: "Vui lòng kiểm tra kết nối!",
    });
  } else if (error.response && error.response.status === 403) {
    Toast.show({
      type: "error",
      text1: "Bạn không có quyền truy cập vào tài nguyên này",
    });
  } else if (error.response && error.response.status === 401) {
    Toast.show({
      type: "error",
      text1: error.response.data.message,
    });
  }
  return Promise.reject(error);
};

// Thêm interceptor cho response
axiosMultipartForm.interceptors.response.use(
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

export default axiosMultipartForm;
