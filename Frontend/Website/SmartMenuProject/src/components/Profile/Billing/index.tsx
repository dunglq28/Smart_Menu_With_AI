import { Button, Divider, Flex, Input, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import style from "./Profile.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";

interface BillingProps {
  paymentHistory: Array<{
    name: string;
    date: string;
    amount: string;
    note: string;
  }>;
}

const Billing: React.FC<BillingProps> = ({ paymentHistory }) => {
  const { t } = useTranslation("profile");

  return (
    <Flex className={style.tab_panels_container}>
      <Text className={style.tab_panels_container_title}>{t("Gói đang sử dụng")}</Text>
      <Divider />

      <Flex className={style.tab_panels_container_content}>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>{t("Tên gói")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} readOnly value="Gói cơ bản" />
        </Flex>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>{t("Giá tiền")}</Text>
          <Text className={style.text_title_content}>{t("100.000 VND/tháng")}</Text>
        </Flex>
      </Flex>

      <Flex className={style.tab_panels_container_content}>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>{t("Ngày sử dụng")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} readOnly value="18/09/2024" />
        </Flex>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>{t("Ngày hết hạn")}</Text>
          <Input focusBorderColor={themeColors.primaryButton} readOnly value="18/10/2024" />
        </Flex>
      </Flex>

      <Flex className={style.btn_container}>
        <Button className={style.btn_content}>{t("Gia hạn gói")}</Button>
      </Flex>

      <Flex flexDir="column">
        <Text className={style.text_title_content}>{t("Lịch sử thanh toán")}</Text>
        <Flex className={style.payment_history_container} flexDir="column" marginTop="1rem">
          <Flex className={style.payment_history_header}>
            <Text className={style.payment_history_header_text}>{t("Danh sách thanh toán")}</Text>
          </Flex>
          <Flex className={style.payment_history_list} flexDir="column">
            {paymentHistory.length > 0 ? (
              paymentHistory.map((payment, index) => (
                <Flex key={index} className={style.payment_history_item}>
                  <Flex flexDirection="column" width="30%">
                    <Text className={style.payment_history_item_label}>{t("Tên gói")}</Text>
                    <Text className={style.payment_history_item_value}>{payment.name}</Text>
                  </Flex>
                  <Flex flexDirection="column" width="30%">
                    <Text className={style.payment_history_item_label}>{t("Ngày giao dịch")}</Text>
                    <Text className={style.payment_history_item_value}>{payment.date}</Text>
                  </Flex>
                  <Flex flexDirection="column" width="30%">
                    <Text className={style.payment_history_item_label}>{t("Số tiền")}</Text>
                    <Text className={style.payment_history_item_value}>{payment.amount} VND</Text>
                  </Flex>
                  <Flex flexDirection="column" width="40%">
                    <Text className={style.payment_history_item_label}>{t("Ghi chú")}</Text>
                    <Text className={style.payment_history_item_value}>{payment.note}</Text>
                  </Flex>
                </Flex>
              ))
            ) : (
              <Text>{t("Không có lịch sử thanh toán")}</Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Billing;
