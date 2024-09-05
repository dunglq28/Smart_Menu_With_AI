import { refreshToken } from "./../services/AuthenticationService";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  convertKeysToCamelCase,
  convertKeysToKebabCase,
  convertQueryParamsToKebabCase,
} from "../utils/keyCaseConverter";
import { useNavigation } from "@react-navigation/native";
import { API_HOST, API_PORT, IS_DEVELOPMENT, API_DEPLOY } from "@env";

// const BASE_URL =
//   IS_DEVELOPMENT == false ? `${API_HOST}:${API_PORT}/api` : `${API_DEPLOY}/api`;
const BASE_URL = `http://10.0.2.2:7001/api`

const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a Request interceptor
axiosAuth.interceptors.request.use(
  async function (config) {
    // Initialize header if not already defined
    config.headers = config.headers || {};

    const accessToken = await AsyncStorage.getItem("AccessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.data) {
      config.data = convertKeysToKebabCase(config.data);
    }

    if (config.params) {
      config.params = convertQueryParamsToKebabCase(config.params);
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add Response interceptor
axiosAuth.interceptors.response.use(
  function (response) {
    if (response.data) {
      response.data = convertKeysToCamelCase(response.data);
    }
    return response;
  },

  async function (error) {
    if (error.message === "Network Error" && !error.response) {
      Toast.show({
        type: "error",
        text1: "Vui lòng kiểm tra kết nối!",
      });
    }

    const originalRequest = error.config;

    if (error.response && error.response.status === 403) {
      Toast.show({
        type: "error",
        text1: "Bạn không có quyền truy cập vào tài nguyên này",
      });
    }

    if (error.response && error.response.status === 401) {
      const authMessage = error.response.data.Message;

      if (authMessage && authMessage.includes("Token đã hết hạn!")) {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          await AsyncStorage.setItem("AccessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosAuth(originalRequest);
        } else {
          Toast.show({
            type: "error",
            text1: "Token đã hết hạn. Vui lòng đăng nhập lại.",
          });
          const navigation = useNavigation();
          navigation.navigate("Login"); // Navigate to the login screen
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Bạn không được phép truy cập trang này",
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;
