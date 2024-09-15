import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Select,
  Text,
  Heading,
  Flex,
  Divider,
  Image,
} from "@chakra-ui/react";
import style from "./PaymentInfor.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";
import { useNavigate } from "react-router-dom";
import { BrandForm } from "../../../models/BrandForm.model";
import {
  isImageFile,
  isValidEmail,
  isValidPhoneNumber,
} from "../../../utils/validation";
import { UserForm } from "../../../models/UserForm.model";
import { generateUsernameFromBrand } from "../../../utils/createUserName";
import { createPaymentLink } from "../../../services/CheckoutService";

const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  errorMessage,
}: any) => (
  <FormControl>
    <FormLabel className={style.formLabel}>{label}</FormLabel>
    <Input
      focusBorderColor={themeColors.primaryButton}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
    {errorMessage && <Text color="red.500">{errorMessage}</Text>}
  </FormControl>
);

const PackageDetail = ({
  label,
  value,
  classNameValue = style.packagesDescription,
}: {
  label: string;
  value: string;
  classNameValue?: string;
}) => (
  <Flex justify="space-between" mb={4} className={style.packagesDetails}>
    <Text>{label}</Text>
    <Text className={classNameValue}>{value}</Text>
  </Flex>
);

const PaymentInfoPage = () => {
  const navigate = useNavigate();
  const [brandData, setBrandData] = useState<BrandForm>({
    brandName: { value: "", errorMessage: "" },
    image: { value: null, errorMessage: "" },
    imageUrl: {
      value: "",
      errorMessage: "",
    },
  });
  const [userData, setUserData] = useState<UserForm>({
    fullName: { value: "", errorMessage: "" },
    userName: {
      value: "",
      errorMessage: "",
    },
    phoneNumber: { value: "", errorMessage: "" },
    DOB: { value: null, errorMessage: "" },
    gender: { value: "Nam", errorMessage: "" },
    isActive: { value: 2, errorMessage: "" },
  });
  const [email, setEmail] = useState({
    value: "",
    errorMessage: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendVerificationCode = () => {
    if (!isValidEmail(email.value)) {
      setEmail((prev) => ({
        ...prev,
        errorMessage: "Email không hợp lệ",
      }));
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setIsCodeSent(true);
    setCountdown(300);
    console.log(isCodeSent);

    console.log(`Mã xác thực: ${code}`);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsCodeSent(false);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrandName = e.target.value;

    setBrandData((prevData) => ({
      ...prevData,
      brandName: { value: newBrandName, errorMessage: "" },
    }));

    setUserData((prevData) => ({
      ...prevData,
      userName: {
        value: generateUsernameFromBrand(newBrandName),
        errorMessage: "",
      },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImage = isImageFile(file);

      if (!isImage) {
        setBrandData((prevData) => ({
          ...prevData,
          image: { value: null, errorMessage: "Tệp phải là hình ảnh" },
        }));
        return;
      }

      setBrandData((prevData) => ({
        ...prevData,
        image: { value: file, errorMessage: "" },
        imageName: { value: file.name, errorMessage: "" },
      }));
    }
  };

  const handleRemoveImage = () => {
    setBrandData((prevData) => ({
      ...prevData,
      image: { value: null, errorMessage: "" },
      imageUrl: { value: "", errorMessage: "" },
    }));
  };

  const handleInputChange = (field: keyof UserForm, value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: { value, errorMessage: "" },
    }));
  };

  const handleDateChange = (field: keyof UserForm, value: string) => {
    if (!isNaN(Date.parse(value))) {
      setUserData((prevData) => ({
        ...prevData,
        [field]: { value: new Date(value), errorMessage: "" },
      }));
    }
  };

  const imageUrl = brandData.image.value
    ? URL.createObjectURL(brandData.image.value)
    : brandData.imageUrl?.value;

  const handleNextForm = () => {
    let hasError = false;

    if (brandData.brandName.value.length < 1) {
      setBrandData((prevData) => ({
        ...prevData,
        brandName: {
          ...prevData.brandName,
          errorMessage: "Tên thương hiệu là bắt buộc",
        },
      }));
      hasError = true;
    }

    if (
      !brandData.image.value &&
      !brandData.imageUrl?.value &&
      !brandData.image.errorMessage
    ) {
      setBrandData((prevData) => ({
        ...prevData,
        image: {
          ...prevData.image,
          errorMessage: "Logo là bắt buộc",
        },
      }));
      hasError = true;
    }

    if (userData.fullName.value.trim() === "") {
      setUserData((prevData) => ({
        ...prevData,
        fullName: {
          ...prevData.fullName,
          errorMessage: "Họ và tên là bắt buộc",
        },
      }));
      hasError = true;
    } else if (userData.fullName.value.trim().length < 6) {
      setUserData((prevData) => ({
        ...prevData,
        fullName: {
          ...prevData.fullName,
          errorMessage: "Họ và tên phải có ít nhất 6 ký tự",
        },
      }));
      hasError = true;
    }

    if (userData.phoneNumber.value.trim() === "") {
      setUserData((prevData) => ({
        ...prevData,
        phoneNumber: {
          ...prevData.phoneNumber,
          errorMessage: "Số điện thoại là bắt buộc",
        },
      }));
      hasError = true;
    } else if (!isValidPhoneNumber(userData.phoneNumber.value.trim())) {
      setUserData((prevData) => ({
        ...prevData,
        phoneNumber: {
          ...prevData.phoneNumber,
          errorMessage: "Số điện thoại không hợp lệ",
        },
      }));
      hasError = true;
    }

    if (!userData.DOB.value) {
      setUserData((prevData) => ({
        ...prevData,
        DOB: {
          ...prevData.DOB,
          errorMessage: "Ngày sinh là bắt buộc",
        },
      }));
      hasError = true;
    }

    if (email.value.trim() === "") {
      setEmail((prev) => ({
        ...prev,
        errorMessage: "Email là bắt buộc",
      }));
      hasError = true;
    } else if (!isValidEmail(email.value.trim())) {
      setEmail((prev) => ({
        ...prev,
        errorMessage: "Email không hợp lệ",
      }));
      hasError = true;
    }

    if (!hasError) {
      console.log(brandData);
      console.log(userData);
      console.log(email);
      //   navigate("/payment/payment-guide");
    }
  };

  async function handleCreatePaymentLink() {
    try {
      const result = await createPaymentLink();
      if (result.isSuccess) {
        window.location.href = result.data;
      }
    } finally {
    }
  }

  return (
    <Box p={8} w="100%" mb="2rem" mt="1rem">
      {/* Cột chứa Thông tin cá nhân và Thông tin chi tiết gói */}
      <Grid templateColumns="2fr 1fr" gap={6}>
        {/* Cột bên trái - Thông tin cá nhân */}
        <Box bg="gray.50" p={6} borderRadius="md" className={style.form}>
          <Heading mb={4} className={style.formTitle}>
            Thông tin đăng ký
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormInput
              label="Tên thương hiệu"
              placeholder="Nhập tên thương hiệu"
              value={brandData.brandName.value}
              onChange={handleBrandNameChange}
              errorMessage={brandData.brandName.errorMessage}
            />
            <FormInput
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              value={userData.fullName.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("fullName", e.target.value)
              }
              errorMessage={userData.fullName.errorMessage}
            />
            <FormInput
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={userData.phoneNumber.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("phoneNumber", e.target.value)
              }
              errorMessage={userData.phoneNumber.errorMessage}
            />
            <FormControl>
              <FormLabel className={style.formLabel}>Giới tính</FormLabel>
              <Select
                focusBorderColor={themeColors.primaryButton}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option>Nam</option>
                <option>Nữ</option>
              </Select>
            </FormControl>
            <FormInput
              label="Email"
              placeholder="Nhập email"
              value={email.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail({ value: e.target.value, errorMessage: "" })
              }
              errorMessage={email.errorMessage}
            />
            <Grid templateColumns="2fr auto" gap={4}>
              <FormInput
                label="Mã xác thực"
                placeholder="Nhập mã 6 chữ số"
                value={verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVerificationCode(e.target.value)
                }
              />
              <Button
                mt={9}
                onClick={handleSendVerificationCode}
                isDisabled={isCodeSent || countdown > 0}
                colorScheme={isCodeSent ? "gray" : "teal"}
                sx={{
                  color: isCodeSent ? "black" : "white",
                  fontWeight: isCodeSent ? "bold" : "500",
                  cursor: isCodeSent ? "not-allowed" : "pointer",
                }}
              >
                {isCodeSent ? `Gửi lại sau ${formatTime(countdown)}` : "Gửi mã"}
              </Button>
            </Grid>
            <FormInput
              label="Ngày sinh"
              placeholder=""
              type="date"
              value={userData.DOB.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDateChange("DOB", e.target.value)
              }
              errorMessage={userData.DOB.errorMessage}
            />
            <FormControl className={style.formImage}>
              <FormLabel className={style.formLabel} w="36%">
                Logo thương hiệu
              </FormLabel>
              <Flex align="center">
                {!brandData.image.value && !brandData.imageUrl?.value && (
                  <Input
                    type="file"
                    className={style.inputImage}
                    onChange={handleImageChange}
                  />
                )}
                {(brandData.image.value || brandData.imageUrl?.value) && (
                  <Button onClick={handleRemoveImage} ml={3}>
                    Xoá
                  </Button>
                )}
              </Flex>
              {(brandData.image.value ||
                (brandData.imageUrl && brandData.imageUrl.value)) && (
                <Image
                  src={imageUrl}
                  alt="Image Preview"
                  className={style.imagePreview}
                />
              )}
              {brandData.image.errorMessage && (
                <Text color="red.500">{brandData.image.errorMessage}</Text>
              )}
            </FormControl>
          </Grid>
        </Box>

        {/* Cột bên phải - Thông tin chi tiết gói */}
        <Box bg="gray.50" p={6} borderRadius="md" className={style.packages}>
          <Heading className={style.packagesTitle} mb={4}>
            Thông tin chi tiết gói
          </Heading>
          <PackageDetail label="Tên gói" value="Gói Cơ Bản" />
          <PackageDetail label="Thời hạn gói" value="01 tháng" />
          <Divider borderWidth="1px" mb={4} />
          <PackageDetail label="Ngày hiệu lực" value="14/09/2024" />
          <PackageDetail label="Sử dụng đến" value="14/10/2024" />
          <Divider borderWidth="1px" mb={4} />
          <PackageDetail label="Trị giá" value="500.000 VND" />
          <Divider borderWidth="1px" mb={4} />
          <PackageDetail
            label="Thành tiền"
            value="500.000 VND"
            classNameValue={style.packagesFinalPrice}
          />
          <Flex justify="space-between" mb={4} w="100%">
            <Button
              mt={6}
              fontSize="24px"
              w="100%"
              p={7}
              bg={themeColors.primaryButton}
              color="white"
              _hover={{
                borderColor: "transparent",
                bg: `${themeColors.primaryButton}`,
                opacity: 0.9,
              }}
              // isLoading
              // loadingText="Thanh toán"
              // onClick={handleNextForm}
              // onClick={handleCreatePaymentLink}
            >
              Thanh toán
            </Button>
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default PaymentInfoPage;
