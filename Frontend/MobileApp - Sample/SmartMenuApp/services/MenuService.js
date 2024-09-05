import axiosMultipartForm from "../api/axiosMultipartForm";

export const recommendMenu = async (form) => {
  try {
    const response = await axiosMultipartForm.post("menus/recomend-menu", form);
    return response.data;
  } catch (error) {
    throw error;
  }
};
