import axios from "axios";
import axiosAuth from "../api/axiosAuth";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";

export const createPaymentLink = async (): Promise<ApiResponse<string>> => {
  try {
    const res = await axiosAuth.post("PayOS/create-payment-link");
    const apiResponse = res.data as ApiResponse<string>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<string>;
    }
    throw new Error("Unexpected error");
  }
};
