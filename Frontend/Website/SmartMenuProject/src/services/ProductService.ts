import axiosAuth from "../api/axiosAuth";
import axiosMultipartForm from "../api/axiosMultipartForm";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";
import { GetData } from "../payloads/responses/GetData.model";
import { ProductData } from "../payloads/responses/ProductData.model";
import axios from "axios";

export const getProducts = async (
  brandId: number,
  currentPage: number,
  rowsPerPage: number,
  searchValue: string
): Promise<GetData<ProductData>> => {
  const res = await axiosAuth.get("products", {
    params: {
      brandId: brandId,
      pageNumber: currentPage,
      pageSize: rowsPerPage,
      searchKey: searchValue,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse.data as GetData<ProductData>;
};

export const getProductsByCategory = async (
  brandId: number,
  categoryId: number
): Promise<GetData<ProductData>> => {
  const res = await axiosAuth.get("products/get-by-category", {
    params: {
      brandId: brandId,
      categoryId: categoryId,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse.data as GetData<ProductData>;
};

export const getProduct = async (
  id: number
): Promise<ApiResponse<ProductData>> => {
  const res = await axiosAuth.get("products/get-by-id", {
    params: {
      id: id,
    },
  });
  const apiResponse = res.data as ApiResponse<ProductData>;
  return apiResponse;
};

export const createProduct = async (
  productForm: FormData
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosMultipartForm.post("products", productForm);
    const apiResponse = res.data as ApiResponse<Object>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<Object>;
    }
    throw new Error("Unexpected error");
  }
};

export const updateProduct = async (
  id: number,
  product: FormData
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosMultipartForm.put(
      `products?product-id=${id}`,
      product
    );
    const apiResponse = res.data as ApiResponse<Object>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<Object>;
    }
    throw new Error("Unexpected error");
  }
};

export const deleteProduct = async (
  id: number
): Promise<ApiResponse<Object>> => {
  const res = await axiosAuth.delete("products", {
    params: {
      id: id,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse;
};
