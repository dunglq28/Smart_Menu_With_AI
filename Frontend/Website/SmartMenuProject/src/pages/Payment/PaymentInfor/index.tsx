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
  validateBrandForm,
  validateEmail,
  validateUserForm,
  validateVerificationCode,
} from "../../../utils/validation";
import { UserForm } from "../../../models/UserForm.model";
import { generateUsernameFromBrand } from "../../../utils/createUserName";
import { createPaymentLink } from "../../../services/CheckoutService";
import { sendVerificationCode } from "../../../services/EmailService";
import { PlanData } from "../../../payloads/responses/PlanResponse.model";
import { getPlan } from "../../../services/PlanService";
import { toast } from "react-toastify";
import {
  getInitialBrandForm,
  getInitialPlanData,
  getInitialUserForm,
} from "../../../utils/initialData";
import { formatCurrencyVND } from "../../../utils/functionHelper";
import moment from "moment";
import { createUser, updateUser } from "../../../services/UserService";
import {
  createBrand,
  getBrandByBrandName,
  getBrandByUserId,
  updateBrand,
} from "../../../services/BrandService";
import { PaymentStatus } from "../../../constants/Enum";
import { checkExistEmail } from "../../../services/PaymentService";
import {
  brandUpdate,
  userUpdate,
} from "../../../payloads/requests/updateRequests.model";

interface BrandResult {
  isSuccess: boolean;
  userId?: string;
}

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
  const [brandForm, setBrandForm] = useState<BrandForm>(getInitialBrandForm());
  const [userForm, setUserForm] = useState<UserForm>(getInitialUserForm());
  const [email, setEmail] = useState({
    value: "",
    errorMessage: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeUser, setVerificationCodeUser] = useState({
    value: "",
    errorMessage: "",
  });
  const [plan, setPlan] = useState<PlanData>(getInitialPlanData());
  const today = moment();
  const effectiveDate = today.format("DD/MM/YYYY");
  const expirationDate = today.add(1, "month").format("DD/MM/YYYY");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoadingSendMail, setIsLoadingSendMail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      const queryParams = new URLSearchParams(location.search);
      const planIdParam = queryParams.get("plan-id");
      if (planIdParam) {
        const id = parseInt(planIdParam);
        try {
          const result = await getPlan(id);
          if (result.isSuccess) {
            setPlan(result.data);
          } else {
            toast.error("Không có dữ liệu kế hoạch");
          }
        } catch (err) {
          toast.error("Lỗi khi lấy dữ liệu gói dịch vụ");
        }
      } else {
        toast.error("ID kế hoạch không hợp lệ");
      }
    };

    fetchPlan();
  }, [location.search]);

  async function handleSendVerificationCode() {
    const emailError = validateEmail(email.value);
    if (emailError) {
      setEmail((prev) => ({
        ...prev,
        errorMessage: emailError,
      }));
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setIsLoadingSendMail(true);
    const result = await sendVerificationCode(email.value, code);
    if (result.isSuccess) {
      setIsLoadingSendMail(false);
      setIsCodeSent(true);
      setCountdown(300);
    } else {
      setIsLoadingSendMail(false);
      setEmail((prev) => ({
        ...prev,
        errorMessage: result.message,
      }));
    }
  }

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

    setBrandForm((prevData) => ({
      ...prevData,
      brandName: { value: newBrandName, errorMessage: "" },
    }));

    setUserForm((prevData) => ({
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
        setBrandForm((prevData) => ({
          ...prevData,
          image: { value: null, errorMessage: "Tệp phải là hình ảnh" },
        }));
        return;
      }

      setBrandForm((prevData) => ({
        ...prevData,
        image: { value: file, errorMessage: "" },
        imageName: { value: file.name, errorMessage: "" },
      }));
    }
  };

  const handleRemoveImage = () => {
    setBrandForm((prevData) => ({
      ...prevData,
      image: { value: null, errorMessage: "" },
      imageUrl: { value: "", errorMessage: "" },
    }));
  };

  const handleInputChange = (field: keyof UserForm, value: string) => {
    setUserForm((prevData) => ({
      ...prevData,
      [field]: { value, errorMessage: "" },
    }));
  };

  const handleDateChange = (field: keyof UserForm, value: string) => {
    if (!isNaN(Date.parse(value))) {
      setUserForm((prevData) => ({
        ...prevData,
        [field]: { value: new Date(value), errorMessage: "" },
      }));
    }
  };

  const imageUrl = brandForm.image.value
    ? URL.createObjectURL(brandForm.image.value)
    : brandForm.imageUrl?.value;

  async function addNewBrand(): Promise<BrandResult> {
    try {
      const brandFormRequest = new FormData();

      if (brandForm.image.value && brandForm.brandName.value) {
        brandFormRequest.append("BrandName", brandForm.brandName.value);
        brandFormRequest.append("Image", brandForm.image.value);

        const response = await getBrandByBrandName(brandForm.brandName.value);
        if (response.data == null) {
          const userResult = await createUser(userForm, 2);
          if (userResult.statusCode === 200) {
            brandFormRequest.append("UserId", userResult.data.toString());
            const brandResult = await createBrand(brandFormRequest);

            if (brandResult.statusCode === 200) {
              return { isSuccess: true, userId: userResult.data.toString() };
            }
          }
        } else {
          setBrandForm((prevData) => ({
            ...prevData,
            brandName: {
              ...prevData.brandName,
              errorMessage: "Tên thương hiệu đã tồn tại",
            },
          }));
        }
      }

      return { isSuccess: false };
    } catch (error) {
      console.error("Error creating brand:", error);
      return { isSuccess: false };
    }
  }

  async function updateOldBrand(userId: number): Promise<BrandResult> {
    try {
      // Lấy thông tin thương hiệu bằng userId
      var brand = await getBrandByUserId(userId);

      if (!brand || !brand.data) {
        console.error("Error retrieving brand for user:", brand);
        return { isSuccess: false };
      }

      // Chuẩn bị dữ liệu cập nhật cho thương hiệu
      var brandUpdate: brandUpdate = {
        id: brand.data.brandId,
        brandName: brandForm.brandName.value,
        image: brandForm.image.value,
      };

      // Gọi API cập nhật thông tin thương hiệu
      var brandResult = await updateBrand(brandUpdate);

      // Kiểm tra kết quả cập nhật thương hiệu
      if (brandResult.statusCode !== 200) {
        console.error("Error updating brand:", brandResult);
        setBrandForm((prevData) => ({
          ...prevData,
          brandName: {
            ...prevData.brandName,
            errorMessage: "Tên thương hiệu đã tồn tại",
          },
        }));
        return { isSuccess: false };
      }

      // Chuẩn bị dữ liệu cập nhật cho user
      var userUpdate: userUpdate = {
        fullname: userForm.fullName.value,
        dob: userForm.DOB.value
          ? userForm.DOB.value.toISOString().split("T")[0]
          : "",
        gender: userForm.gender.value,
        phone: userForm.phoneNumber.value,
        isActive: false,
        updateBy: 0,
      };

      // Gọi API cập nhật thông tin user
      var userResult = await updateUser(userId, userUpdate);

      // Kiểm tra kết quả cập nhật user
      if (userResult.statusCode !== 200) {
        console.error("Error updating user:", userResult);
        return { isSuccess: false };
      }

      // Trả về kết quả thành công nếu cả user và brand đều cập nhật thành công
      return { isSuccess: true, userId: userId.toString() };
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ ngoại lệ nào
      console.error("Error updating brand and user:", error);
      setBrandForm((prevData) => ({
        ...prevData,
        brandName: {
          ...prevData.brandName,
          errorMessage: "Có lỗi xảy ra khi cập nhật thương hiệu",
        },
      }));
      return { isSuccess: false };
    }
  }

  async function handleCreatePaymentLink() {
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
    const hasUserError = Object.values(userErrors).some(
      (error) => error !== "",
    );

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
    const hasBrandError = Object.values(brandErrors).some(
      (error) => error !== "",
    );

    let hasError = hasUserError || hasBrandError;

    const emailError = validateEmail(email.value);
    if (emailError) {
      setEmail((prev) => ({
        ...prev,
        errorMessage: emailError,
      }));
      hasError = true;
    }

    const verificationCodeError = validateVerificationCode(
      verificationCodeUser.value,
      verificationCode,
    );
    if (verificationCodeError) {
      setVerificationCodeUser((prev) => ({
        ...prev,
        errorMessage: verificationCodeError,
      }));
      hasError = true;
    }

    if (!hasError) {
      try {
        setIsLoading(true);
        const payment = await checkExistEmail(email.value);

        let brandResult;
        if (payment.data != null) {
          brandResult = await updateOldBrand(payment.data.userId);
        } else {
          brandResult = await addNewBrand();
        }

        if (brandResult?.isSuccess) {
          const result = await createPaymentLink(
            // plan.price,
            "2000",
            brandResult.userId,
            email.value,
            plan.planId,
            plan.planName,
          );

          if (result.isSuccess) {
            return (window.location.href = result.data);
          }
        }

        throw new Error("No valid payment process could be initiated");
      } catch (err) {
        console.error("Error during payment process:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
              value={brandForm.brandName.value}
              onChange={handleBrandNameChange}
              errorMessage={brandForm.brandName.errorMessage}
            />
            <FormInput
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              value={userForm.fullName.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("fullName", e.target.value)
              }
              errorMessage={userForm.fullName.errorMessage}
            />
            <FormInput
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={userForm.phoneNumber.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("phoneNumber", e.target.value)
              }
              errorMessage={userForm.phoneNumber.errorMessage}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVerificationCodeUser({
                    value: e.target.value,
                    errorMessage: "",
                  })
                }
                errorMessage={verificationCodeUser.errorMessage}
              />
              <Button
                mt={9}
                onClick={handleSendVerificationCode}
                isLoading={isLoadingSendMail}
                loadingText="Gửi mã"
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
              type="Date"
              value={
                userForm.DOB.value
                  ? userForm.DOB.value.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDateChange("DOB", e.target.value)
              }
              errorMessage={userForm.DOB.errorMessage}
            />
            <FormControl className={style.formImage}>
              <FormLabel className={style.formLabel} w="36%">
                Logo thương hiệu
              </FormLabel>
              <Flex align="center">
                {!brandForm.image.value && !brandForm.imageUrl?.value && (
                  <Input
                    type="file"
                    className={style.inputImage}
                    onChange={handleImageChange}
                  />
                )}
                {(brandForm.image.value || brandForm.imageUrl?.value) && (
                  <Button onClick={handleRemoveImage} ml={3}>
                    Xoá
                  </Button>
                )}
              </Flex>
              {(brandForm.image.value ||
                (brandForm.imageUrl && brandForm.imageUrl.value)) && (
                <Image
                  src={imageUrl}
                  alt="Image Preview"
                  className={style.imagePreview}
                />
              )}
              {brandForm.image.errorMessage && (
                <Text color="red.500">{brandForm.image.errorMessage}</Text>
              )}
            </FormControl>
          </Grid>
        </Box>

        {/* Cột bên phải - Thông tin chi tiết gói */}
        <Box bg="gray.50" p={6} borderRadius="md" className={style.packages}>
          <Heading className={style.packagesTitle} mb={4}>
            Thông tin chi tiết gói
          </Heading>
          <PackageDetail label="Tên gói" value={plan.planName} />
          <PackageDetail label="Thời hạn gói" value="01 tháng" />
          <Divider borderWidth="1px" mb={4} />
          <PackageDetail label="Ngày hiệu lực" value={effectiveDate} />
          <PackageDetail label="Sử dụng đến" value={expirationDate} />
          <Divider borderWidth="1px" mb={4} />
          <PackageDetail
            label="Trị giá"
            value={formatCurrencyVND(plan.price.toString())}
          />
          <Divider borderWidth="1px" mb={4} />
          <PackageDetail
            label="Thành tiền"
            value={formatCurrencyVND(plan.price.toString())}
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
              isLoading={isLoading}
              loadingText="Thanh toán"
              onClick={handleCreatePaymentLink}
              _disabled={{
                opacity: 0.6,
                cursor: "not-allowed",
              }}
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
