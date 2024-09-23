import { Button, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import style from "./SecuritySettings.module.scss";
import PasswordInput from "../../PasswordInput";
import Loading from "../../Loading";
import { useState } from "react";
import { getInitialPasswordForm } from "../../../utils/initialData";
import { PasswordForm } from "../../../models/Password.model";
import { validatePassword } from "../../../utils/validation";
import { updatePassword } from "../../../services/AuthenticationService";
import { toast } from "react-toastify";

interface SecuritySettingsProps {
  locationString: string | null;
  flag: string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ locationString, flag }) => {
  const { t } = useTranslation("profile");
  const [password, setPassword] = useState<PasswordForm>(getInitialPasswordForm());

  const updatePasswordField = (field: keyof PasswordForm, value: string) => {
    setPassword((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], value }, // Update the specific field value
    }));
  };

  const handlePasswordUpdate = async () => {
    const errors = validatePassword(password);
    const updatedFormData = {
      oldPassword: { ...password.oldPassword, errorMessage: errors.oldPassword },
      newPassword: { ...password.newPassword, errorMessage: errors.newPassword },
      confirm: { ...password.confirm, errorMessage: errors.confirm },
    };

    setPassword(updatedFormData);
    const hasError = Object.values(errors).some((error) => error !== "");

    if (!hasError) {
      const result = await updatePassword(Number(localStorage.getItem("UserId")), password);
      if (result.statusCode === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };
  return (
    <Flex className={style.tab_panels_container}>
      <Text className={style.tab_panels_container_title}>{t("sercurity title")}</Text>
      <Divider />
      <Flex
        className={`${style.tab_panels_container_content} ${style.tab_panels_container_column}`}
      >
        <Text className={style.text_title_content}>{t("change password")}</Text>
        <Flex className={style.tab_panels_container_form}>
          <PasswordInput
            setPassword={updatePasswordField}
            field="oldPassword"
            placeholder={t("enter old password")}
          />
        </Flex>
        {password.oldPassword.errorMessage && (
          <Text mb="8px" pl="4px" mt="-8px" color="red.500">
            {password.oldPassword.errorMessage}
          </Text>
        )}
        <Flex className={style.tab_panels_container_form}>
          <PasswordInput
            setPassword={updatePasswordField}
            field="newPassword"
            placeholder={t("new password")}
          />
        </Flex>
        {password.newPassword.errorMessage && (
          <Text mb="8px" pl="4px" mt="-8px" color="red.500">
            {password.newPassword.errorMessage}
          </Text>
        )}
        <Flex>
          <PasswordInput
            setPassword={updatePasswordField}
            field="confirm"
            placeholder={t("confirm new password")}
          />
        </Flex>
        {password.confirm.errorMessage && (
          <Text mb="8px" pl="4px" mt="-8px" color="red.500">
            {password.confirm.errorMessage}
          </Text>
        )}
        <Flex className={style.btn_container}>
          <Button onClick={handlePasswordUpdate} className={style.btn_content}>
            {t("save change")}
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Flex alignItems="center" columnGap="20px">
        <Text>
          {locationString ? `${t("your current session")} ${locationString}` : <Loading />}
        </Text>
        <Image src={flag} />
      </Flex>
    </Flex>
  );
};

export default SecuritySettings;
