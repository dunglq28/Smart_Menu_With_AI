import axios from "axios";
import axiosMultipartForm from "../api/axiosMultipartForm";
import { ApiResponse } from "../payloads/responses/ApiResponse.model";
import axiosAuth from "../api/axiosAuth";
import { listAddToMenu } from "../payloads/requests/createRequests.model";
import {
  ListData,
  ListProductDetails,
  MenuData,
} from "../payloads/responses/MenuData.model";
import { GetData } from "../payloads/responses/GetData.model";
import { MenuList } from "../models/Menu.model";

// Luồng tạo menu
//================================================================//
export const createMenu = async (
  menuForm: FormData
): Promise<ApiResponse<MenuData>> => {
  try {
    const res = await axiosMultipartForm.post("menus", menuForm);
    const apiResponse = res.data as ApiResponse<MenuData>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<MenuData>;
    }
    throw new Error("Unexpected error");
  }
};

export const createListPosition = async (
  menuList: MenuList[],
  brandId: number
): Promise<ApiResponse<ListData[]>> => {
  try {
    const listDetails = menuList.map((list) => ({
      "list-name": list.listName,
      "total-product": list.maxProduct,
    }));

    const res = await axiosAuth.post("list-positions/add-list-list", {
      brandId: brandId,
      listDetails: listDetails,
    });
    const apiResponse = res.data as ApiResponse<ListData[]>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<ListData[]>;
    }
    throw new Error("Unexpected error");
  }
};

export const createMenuList = async (
  menuId: number,
  brandId: number,
  listAddToMenu: listAddToMenu[]
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosAuth.post("menu-list", {
      menuId: menuId,
      brandId: brandId,
      listAddToMenu: listAddToMenu,
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

export const createProductList = async (
  brandId: number,
  listProductDetails: ListProductDetails[]
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosAuth.post("product-lists/add-list-product", {
      brandId: brandId,
      listProductDetails: listProductDetails,
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
//================================================================//
export const getAllMenu = async (
  brandId: number,
  currentPage: number,
  rowsPerPage: number
): Promise<GetData<MenuData>> => {
  const res = await axiosAuth.get("menus", {
    params: {
      brandId: brandId,
      pageNumber: currentPage,
      pageSize: rowsPerPage,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse.data as GetData<MenuData>;
};

export const getMenu = async (
  menuId: number
): Promise<ApiResponse<MenuData>> => {
  const res = await axiosAuth.get("menus/get-by-id", {
    params: {
      id: menuId,
    },
  });
  const apiResponse = res.data as ApiResponse<MenuData>;
  return apiResponse;
};

export const getMenuSegment = async (
  menuId: number
): Promise<ApiResponse<MenuData>> => {
  const res = await axiosAuth.get("menu-segments/get-by-id", {
    params: {
      id: menuId,
    },
  });
  const apiResponse = res.data as ApiResponse<MenuData>;
  return apiResponse;
};
//================================================================//
export const updateMenu = async (
  menu: FormData
): Promise<ApiResponse<MenuData>> => {
  try {
    const res = await axiosMultipartForm.put("menus", menu);
    const apiResponse = res.data as ApiResponse<MenuData>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<MenuData>;
    }
    throw new Error("Unexpected error");
  }
};

export const updateListPosition = async (
  menuList: MenuList[],
  brandId: number
): Promise<ApiResponse<ListData[]>> => {
  try {
    const listDetails = menuList.map((list) => ({
      "list-id": list.listId,
      "list-name": list.listName,
      "total-product": list.maxProduct,
    }));

    const res = await axiosAuth.put("list-positions/update-list-list", {
      brandId: brandId,
      listDetails: listDetails,
    });
    const apiResponse = res.data as ApiResponse<ListData[]>;
    return apiResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<ListData[]>;
    }
    throw new Error("Unexpected error");
  }
};

export const updateProductList = async (
  brandId: number,
  listProductDetails: ListProductDetails[]
): Promise<ApiResponse<Object>> => {
  try {
    const res = await axiosAuth.put("product-lists/update-list-product", {
      brandId: brandId,
      listProductDetails: listProductDetails,
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
//================================================================//
export const deleteMenu = async (
  menuId: Number
): Promise<ApiResponse<Object>> => {
  const res = await axiosAuth.delete("menus", {
    params: {
      id: menuId,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse;
};
