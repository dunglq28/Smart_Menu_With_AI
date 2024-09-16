import axios from "axios";
import axiosAuth from "../api/axiosAuth";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";
import { PaymentStatus } from "../constants/Enum";

export const updatePaymentStatus = async (
  paymentId: number,
  subscriptionId: number,
  userId: string,
  status: PaymentStatus,
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosAuth.put("payments", {
      paymentId: paymentId,
      subscriptionId: subscriptionId,
      userId: userId,
      status: status,
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
