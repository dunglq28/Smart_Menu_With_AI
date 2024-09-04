export const isImageFile = (file: File): boolean => {
  const fileType = file.type.split("/")[0];
  return fileType === "image";
};

export const isValidImageFileName = (fileName: string): boolean => {
  if (!fileName) return false;

  const namePart = fileName.split(".").slice(0, -1).join(".");
  if (!namePart) return false;

  const extension = fileName.split(".").pop()?.toLowerCase();
  const validExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

  return validExtensions.includes(extension || "");
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // check độ dài 10, bắt đầu bằng 09, 08, 07, 05, 03
  const phoneRegex = /^(0?)(3[2-9]|5[2689]|7[0-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
  return phoneRegex.test(phoneNumber);
};

export const isInteger = (value: string) => {
  return /^\d+$/.test(value);
};

