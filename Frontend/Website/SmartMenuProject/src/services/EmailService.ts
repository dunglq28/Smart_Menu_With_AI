import axios from "axios";
import axiosAuth from "../api/axiosAuth";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";

export const sendVerificationCode = async (
  email: string,
  verificationCode: string,
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosAuth.post("send-verification-code", {
      email: email,
      verificationCode: verificationCode,
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
