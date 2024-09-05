import axiosLogin from "../api/axiosLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (username, password) => {
  try {
    const res = await axiosLogin.post("authentication/login", {
      userName: username,
      password: password,
    });
    const apiResponse = res.data;
    return apiResponse;
  } catch (error) {
    return null;
  }
};

export const refreshToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("AccessToken");
    const refreshToken = await AsyncStorage.getItem("RefreshToken");

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
      await AsyncStorage.setItem("AccessToken", newAccessToken);
      await AsyncStorage.setItem("RefreshToken", newRefreshToken);
      return newAccessToken;
    }

    return undefined;
  } catch (error) {
    await AsyncStorage.removeItem("AccessToken");
    await AsyncStorage.removeItem("RefreshToken");
    return undefined;
  }
};
