import axiosAuth from "../api/axiosAuth";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";
import { SubscriptionData } from "../payloads/responses/SubscriptionData.model";

export const getSubscription = async (userId: number): Promise<ApiResponse<SubscriptionData>> => {
  const res = await axiosAuth.get(`subscriptions/${userId}`);
  const apiResponse = res.data as ApiResponse<SubscriptionData>;
  return apiResponse;
};
