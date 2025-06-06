import { axiosAuth } from "@/api";
import { UserForm } from "@/models";
import { userUpdate, ApiResponse, GetData, UserData } from "@/payloads";

export const getUsers = async (
  currentPage: number,
  rowsPerPage: number,
  brandId: string | null,
  searchValue?: string,
): Promise<GetData<UserData>> => {
  const res = await axiosAuth.get("app-users", {
    params: {
      brandId: brandId || null,
      pageNumber: currentPage,
      pageSize: rowsPerPage,
      searchKey: searchValue,
    },
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse.data as GetData<UserData>;
};

export const createUser = async (user: UserForm, roleId: number): Promise<ApiResponse<Number>> => {
  const res = await axiosAuth.post("app-users", {
    userName: user.userName.value,
    fullname: user.fullName.value,
    phone: user.phoneNumber.value,
    dob: user.DOB.value ? user.DOB.value.toISOString().split("T")[0] : "",
    gender: user.gender.value,
    roleId: roleId,
    isActive: user.isActive.value === 1 ? true : false,
  });
  const apiResponse = res.data as ApiResponse<Number>;
  return apiResponse;
};

export const getUser = async (id: number): Promise<ApiResponse<UserData>> => {
  const res = await axiosAuth.get("app-users/get-by-id", {
    params: {
      id: id,
    },
  });
  const apiResponse = res.data as ApiResponse<UserData>;
  return apiResponse;
};

export const updateUser = async (
  id: number,
  user: userUpdate,
  brandId: string | null,
): Promise<ApiResponse<Object>> => {
  const params: Record<string, any> = { id: id };
  if (brandId !== null) {
    params["brand-id"] = brandId;
  }

  const res = await axiosAuth.put(`app-users`, user, { params: params });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse;
};

export const deleteUser = async (
  id: number,
  brandId: string | null,
): Promise<ApiResponse<Object>> => {
  const params: Record<string, any> = { id: id };

  if (brandId !== null) {
    params["brandId"] = brandId;
  }

  const res = await axiosAuth.delete("app-users", {
    params: params,
  });
  const apiResponse = res.data as ApiResponse<Object>;
  return apiResponse;
};
