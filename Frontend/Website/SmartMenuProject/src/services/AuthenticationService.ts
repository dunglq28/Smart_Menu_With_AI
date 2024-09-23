import axios from "axios";
import axiosAuth from "../api/axiosAuth";
import axiosLogin from "../api/axiosLogin";
import { Password, PasswordForm } from "../models/Password.model";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";
import { LoginResponse } from "../payloads/responses/LoginResponse.model";

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await axiosLogin.post("authentication/login", {
    userName: username,
    password: password,
  });
  const apiResponse = res.data as LoginResponse;
  return apiResponse;
};

export const refreshToken = async (): Promise<string | undefined> => {
  try {
    const accessToken = localStorage.getItem("AccessToken");
    const refreshToken = localStorage.getItem("RefreshToken");

    if (!accessToken || !refreshToken) {
      return undefined;
    }

    const res = await axiosLogin.post("authentication/refresh-token", {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    if (res.status === 200) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;
      localStorage.setItem("AccessToken", newAccessToken);
      localStorage.setItem("RefreshToken", newRefreshToken);
      return newAccessToken;
    }

    return undefined;
  } catch (error) {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    return undefined;
  }
};

export const updatePassword = async (
  id: number,
  password: PasswordForm,
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosAuth.put(`account/change-password?id=${id}`, {
      oldPassword: password.oldPassword.value,
      newPassword: password.newPassword.value,
      confirm: password.confirm.value,
    });
    const apiResponse = res.data as ApiResponse<Object>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<Object>;
    }
    throw new Error("Unexpected error");
  }
};
