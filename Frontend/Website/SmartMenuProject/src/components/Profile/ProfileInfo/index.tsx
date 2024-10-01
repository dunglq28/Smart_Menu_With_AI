import { Button, Divider, Flex, Image, Input, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import style from "./ProfileInfo.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";
import { UserData } from "../../../payloads/responses/UserData.model";
import { useEffect, useState } from "react";
import { UserForm } from "../../../models/UserForm.model";
import { getInitialBrandForm, getInitialUserForm } from "../../../utils/initialData";
import { formatDate, getGender } from "../../../utils/functionHelper";
import { UserRole } from "../../../constants/Enum";
import { isImageFile, validateBrandForm, validateUserForm } from "../../../utils/validation";
import { brandUpdate, userUpdate } from "../../../payloads/requests/updateRequests.model";
import { updateUser } from "../../../services/UserService";
import { toast } from "react-toastify";
import { BrandForm } from "../../../models/BrandForm.model";
import { updateBrand } from "../../../services/BrandService";
import { BrandData } from "../../../payloads/responses/BrandData.model";

interface ProfileInfoProps {
  userData: UserData | null;
  brandData: BrandData | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userData, brandData }) => {
  const { t } = useTranslation("profile");
  const [userForm, setUserForm] = useState<UserForm>(getInitialUserForm());
  const [brandForm, setBrandForm] = useState<BrandForm>(getInitialBrandForm());
  const [isChanged, setIsChanged] = useState(false);
  const [isUserChanged, setIsUserChanged] = useState(false);
  const [isBrandChanged, setIsBrandChanged] = useState(false);

  const updateUserFormFromData = (userData: UserData) => {
    const { fullname, userName, phone, dob, gender, isActive } = userData;
    const updatedUserForm: UserForm = {
      fullName: { value: fullname, errorMessage: "" },
      userName: { value: userName, errorMessage: "" },
      phoneNumber: { value: phone, errorMessage: "" },
      DOB: { value: new Date(dob), errorMessage: "" },
      gender: { value: getGender(gender), errorMessage: "" },
      isActive: { value: isActive ? 1 : 0, errorMessage: "" },
    };
    setUserForm(updatedUserForm);
  };

  const updateBrandFormFromData = (brandData: BrandData) => {
    const { brandName, imageUrl } = brandData;
    const updatedBrandForm: BrandForm = {
      brandName: { value: brandName, errorMessage: "" },
      image: { value: null, errorMessage: "" },
      imageUrl: { value: imageUrl, errorMessage: "" },
    };
    setBrandForm(updatedBrandForm);
  };

  useEffect(() => {
    if (userData) {
      updateUserFormFromData(userData);
    }
    if (brandData) {
      updateBrandFormFromData(brandData);
    }
  }, [userData, brandData]);

  // Helper to render input fields
  const renderInputField = (
    isFullW: boolean,
    label: string,
    value: string,
    errorMessage: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type = "text",
    isReadOnly = false,
  ) => (
    <Flex flexDirection="column" width={isFullW ? "100%" : "48%"}>
      <Text className={style.text_title_content}>{label}</Text>
      <Input
        focusBorderColor={themeColors.primaryButton}
        value={value}
        onChange={onChange}
        type={type}
        readOnly={isReadOnly}
      />
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
    </Flex>
  );

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrandName = e.target.value;
    const currentBrandName = brandForm.brandName.value;

    if (currentBrandName !== newBrandName) {
      setBrandForm((prev) => ({
        ...prev,
        brandName: { value: newBrandName, errorMessage: "" },
      }));
      setIsChanged(true);
      setIsBrandChanged(true);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImage = isImageFile(file);
      if (!isImage) {
        setBrandForm((prev) => ({
          ...prev,
          image: { value: null, errorMessage: "Tệp phải là hình ảnh" },
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandForm((prev) => ({
          ...prev,
          image: { value: file, errorMessage: "" },
          imageUrl: { value: reader.result as string, errorMessage: "" },
        }));
      };
      reader.readAsDataURL(file);
      setIsChanged(true);
      setIsBrandChanged(true);
    }
  };

  const handleRemoveImage = () => {
    setBrandForm((prev) => ({
      ...prev,
      image: { value: null, errorMessage: "" },
      imageUrl: { value: "", errorMessage: "" },
    }));
  };

  const handleInputChange = (field: keyof UserForm, value: string | Date) => {
    const currentValue = userForm[field].value;
    if (currentValue !== value) {
      setUserForm((prev) => ({
        ...prev,
        [field]: { ...prev[field], value },
      }));
      setIsChanged(true);
      setIsUserChanged(true);
    }
  };

  const handleDateChange = (field: keyof UserForm, value: string) => {
    if (!isNaN(Date.parse(value))) {
      setUserForm((prevData) => ({
        ...prevData,
        [field]: { value: new Date(value), errorMessage: "" },
      }));
    }
  };

  const handleUpdate = async () => {
    const userErrors = validateUserForm(userForm);
    const updatedUserForm = {
      fullName: { ...userForm.fullName, errorMessage: userErrors.fullName },
      userName: { ...userForm.userName, errorMessage: "" },
      phoneNumber: {
        ...userForm.phoneNumber,
        errorMessage: userErrors.phoneNumber,
      },
      DOB: { ...userForm.DOB, errorMessage: userErrors.DOB },
      gender: { ...userForm.gender, errorMessage: "" },
      isActive: { ...userForm.isActive, errorMessage: "" },
    };

    setUserForm(updatedUserForm);
    const hasUserError = Object.values(userErrors).some((error) => error !== "");

    const brandErrors = validateBrandForm(brandForm);
    const updatedBrandForm = {
      brandName: {
        ...brandForm.brandName,
        errorMessage: brandErrors.brandName,
      },
      image: { ...brandForm.image, errorMessage: brandErrors.image },
      imageUrl: { ...brandForm.imageUrl!, errorMessage: "" },
    };

    setBrandForm(updatedBrandForm);
    const hasBrandError = Object.values(brandErrors).some((error) => error !== "");

    const hasError = hasUserError || hasBrandError;
    if (!hasError) {
      let userResult, brandResult;
      if (isUserChanged) {
        const userUpdate: userUpdate = {
          fullname: userForm.fullName.value,
          dob: userForm.DOB.value ? userForm.DOB.value.toISOString().split("T")[0] : "",
          gender: userForm.gender.value,
          phone: userForm.phoneNumber.value,
          isActive: Number(userForm.isActive.value) === 1,
          updateBy: Number(localStorage.getItem("UserId")),
        };
        userResult = await updateUser(userData?.userId!, null, userUpdate);
      }

      if (isBrandChanged) {
        const brandUpdate: brandUpdate = {
          id: Number(localStorage.getItem("BrandId")),
          brandName: brandForm.brandName.value,
          image: brandForm.image.value,
        };
        brandResult = await updateBrand(brandUpdate);
      }

      try {
        if (userResult?.statusCode === 200 || brandResult?.statusCode === 200) {
          if (brandResult?.statusCode === 200) {
            localStorage.setItem("BrandName", brandResult.data.brandName);
            localStorage.setItem("BrandLogo", brandResult.data.imageUrl);
          }
          window.location.reload();
        } else {
          toast.error("Cập nhật thất bại");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra trong quá trình cập nhật");
      }
    }
  };

  const handleReset = () => {
    if (userData && brandData) {
      updateUserFormFromData(userData);
      updateBrandFormFromData(brandData);
      setIsChanged(false);
    }
  };

  return (
    <Flex className={style.tab_panels_container}>
      <Text className={style.tab_panels_container_title}>{t("profile information title")}</Text>
      <Divider marginY="1rem" />
      <Flex className={style.tab_panels_container_content}>
        <Flex flexDirection="column" width="48%" alignItems="center" justifyContent="center">
          {brandForm.imageUrl!.value && (
            <Image
              src={brandForm.imageUrl!.value}
              alt="Brand Logo"
              className={style.brand_logo}
              boxSize="100px"
              marginLeft="10px"
              marginBottom="6px"
            />
          )}
          {!brandForm.imageUrl!.value ? (
            <Input type="file" border="none" onChange={(e) => handleLogoChange(e)} />
          ) : (
            <Button onClick={handleRemoveImage} ml={3}>
              Xoá
            </Button>
          )}
          {brandForm.image.errorMessage && (
            <Text color="red.500">{brandForm.image.errorMessage}</Text>
          )}
        </Flex>
        <Flex flexDirection="column" width="48%">
          <Flex mb="10px">
            {renderInputField(
              true,
              t("fullname"),
              userForm.fullName.value,
              userForm.fullName.errorMessage,
              (e) => handleInputChange("fullName", e.target.value),
            )}
          </Flex>
          <Flex mb="10px">
            {renderInputField(
              true,
              t("Tên tài khoản"),
              userForm.userName.value,
              "",
              () => {},
              "text",
              true,
            )}
          </Flex>
        </Flex>
      </Flex>

      <Flex className={style.tab_panels_container_content}>
        {renderInputField(
          false,
          t("Tên thương hiệu"),
          brandForm.brandName.value!,
          brandForm.brandName.errorMessage,
          handleBrandNameChange,
        )}
        <Flex flexDirection="column" width="48%">
          <Text className={style.text_title_content}>{t("Giới tính")}</Text>
          <RadioGroup
            value={userForm.gender.value}
            paddingTop="8px"
            onChange={(value) => handleInputChange("gender", value)}
          >
            <Flex direction="row" columnGap="1rem">
              <Radio value="Nam">{t("Nam")}</Radio>
              <Radio value="Nữ">{t("Nữ")}</Radio>
            </Flex>
          </RadioGroup>
        </Flex>
      </Flex>

      <Flex className={style.tab_panels_container_content}>
        {renderInputField(
          false,
          t("Số điện thoại"),
          userForm.phoneNumber.value,
          userForm.phoneNumber.errorMessage,
          (e) => handleInputChange("phoneNumber", e.target.value),
        )}
        {renderInputField(
          false,
          t("birthday"),
          userForm.DOB.value ? userForm.DOB.value.toISOString().split("T")[0] : "",
          userForm.DOB.errorMessage,
          (e) => handleDateChange("DOB", e.target.value),
          "date",
          false,
        )}
      </Flex>

      <Flex className={style.tab_panels_container_content}>
        {renderInputField(
          false,
          t("Ngày tạo"),
          userData?.createDate ? formatDate(userData.createDate) : "",
          "",
          () => {},
          "text",
          true,
        )}
        {renderInputField(
          false,
          t("Vai trò"),
          userData?.roleId === UserRole.BrandManager ? "Quản lý thương hiệu" : "N/A",
          "",
          () => {},
          "text",
          true,
        )}
      </Flex>

      <Flex columnGap="5px" className={style.btn_container}>
        <Button isDisabled={!isChanged} className={style.btn_content} onClick={handleUpdate}>
          {t("update profile")}
        </Button>
        <Button isDisabled={!isChanged} onClick={handleReset}>
          {t("reset changes")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProfileInfo;
