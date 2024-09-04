import { BranchForm } from "../models/BranchForm.model";

export const generateUsernameFromBrand = (brandName: string): string => {
  const sanitizedBrandName = removeVietnameseTones(brandName)
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, "")
    .trim();

  const username = `${sanitizedBrandName}SmartMenu`;

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
    return str.replace(/[^a-zA-Z0-9]/g, '');
  };

  const branchInitials = branch.brandName.value.split(" ").map(word => word[0]).join("").toLowerCase();
  const cityInitials = branch.city.name.split(" ").map(word => word[0]).join("").toLowerCase();
  const districtInitials = branch.district.name.split(" ").map(word => word[0]).join("").toLowerCase();

  const addressInitials = removeSpecialChars(branch.address.value.split(" ")[0].toLowerCase());

  const descriptor = "SmartMenu";

  return `${branchInitials}${cityInitials}${districtInitials}${addressInitials}${descriptor}`;
};

