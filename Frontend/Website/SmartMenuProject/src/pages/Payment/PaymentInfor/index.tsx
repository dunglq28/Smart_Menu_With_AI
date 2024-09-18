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
import { sendVerificationCode } from "../../../services/EmailService";
import { PlanData } from "../../../payloads/responses/PlanResponse.model";
import { getPlan } from "../../../services/PlanService";
import { toast } from "react-toastify";
import {
  getInitialBrandData,
  getInitialPlanData,
  getInitialUserData,
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
  const [brandData, setBrandData] = useState<BrandForm>(getInitialBrandData());
  const [userData, setUserData] = useState<UserForm>(getInitialUserData());
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
    if (!isValidEmail(email.value)) {
      setEmail((prev) => ({
        ...prev,
        errorMessage: "Email không hợp lệ",
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

  async function addNewBrand(): Promise<BrandResult> {
    try {
      const brandForm = new FormData();

      if (brandData.image.value && brandData.brandName.value) {
        brandForm.append("BrandName", brandData.brandName.value);
        brandForm.append("Image", brandData.image.value);

        const response = await getBrandByBrandName(brandData.brandName.value);
        if (response.data == null) {
          const userResult = await createUser(userData, 2);
          if (userResult.statusCode === 200) {
            brandForm.append("UserId", userResult.data.toString());
            const brandResult = await createBrand(brandForm);

            if (brandResult.statusCode === 200) {
              return { isSuccess: true, userId: userResult.data.toString() };
            }
          } 
        } else {
          setBrandData((prevData) => ({
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
      // Chuẩn bị dữ liệu cập nhật cho user
      var userUpdate: userUpdate = {
        fullname: userData.fullName.value,
        dob: userData.DOB.value
          ? userData.DOB.value.toISOString().split("T")[0]
          : "",
        gender: userData.gender.value,
        phone: userData.phoneNumber.value,
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

      // Lấy thông tin thương hiệu bằng userId
      var brand = await getBrandByUserId(userId);

      if (!brand || !brand.data) {
        console.error("Error retrieving brand for user:", brand);
        return { isSuccess: false };
      }

      // Chuẩn bị dữ liệu cập nhật cho thương hiệu
      var brandUpdate: brandUpdate = {
        id: brand.data.brandId,
        brandName: brandData.brandName.value,
        image: brandData.image.value,
      };

      // Gọi API cập nhật thông tin thương hiệu
      var brandResult = await updateBrand(brandUpdate);

      // Kiểm tra kết quả cập nhật thương hiệu
      if (brandResult.statusCode !== 200) {
        console.error("Error updating brand:", brandResult);
        setBrandData((prevData) => ({
          ...prevData,
          brandName: {
            ...prevData.brandName,
            errorMessage: "Tên thương hiệu đã tồn tại",
          },
        }));
        return { isSuccess: false };
      }

      // Trả về kết quả thành công nếu cả user và brand đều cập nhật thành công
      return { isSuccess: true, userId: userId.toString() };
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ ngoại lệ nào
      console.error("Error updating brand and user:", error);
      setBrandData((prevData) => ({
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

    if (verificationCodeUser.value.trim() === "") {
      setVerificationCodeUser((prev) => ({
        ...prev,
        errorMessage: "Mã xác nhận là bắt buộc",
      }));
      hasError = true;
    } else if (verificationCodeUser.value.trim() != verificationCode) {
      setVerificationCodeUser((prev) => ({
        ...prev,
        errorMessage: "Mã xác nhận không chính xác",
      }));
      hasError = true;
    }

    if (!hasError) {
      try {
        setIsLoading(true);
        const payment = await checkExistEmail(email.value);
        console.log(payment);

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
                userData.DOB.value
                  ? userData.DOB.value.toISOString().split("T")[0]
                  : ""
              }
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
