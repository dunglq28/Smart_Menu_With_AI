import axios from "axios";
import axiosAuth from "../api/axiosAuth";
import axiosMultipartForm from "../api/axiosMultipartForm";
import { brandUpdate } from "../payloads/requests/updateRequests.model";
import { ApiResponse, ApiResponseNotPagin } from "../payloads/responses/ApiResponse.model";
import { BrandData, LimitBrandData } from "../payloads/responses/BrandData.model";
import { GetData } from "../payloads/responses/GetData.model";

export const getBrands = async (
  currentPage: number,
  rowsPerPage: number,
): Promise<GetData<BrandData>> => {
  const res = await axiosAuth.get("brands", {
    params: {
      pageNumber: currentPage,
      pageSize: rowsPerPage,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse.data as GetData<BrandData>;
};

export const getAllBrandName = async (): Promise<ApiResponseNotPagin<BrandData>> => {
  const res = await axiosAuth.get("brands/get-all-name");
  const apiResponse = res.data as ApiResponseNotPagin<Object>;
  return apiResponse as ApiResponseNotPagin<BrandData>;
};

export const getBrand = async (id: number): Promise<ApiResponse<BrandData>> => {
  const res = await axiosAuth.get("brands/get-by-id", {
    params: {
      id: id,
    },
  });
  const apiResponse = res.data as ApiResponse<BrandData>;
  return apiResponse;
};

export const getBrandByUserId = async (id: number): Promise<ApiResponse<BrandData>> => {
  const res = await axiosAuth.get(`brands/get-by-user-id`, {
    params: {
      userId: id,
    },
  });
  const apiResponse = res.data as ApiResponse<BrandData>;
  return apiResponse;
};

export const getBrandByBrandName = async (brandName: string): Promise<ApiResponse<BrandData>> => {
  try {
    const res = await axiosAuth.get(`brands/get-by-name`, {
      params: {
        brandName: brandName,
      },
    });
    const apiResponse = res.data as ApiResponse<BrandData>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<BrandData>;
    }
    throw new Error("Unexpected error");
  }
};

export const createBrand = async (brandForm: FormData): Promise<ApiResponse<Object>> => {
  const res = await axiosMultipartForm.post("brands/add", brandForm);
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse;
};

export const updateBrand = async (brand: brandUpdate): Promise<ApiResponse<BrandData>> => {
  try {
    const res = await axiosMultipartForm.put("brands/update", brand);
    const apiResponse = res.data as ApiResponse<BrandData>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<BrandData>;
    }
    throw new Error("Unexpected error");
  }
};

export const deleteBrand = async (id: number): Promise<ApiResponse<Object>> => {
  const res = await axiosAuth.delete("brands/delete", {
    params: {
      id: id,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse;
};

export const getLimitBrandByUserId = async (id: string): Promise<ApiResponse<LimitBrandData>> => {
  const res = await axiosAuth.get(`brands/checklimit/${id}`);
  const apiResponse = res.data as ApiResponse<LimitBrandData>;
  return apiResponse;
};
