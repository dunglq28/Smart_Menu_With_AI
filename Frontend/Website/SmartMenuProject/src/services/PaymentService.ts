import axios from "axios";
import axiosAuth from "../api/axiosAuth";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";
import { PaymentStatus } from "../constants/Enum";
import { PaymentData } from "../payloads/responses/PaymentData.model";
import { GetData } from "../payloads/responses/GetData.model";

export const getPayments = async (
  currentPage: number,
  rowsPerPage: number,
  searchValue: string,
): Promise<GetData<PaymentData>> => {
  const res = await axiosAuth.get("payments", {
    params: {
      pageNumber: currentPage,
      pageSize: rowsPerPage,
      searchKey: searchValue,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse.data as GetData<PaymentData>;
};

export const checkExistEmail = async (email: string): Promise<ApiResponse<PaymentData>> => {
  const res = await axiosAuth.get("payments/check-exist-email", {
    params: {
      email: email,
    },
  });
  const apiResponse = res.data as ApiResponse<PaymentData>;
  return apiResponse;
};

export const updatePaymentStatus = async (
  paymentId: number,
  userId: number,
  status: PaymentStatus,
  isRenew: boolean,
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosAuth.put("payments", {
      paymentId: paymentId,
      userId: userId,
      status: status,
      isRenew: isRenew,
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
