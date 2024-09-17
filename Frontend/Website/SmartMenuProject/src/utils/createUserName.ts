import { BranchForm } from "../models/BranchForm.model";

export const generateUsernameFromBrand = (brandName: string): string => {
  // Xóa dấu tiếng Việt và định dạng tên thương hiệu
  const sanitizedBrandName = removeVietnameseTones(brandName)
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, "")
    .trim();

  // Lấy ngày tháng năm hiện tại (định dạng ddMMyyyy)
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, cần +1
  const year = currentDate.getFullYear();
  const formattedDate = `${day}${month}${year}`;

  // Nối tên thương hiệu và ngày tháng năm hiện tại
  const username = `${sanitizedBrandName}${formattedDate}SmartMenu`;

  // Giới hạn chiều dài username tối đa là 30 ký tự
  const maxLength = 30;
  if (username.length > maxLength) {
    return username.substring(0, maxLength);
  }

  return username;
};

const removeVietnameseTones = (str: string): string => {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  return str;
};

export const generateUsernameFromBranch = (branch: BranchForm): string => {
  const removeSpecialChars = (str: string): string => {
    return str.replace(/[^a-zA-Z0-9]/g, "");
  };

  const branchInitials = branch.brandName.value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toLowerCase();
  const cityInitials = branch.city.name[0].toLowerCase();
  const districtInitials = branch.district.name[0].toLowerCase();
  const addressInitials = removeSpecialChars(
    branch.address.value.split(" ")[0].toLowerCase(),
  );

  // Lấy ngày, tháng, năm hiện tại
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0"); // Ngày 2 chữ số
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Tháng 2 chữ số
  const year = currentDate.getFullYear(); // Năm 4 chữ số

  // Tạo username với ngày, tháng, năm trước và "SmartMenu" ở cuối
  return `${branchInitials}${cityInitials}${districtInitials}${addressInitials}${day}${month}${year}SmartMenu`;
};
