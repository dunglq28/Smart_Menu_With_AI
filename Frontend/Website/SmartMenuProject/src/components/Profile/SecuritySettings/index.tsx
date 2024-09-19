import { Button, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import style from "./Profile.module.scss";
import PasswordInput from "../../PasswordInput";
import Loading from "../../Loading";

interface SecuritySettingsProps {
  locationString: string | null;
  flag: string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ locationString, flag }) => {
  const { t } = useTranslation("profile");

  return (
    <Flex className={style.tab_panels_container}>
      <Text className={style.tab_panels_container_title}>{t("sercurity title")}</Text>
      <Divider />
      <Flex className={`${style.tab_panels_container_content} ${style.tab_panels_container_column}`}>
        <Text className={style.text_title_content}>{t("change password")}</Text>
        <Flex className={style.tab_panels_container_form}>
          <PasswordInput placeholder={t("enter old password")} />
        </Flex>
        <Flex className={style.tab_panels_container_form}>
          <PasswordInput placeholder={t("new password")} />
        </Flex>
        <Flex>
          <PasswordInput placeholder={t("confirm new password")} />
        </Flex>
        <Flex className={style.btn_container}>
          <Button className={style.btn_content}>{t("save change")}</Button>
        </Flex>
      </Flex>
      <Divider />
      <Flex alignItems="center" columnGap="20px">
        <Text>{locationString ? `${t("your current session")} ${locationString}` : <Loading />}</Text>
        <Image src={flag} />
      </Flex>
    </Flex>
  );
};

export default SecuritySettings;
