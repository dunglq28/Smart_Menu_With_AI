import { BranchForm } from "../models/BranchForm.model";
import { BrandForm } from "../models/BrandForm.model";
import { Menu } from "../models/Menu.model";
import { PasswordForm } from "../models/Password.model";
import { ProductForm } from "../models/ProductForm.model";
import { CustomerSegmentForm } from "../models/SegmentForm.model";
import { UserForm } from "../models/UserForm.model";

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

export const validateFullName = (value: string) => {
  if (!value.trim()) return "Họ và tên là bắt buộc";
  if (value.trim().length < 6) return "Họ và tên phải có ít nhất 6 ký tự";
  return "";
};

export const validatePhoneNumber = (value: string) => {
  if (!value.trim()) return "Số điện thoại là bắt buộc";
  if (!isValidPhoneNumber(value.trim())) return "Số điện thoại không hợp lệ";
  return "";
};

export const validateDOB = (value: any) => {
  return !value ? "Ngày sinh là bắt buộc" : "";
};

export const validateBrandName = (brandName: string) => {
  return brandName.length < 1 ? "Tên thương hiệu là bắt buộc" : "";
};

export const validateBrandImage = (image: any, imageUrl: any) => {
  return !image && !imageUrl ? "Logo là bắt buộc" : "";
};

export const validateEmail = (email: string) => {
  if (email.trim() === "") {
    return "Email là bắt buộc";
  } else if (!isValidEmail(email.trim())) {
    return "Email không hợp lệ";
  }
  return ""; // Trả về rỗng nếu không có lỗi
};

export const validateVerificationCode = (
  code: string,
  expectedCode: string,
) => {
  if (code.trim() === "") {
    return "Mã xác nhận là bắt buộc";
  } else if (code.trim() !== expectedCode) {
    return "Mã xác nhận không chính xác";
  }
  return ""; // Trả về rỗng nếu không có lỗi
};

export const validateCity = (city: string) => {
  return !city ? "Thành phố là bắt buộc" : "";
};

export const validateDistrict = (district: string) => {
  return !district ? "Quận là bắt buộc" : "";
};

export const validateWard = (ward: string) => {
  return !ward ? "Phường là bắt buộc" : "";
};

export const validateAddress = (address: string) => {
  return !address ? "Địa chỉ là bắt buộc" : "";
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // check độ dài 10, bắt đầu bằng 09, 08, 07, 05, 03
  const phoneRegex = /^(0?)(3[2-9]|5[2689]|7[0-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
  return phoneRegex.test(phoneNumber);
};

export const isInteger = (value: string) => {
  return /^\d+$/.test(value);
};

export const validateUserForm = (formData: UserForm) => {
  const errors = {
    fullName: validateFullName(formData.fullName.value),
    phoneNumber: validatePhoneNumber(formData.phoneNumber.value),
    DOB: validateDOB(formData.DOB.value),
  };
  return errors;
};

export const validateBrandForm = (formData: BrandForm) => {
  const errors = {
    brandName: validateBrandName(formData.brandName.value),
    image: validateBrandImage(formData.image.value, formData.imageUrl?.value),
  };
  return errors;
};

export const validateBranchForm = (formData: BranchForm) => {
  const errors = {
    brandName: validateBrandName(formData.brandName.value),
    city: validateCity(formData.city.name),
    ward: validateWard(formData.ward.name),
    district: validateDistrict(formData.district.name),
    address: validateAddress(formData.address.value),
  };
  return errors;
};

export const validateProductForm = (formData: ProductForm) => {
  const errors = {
    category: formData.category.value ? "" : "Danh mục là bắt buộc",
    productName: formData.productName.value ? "" : "Tên sản phẩm là bắt buộc",
    image: "",
    description: formData.description.value
      ? formData.description.value.length < 5 ||
        formData.description.value.length > 300
        ? "Mô tả phải từ 5 đến 300 ký tự"
        : ""
      : "Mô tả là bắt buộc",
    price: formData.price.value
      ? isNaN(Number(formData.price.value)) ||
        Number(formData.price.value) <= 1000
        ? "Giá phải là một số lớn hơn 1000 có định dạng: 1000000"
        : ""
      : "Giá là bắt buộc",
  };

  if (
    !formData.image.value &&
    !formData.imageUrl?.value &&
    !formData.image.errorMessage
  ) {
    errors.image = "Hình ảnh là bắt buộc";
  }

  return errors;
};

export const validateCustomerSegmentForm = (formData: CustomerSegmentForm) => {
  const errors = {
    segmentName: formData.segmentName.value ? "" : "Tên phân khúc là bắt buộc",
    sessions: formData.sessions.value.length ? "" : "Thời gian là bắt buộc",
    ageFrom: "",
    ageTo: "",
  };

  if (formData.segmentName.value && formData.segmentName.value.length < 5) {
    errors.segmentName = "Tên phân khúc phải có ít nhất 5 ký tự";
  }

  if (!formData.ageFrom.value) {
    errors.ageFrom = "Tuổi bắt đầu là bắt buộc";
  } else if (
    isNaN(Number(formData.ageFrom.value)) ||
    Number(formData.ageFrom.value) <= 0
  ) {
    errors.ageFrom = "Tuổi bắt đầu phải là một số lớn hơn 0";
  } else if (
    !isInteger(formData.ageFrom.value) ||
    Number(formData.ageFrom.value) <= 0
  ) {
    errors.ageFrom = "Tuổi bắt đầu phải là một số nguyên dương";
  }

  if (!formData.ageTo.value) {
    errors.ageTo = "Tuổi kết thúc là bắt buộc";
  } else if (
    isNaN(Number(formData.ageTo.value)) ||
    Number(formData.ageTo.value) <= 0
  ) {
    errors.ageTo = "Tuổi kết thúc phải là một số lớn hơn 0";
  } else if (
    !isInteger(formData.ageTo.value) ||
    Number(formData.ageTo.value) <= 0
  ) {
    errors.ageTo = "Tuổi kết thúc phải là một số nguyên dương";
  } else if (Number(formData.ageTo.value) <= Number(formData.ageFrom.value)) {
    errors.ageTo = "Tuổi kết thúc phải lớn hơn tuổi bắt đầu";
  }

  return errors;
};

export const validateMenu = (menu: Menu) => {
  const errors = {
    description: menu.description.value !== "" ? "" : "Mô tả là bắt buộc",
    segmentId:
      menu.segmentId.value.length > 0 ? "" : "Phân khúc khách hàng là bắt buộc",
    priority: menu.priority.value !== 0 ? "" : "Độ ưu tiên là bắt buộc",
  };

  return errors;
};

export const validatePassword = (passwordForm: PasswordForm) => {
  const errors = {
    oldPassword:
      passwordForm.oldPassword.value !== "" ? "" : "Mật khẩu cũ là bắt buộc",
    newPassword:
      passwordForm.newPassword.value.length >= 6
        ? ""
        : "Mật khẩu mới phải có ít nhất 6 ký tự",
    confirm:
      passwordForm.confirm.value === passwordForm.newPassword.value
        ? ""
        : "Xác nhận mật khẩu không khớp",
  };

  return errors;
};
