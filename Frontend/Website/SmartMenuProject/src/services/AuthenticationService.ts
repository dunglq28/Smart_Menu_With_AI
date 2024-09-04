import axiosLogin from "../api/axiosLogin";
import { LoginResponse } from "../payloads/responses/LoginResponse.model";

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
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
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        res.data.data;
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
