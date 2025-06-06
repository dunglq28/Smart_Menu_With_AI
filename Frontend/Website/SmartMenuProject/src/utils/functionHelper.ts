import moment from "moment";
import { UserRole } from "@/constants/Enum";

export const getOptions = (total: number): number[] => {
  if (total > 50) return [5, 10, 20, 50, 100];
  if (total > 20) return [5, 10, 20, 50];
  if (total > 10) return [5, 10, 20];
  if (total > 5) return [5, 10];
  return [5];
};

export const getBrandOptions = (total: number): number[] => {
  if (total > 50) return [6, 10, 20, 50, 100];
  if (total > 20) return [6, 10, 20, 50];
  if (total > 10) return [6, 10, 20];
  if (total > 6) return [6, 10];
  return [6];
};

export const formatCurrencyMenu = (amount: string): string => {
  const number = parseFloat(amount.replace(/,/g, ""));
  if (isNaN(number)) {
    return amount;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(number)
    .replace("₫", "")
    .replace(".000", "");
};

export const formatCurrencyVND = (amount: string): string => {
  const number = parseFloat(amount.replace(/,/g, ""));
  if (isNaN(number)) {
    return amount;
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(number)
    .replace("₫", "VND")
    .trim();
};

export const formatCurrency = (amount: string): string => {
  const number = parseFloat(amount.replace(/,/g, ""));
  if (isNaN(number)) {
    return amount;
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(number)
    .trim();
};

export const formatDate = (date: Date): string => {
  return moment(date).format("DD/MM/YYYY");
};

export const formatDateAndTime = (date: Date): string => {
  return moment(date).format("DD/MM/YYYY HH:mm:ss");
};

export const getRoleName = (roleId: number): string => {
  if (roleId === UserRole.Admin) {
    return "Quản trị viên";
  } else if (roleId === UserRole.BrandManager) {
    return "Quản lý thương hiệu";
  } else if (roleId === UserRole.BranchManager) {
    return "Quản lý chi nhánh";
  }
  return UserRole[roleId] ? `Vai trò: ${UserRole[roleId]}` : "Vai trò không xác định";
};

export const getGender = (gender: string): string => {
  if (gender === "Male") {
    return "Nam";
  } else if (gender === "Female") {
    return "Nữ";
  }
  return gender;
};

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const translateDemographics = (demographics: string): string => {
  const [gender, time] = demographics.split(", ") as [string, string];

  const genderMap: { [key: string]: string } = {
    Male: "Nam",
    Female: "Nữ",
  };

  const timeMap: { [key: string]: string } = {
    Morning: "Buổi Sáng",
    Afternoon: "Buổi Trưa",
    Evening: "Buổi Chiều",
  };

  return `${genderMap[gender] || "Không xác định"}, ${timeMap[time] || "Không xác định"}`;
};

export const addOneMonthToDate = (date: Date): string => {
  const currentDate = new Date(date);
  currentDate.setMonth(currentDate.getMonth() + 1);
  return currentDate.toLocaleDateString("vi-VN");
};
