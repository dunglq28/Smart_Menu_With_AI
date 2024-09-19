import { Box, Button, Divider, Flex, Image, Input, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import style from "./Profile.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";

const ProfileInfo: React.FC = () => {
  const { t } = useTranslation("profile");

  return (
    <Flex className={style.tab_panels_container}>
      <Text className={style.tab_panels_container_title}>{t("profile information title")}</Text>
      <Divider marginY="1rem" />
      <Flex className={style.tab_panels_container_content}>
        <Flex flexDirection="column" width="48%" alignItems="center">
          <Image src="https://bit.ly/dan-abramov" alt="Brand Logo" className={style.brand_logo} boxSize="100px" />
          <Text className={style.brand_name} fontSize="18px" fontWeight="bold" marginTop="0.5rem">
            {t("Brand Name")}
          </Text>
        </Flex>
        <Flex flexDirection="column" width="48%">
          <Text className={style.text_title_content}>{t("fullname")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} value="Lê Quang Dũng" />
          <Text className={style.text_title_content} marginTop="1rem">{t("Tên tài khoản")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} readOnly value="BoBaPopSmartMenu" />
        </Flex>
      </Flex>

      <Flex className={style.tab_panels_container_content}>
        <Flex flexDirection="column" width="48%">
          <Text className={style.text_title_content}>{t("Số điện thoại")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} value="0961287613" />
        </Flex>
        <Flex flexDirection="column" width="48%">
          <Text className={style.text_title_content}>{t("Giới tính")}</Text>
          <RadioGroup defaultValue="male" paddingTop="8px">
            <Flex direction="row" columnGap="1rem">
              <Radio value="male">{t("Nam")}</Radio>
              <Radio value="female">{t("Nữ")}</Radio>
            </Flex>
          </RadioGroup>
        </Flex>
      </Flex>

      <Flex className={style.tab_panels_container_content}>
        <Flex flexDirection="column" width="48%">
          <Text className={style.text_title_content}>{t("birthday")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} type="date" defaultValue="1990-01-01" />
        </Flex>
        <Flex flexDirection="column" width="48%">
          <Text className={style.text_title_content}>{t("Ngày tạo")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} readOnly value="18/09/2024" />
        </Flex>
      </Flex>

      <Flex className={style.tab_panels_container_content}>
        <Flex flexDirection="column" width="48%">
          <Text className={style.text_title_content}>{t("Vai trò")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} readOnly value="Quản trị viên" />
        </Flex>
      </Flex>

      <Flex columnGap="5px" className={style.btn_container}>
        <Button className={style.btn_content}>{t("update profile")}</Button>
        <Button>{t("reset changes")}</Button>
      </Flex>
    </Flex>
  );
};

export default ProfileInfo;
