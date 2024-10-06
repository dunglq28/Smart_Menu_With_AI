import React, { useEffect, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
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
import moment from "moment";
import { createUser, updateUser } from "../../../services/UserService";
import {
  createBrand,
  getBrandByBrandName,
  getBrandByUserId,
  updateBrand,
} from "../../../services/BrandService";
import { checkExistEmail } from "../../../services/PaymentService";
import { brandUpdate, userUpdate } from "../../../payloads/requests/updateRequests.model";
import PackageDetails from "../../../components/Payment/PackageDetails";
import RegistrationForm from "../../../components/Payment/RegistrationForm";

interface BrandResult {
  isSuccess: boolean;
  userId?: string;
}

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
        dob: userForm.DOB.value ? userForm.DOB.value.toISOString().split("T")[0] : "",
        gender: userForm.gender.value,
        phone: userForm.phoneNumber.value,
        isActive: false,
        updateBy: 0,
      };

      // Gọi API cập nhật thông tin user
      var userResult = await updateUser(userId, null, userUpdate);

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
            plan.price,
            // "2000",
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

  return (
    <Box p={8} w="100%" mb="2rem" mt="1rem">
      {/* Cột chứa Thông tin cá nhân và Thông tin chi tiết gói */}
      <Grid templateColumns="2fr 1fr" gap={6}>
        {/* Cột bên trái - Thông tin cá nhân */}
        <RegistrationForm
          brandForm={brandForm}
          userForm={userForm}
          email={email}
          setEmail={setEmail}
          handleBrandNameChange={handleBrandNameChange}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          handleSendVerificationCode={handleSendVerificationCode}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          isLoadingSendMail={isLoadingSendMail}
          isCodeSent={isCodeSent}
          countdown={countdown}
          verificationCodeUser={verificationCodeUser}
          setVerificationCodeUser={setVerificationCodeUser}
          imageUrl={imageUrl}
        />

        {/* Cột bên phải - Thông tin chi tiết gói */}
        <PackageDetails
          plan={plan}
          effectiveDate={effectiveDate}
          expirationDate={expirationDate}
          isLoading={isLoading}
          handleCreatePaymentLink={handleCreatePaymentLink}
        />
      </Grid>
    </Box>
  );
};

export default PaymentInfoPage;
