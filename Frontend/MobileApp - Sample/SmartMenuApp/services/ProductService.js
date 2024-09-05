import axiosAuth from "../api/axiosAuth";

export const getProductsByCategory = async (brandId, categoryId) => {
  const res = await axiosAuth.get("products/get-by-category", {
    params: {
      brandId: brandId,
      categoryId: categoryId,
    },
  });
  const apiResponse = res.data;
  return apiResponse.data;
};
