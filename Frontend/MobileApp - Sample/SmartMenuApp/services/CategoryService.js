import axiosAuth from "../api/axiosAuth";

export const getCategoriesByBrandId = async (Id) => {
  const res = await axiosAuth.get("categories/get-by-brand-id", {
    params: {
      brandId: Id,
    },
  });
  const apiResponse = res.data;
  return apiResponse.data;
};
