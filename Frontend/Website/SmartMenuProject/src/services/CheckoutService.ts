import axios from "axios";
import axiosAuth from "../api/axiosAuth";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";

export const createPaymentLink = async (
  amount: string,
  userId: string | undefined,
  email: string,
  planId: number,
  planName: string,
): Promise<ApiResponse<string>> => {
  try {
    const res = await axiosAuth.post("PayOS/create-payment-link", {
      amount: amount,
      userId: userId,
      email: email,
      planId: planId,
      planName: planName,
    });
    const apiResponse = res.data as ApiResponse<string>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<string>;
    }
    throw new Error("Unexpected error");
  }
};

export const createExtendPaymentLink = async (subId: number): Promise<ApiResponse<string>> => {
  try {
    const res = await axiosAuth.post("PayOS/Extend/create-payment-link", {
      subId: subId,
    });
    const apiResponse = res.data as ApiResponse<string>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<string>;
    }
    throw new Error("Unexpected error");
  }
};
