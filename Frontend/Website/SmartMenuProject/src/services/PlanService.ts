import axiosAuth from "../api/axiosAuth";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";
import { PlanData } from "../payloads/responses/PlanResponse.model";

export const getPlans = async (): Promise<ApiResponse<PlanData[]>> => {
  const res = await axiosAuth.get("plans");
  const apiResponse = res.data as ApiResponse<PlanData[]>;
  return apiResponse;
};

export const getPlan = async (id: number): Promise<ApiResponse<PlanData>> => {
  const res = await axiosAuth.get("plans/get-by-id", {
    params: {
      planId: id,
    },
  });
  const apiResponse = res.data as ApiResponse<PlanData>;
  return apiResponse;
};
