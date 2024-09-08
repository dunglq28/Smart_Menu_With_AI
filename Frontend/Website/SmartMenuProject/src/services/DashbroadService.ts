import axiosAuth from "../api/axiosAuth";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";
import { DashboardData } from "../payloads/responses/DashboarData.model";


export const getDashboardAdmin = async (): Promise<ApiResponse<DashboardData>> => {
  const res = await axiosAuth.get("dashboard");
  const apiResponse = res.data as ApiResponse<DashboardData>;
  return apiResponse;
};
