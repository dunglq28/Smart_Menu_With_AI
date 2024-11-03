import { axiosAuth } from "@/api";
import { ApiResponse, SubscriptionData } from "@/payloads";

export const getSubscription = async (userId: number): Promise<ApiResponse<SubscriptionData>> => {
  const res = await axiosAuth.get(`subscriptions/${userId}`);
  const apiResponse = res.data as ApiResponse<SubscriptionData>;
  return apiResponse;
};
