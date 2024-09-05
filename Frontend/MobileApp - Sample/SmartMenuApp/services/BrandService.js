import axiosAuth from "../api/axiosAuth";

export const getBrandByUserId = async (id) => {
  const res = await axiosAuth.get(`brands/get-by-user-id`, {
    params: {
      userId: id,
    },
  });
  const apiResponse = res.data;
  return apiResponse;
};
