import axiosAuth from "../api/axiosAuth";

export const getBrandOfStoreByUserId = async (id) => {
  const res = await axiosAuth.get(`stores/get-brand-of-store-by-user-id`, {
    params: {
      userId: id,
    },
  });
  const apiResponse = res.data;
  return apiResponse;
};
