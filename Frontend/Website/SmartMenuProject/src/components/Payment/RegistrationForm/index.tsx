import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import FormInput from "../FormInput";
import { themeColors } from "../../../constants/GlobalStyles";
import { formatTime } from "../../../utils/functionHelper";
import { BrandForm } from "../../../models/BrandForm.model";
import { UserForm } from "../../../models/UserForm.model";

import style from "./RegistrationForm.module.scss";

interface RegistrationFormProps {
  brandForm: BrandForm;
  userForm: UserForm;
  email: { value: string; errorMessage: string };
  setEmail: (value: { value: string; errorMessage: string }) => void;
  handleBrandNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (field: keyof UserForm, value: string) => void;
  handleDateChange: (field: keyof UserForm, value: string) => void;
  handleSendVerificationCode: () => void;
  isLoadingSendMail: boolean;
  isCodeSent: boolean;
  countdown: number;
  verificationCodeUser: { value: string; errorMessage: string };
  setVerificationCodeUser: (value: { value: string; errorMessage: string }) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  imageUrl: string | undefined;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  brandForm,
  userForm,
  email,
  setEmail,
  handleBrandNameChange,
  handleInputChange,
  handleDateChange,
  handleSendVerificationCode,
  isLoadingSendMail,
  isCodeSent,
  countdown,
  verificationCodeUser,
  setVerificationCodeUser,
  handleImageChange,
  handleRemoveImage,
  imageUrl,
}) => {
  return (
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
            value={verificationCodeUser.value}
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
          type="date"
          value={userForm.DOB.value ? userForm.DOB.value.toISOString().split("T")[0] : ""}
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
              <Input type="file" className={style.inputImage} onChange={handleImageChange} />
            )}
            {(brandForm.image.value || brandForm.imageUrl?.value) && (
              <Button onClick={handleRemoveImage} ml={3}>
                Xoá
              </Button>
            )}
          </Flex>
          {(brandForm.image.value || brandForm.imageUrl?.value) && (
            <Image src={imageUrl} alt="Image Preview" className={style.imagePreview} />
          )}
          {brandForm.image.errorMessage && (
            <Text color="red.500">{brandForm.image.errorMessage}</Text>
          )}
        </FormControl>
      </Grid>
    </Box>
  );
};

export default RegistrationForm;
