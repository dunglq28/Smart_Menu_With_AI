import React, { useState } from "react";
import {
  ModalBody,
  Flex,
  Box,
  Select,
  Input,
  Text,
  RadioGroup,
  Stack,
  Radio,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import styles from "./ModalFormUser.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";
import { CurrentForm } from "../../../constants/Enum";
import { BrandForm } from "../../../models/BrandForm.model";
import { UserForm } from "../../../models/UserForm.model";
import {
  validateUserForm,
} from "../../../utils/validation";
import {
  generateUsernameFromBranch,
  generateUsernameFromBrand,
} from "../../../utils/createUserName";
import { BranchForm } from "../../../models/BranchForm.model";
import {
  getInitialBranchForm,
  getInitialBrandForm,
  getInitialUserForm,
} from "../../../utils/initialData";

interface ModalFormBrandProps {
  isEdit: boolean;
  onClose: () => void;
  formPrevious?: CurrentForm;
  onOpenBranch?: () => void;
  onOpenBrand?: () => void;
  updateBrandData?: (data: BrandForm) => void;
  updateBranchData?: (data: BranchForm) => void;
  updateUserData: (data: UserForm, isSave: boolean) => void;
  saveBrandHandle?: (data: UserForm) => void;
  saveBranchHandle?: (data: UserForm) => void;
  brandName?: string;
  userData: UserForm;
  branch?: BranchForm;
}

const ModalFormUser: React.FC<ModalFormBrandProps> = ({
  isEdit,
  onClose,
  formPrevious,
  onOpenBranch,
  onOpenBrand,
  updateBrandData,
  updateBranchData,
  updateUserData,
  saveBrandHandle,
  saveBranchHandle,
  brandName,
  userData,
  branch,
}) => {
  var initialUserNameValue = "";
  if (formPrevious === CurrentForm.BRAND) {
    initialUserNameValue = brandName
      ? generateUsernameFromBrand(brandName)
      : userData.userName.value;
  } else if (formPrevious === CurrentForm.BRANCH) {
    initialUserNameValue = branch
      ? generateUsernameFromBranch(branch)
      : userData.userName.value;
  }

  const [formData, setFormData] = useState<UserForm>({
    fullName: { value: userData.fullName.value, errorMessage: "" },
    userName: {
      value: initialUserNameValue
        ? initialUserNameValue
        : userData.userName.value,
      errorMessage: "",
    },
    phoneNumber: { value: userData.phoneNumber.value, errorMessage: "" },
    DOB: { value: userData.DOB.value, errorMessage: "" },
    gender: { value: userData.gender.value || "Nam", errorMessage: "" },
    isActive: { value: userData.isActive.value || 0, errorMessage: "" },
  });

  const handleInputChange = (field: keyof UserForm, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: { value, errorMessage: "" },
    }));
  };

  const handleDateChange = (field: keyof UserForm, value: string) => {
    if (!isNaN(Date.parse(value))) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: { value: new Date(value), errorMessage: "" },
      }));
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: { value, errorMessage: "" },
    }));
  };

  const handleIsActiveChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      isActive: { value: Number(value), errorMessage: "" },
    }));
  };

  const cancelHandler = () => {
    if (formPrevious === CurrentForm.BRAND) {
      updateBrandData?.(getInitialBrandForm());
    } else if (formPrevious === CurrentForm.BRANCH) {
      updateBranchData?.(getInitialBranchForm());
    }
    updateUserData?.(getInitialUserForm(), false);
    onClose();
  };

  const openFormPreviousHandler = () => {
    onClose();
    setTimeout(() => {
      if (formPrevious === CurrentForm.BRAND) {
        onOpenBrand?.();
      } else {
        onOpenBranch?.();
      }
      updateUserData?.(formData, true);
    }, 350);
  };

  const handleSaveForm = () => {
    const errors = validateUserForm(formData);
    const updatedFormData = {
      fullName: { ...formData.fullName, errorMessage: errors.fullName },
      userName: { ...formData.userName, errorMessage: "" }, 
      phoneNumber: { ...formData.phoneNumber, errorMessage: errors.phoneNumber },
      DOB: { ...formData.DOB, errorMessage: errors.DOB },
      gender: { ...formData.gender, errorMessage: "" },
      isActive: { ...formData.isActive, errorMessage: "" },
    };

    setFormData(updatedFormData);
    const hasError = Object.values(errors).some((error) => error !== "");

    if (!hasError) {
      if (isEdit) {
        updateUserData(formData, true);
      } else {
        if (formPrevious === CurrentForm.BRAND) {
          cancelHandler();
          saveBrandHandle?.(formData);
        } else if (formPrevious === CurrentForm.BRANCH) {
          cancelHandler();
          saveBranchHandle?.(formData);
        }
      }
    }
  };

  return (
    <>
      <ModalBody>
        <Flex
          direction="column"
          alignItems="stretch"
          className={styles.containerForm}
        >
          <Flex justify="space-between" mb={3}>
            <Box flex="1" ml={2}>
              <Text className={styles.textFontWeight600} py={3} pr={3}>
                Họ và tên
              </Text>
              <Input
                placeholder="Họ và tên"
                pl={3}
                value={formData.fullName.value}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
              {formData.fullName.errorMessage && (
                <Text color="red.500">{formData.fullName.errorMessage}</Text>
              )}
            </Box>
          </Flex>

          <Flex justify="space-between" mb={3}>
            <Box flex="1" ml={2}>
              <Text className={styles.textFontWeight600} py={3} pr={3}>
                Tên tài khoản
              </Text>
              <Input
                readOnly
                placeholder="Tên tài khoản"
                pl={3}
                value={formData.userName.value}
              />
            </Box>
          </Flex>

          <Flex justify="space-between" mb={3} ml={2}>
            <Box flex="1">
              <Text className={styles.textFontWeight600} py={3} pr={3}>
                Số điện thoại
              </Text>
              <Input
                placeholder="Số điện thoại"
                pl={3}
                value={formData.phoneNumber.value}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
              {formData.phoneNumber.errorMessage && (
                <Text color="red.500">{formData.phoneNumber.errorMessage}</Text>
              )}
            </Box>

            <Box flex="1" ml={3}>
              <Text className={styles.textFontWeight600} py={3} pr={3}>
                Ngày sinh
              </Text>
              <Input
                type="date"
                pl={3}
                value={
                  formData.DOB.value
                    ? formData.DOB.value.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => handleDateChange("DOB", e.target.value)}
              />
              {formData.DOB.errorMessage && (
                <Text color="red.500">{formData.DOB.errorMessage}</Text>
              )}
            </Box>
          </Flex>

          <Flex justify="space-between" mb={3}>
            <Box flex="1" ml={3}>
              <Text className={styles.textFontWeight600} py={3} pr={3} mb={2}>
                Giới tính
              </Text>
              <RadioGroup
                value={formData.gender.value}
                onChange={handleGenderChange}
              >
                <Stack spacing={5} direction="row" ml={3}>
                  <Radio value="Nam">
                    <Text className={styles.textFontWeight600}>Nam</Text>
                  </Radio>
                  <Radio value="Nữ">
                    <Text className={styles.textFontWeight600}>Nữ</Text>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
            <Box flex="1" ml={3}>
              <Text className={styles.textFontWeight600} py={3} pr={3}>
                Đang hoạt động
              </Text>
              <Select
                id="isActive"
                className={styles.isActive}
                value={formData.isActive.value ?? ""}
                onChange={(e) => handleIsActiveChange(e.target.value)}
              >
                <option disabled hidden value="">
                  Select one
                </option>
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </Select>
            </Box>
          </Flex>
        </Flex>
      </ModalBody>
      <ModalFooter justifyContent={isEdit ? "flex-end" : "space-between"}>
        {!isEdit && (
          <Button
            backgroundColor={themeColors.primaryButton}
            color="white"
            onClick={openFormPreviousHandler}
          >
            Quay lại
          </Button>
        )}

        <Flex>
          <Button className={styles.CancelBtn} onClick={cancelHandler}>
            Huỷ
          </Button>
          <Button onClick={handleSaveForm} className={styles.MainBtn}>
            Lưu
          </Button>
        </Flex>
      </ModalFooter>
    </>
  );
};

export default ModalFormUser;
