import { Button, Divider, Flex, Input, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import style from "./Billing.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";
import { SubscriptionData } from "../../../payloads/responses/SubscriptionData.model";
import { formatCurrencyVND, formatDate, formatDateAndTime } from "../../../utils/functionHelper";
import { useNavigate } from "react-router-dom";

interface BillingProps {
  subscription: SubscriptionData;
}

const Billing: React.FC<BillingProps> = ({ subscription }) => {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();

  return (
    <Flex className={style.tab_panels_container}>
      <Text className={style.tab_panels_container_title}>{t("Gói đang sử dụng")}</Text>
      <Divider />

      <Flex className={style.tab_panels_container_content}>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>{t("Tên gói")}</Text>
          <Input
            focusBorderColor={themeColors.primaryButton}
            readOnly
            value={subscription?.planName || "N/A"}
          />
        </Flex>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>{t("Giá tiền")}</Text>
          <Text className={style.text_title_content}>
            {formatCurrencyVND(subscription?.price.toString() || "0")}/tháng
          </Text>
        </Flex>
      </Flex>

      <Flex className={style.tab_panels_container_content}>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>{t("Ngày sử dụng")}</Text>
          <Input
            focusBorderColor={themeColors.primaryButton}
            readOnly
            value={formatDate(subscription.startDate!) || "N/A"}
          />
        </Flex>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>{t("Ngày hết hạn")}</Text>
          <Input
            focusBorderColor={themeColors.primaryButton}
            readOnly
            value={formatDate(subscription.endDate!) || "N/A"}
          />
        </Flex>
      </Flex>

      {/* Số lượt tạo chi nhánh và số lượt tạo menu */}
      <Flex mt="12px" className={style.tab_panels_container_content}>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>
            {t("Số lượt tạo chi nhánh")}:{" "}
            <span>
              {subscription.storeCount || 0}/{subscription.maxAccount || 0}
            </span>
          </Text>
        </Flex>
        <Flex className={style.tab_panels_container_content_column}>
          <Text className={style.text_title_content}>
            {t("Số lượt tạo menu")}:{" "}
            <span>
              {subscription.menuCount || 0}/{subscription.maxMenu || 0}
            </span>
          </Text>
        </Flex>
      </Flex>

      <Flex className={style.btn_container}>
        <Button onClick={() => navigate(`/payment/renew-package`)} className={style.btn_content}>
          {t("Gia hạn gói")}
        </Button>
        <Button className={style.btn_content} isDisabled={true}>
          {t("Đăng ký gói mới")}
        </Button>
      </Flex>

      <Flex flexDir="column">
        <Text className={style.text_title_content}>{t("Lịch sử thanh toán")}</Text>
        <Flex className={style.payment_history_container} flexDir="column" marginTop="1rem">
          <Flex className={style.payment_history_header}>
            <Text className={style.payment_history_header_text}>{t("Danh sách thanh toán")}</Text>
          </Flex>
          <Flex className={style.payment_history_list} flexDir="column">
            {subscription && subscription.payments && subscription.payments.length > 0 ? (
              subscription.payments.map((payment, index) => (
                <Flex key={index} className={style.payment_history_item}>
                  <Flex flexDirection="column" width="50%">
                    <Text className={style.payment_history_item_label}>{t("Tên gói")}</Text>
                    <Text className={style.payment_history_item_value}>{payment.planName}</Text>
                  </Flex>
                  <Flex flexDirection="column" width="50%">
                    <Text className={style.payment_history_item_label}>{t("Ngày giao dịch")}</Text>
                    <Text className={style.payment_history_item_value}>
                      {formatDateAndTime(payment.paymentDate)}
                    </Text>
                  </Flex>
                  <Flex flexDirection="column" width="50%">
                    <Text className={style.payment_history_item_label}>{t("Số tiền")}</Text>
                    <Text className={style.payment_history_item_value}>
                      {formatCurrencyVND(payment.amount.toString())}
                    </Text>
                  </Flex>
                  <Flex flexDirection="column" width="50%">
                    <Text className={style.payment_history_item_label}>{t("Ghi chú")}</Text>
                    <Text className={style.payment_history_item_value}>{payment.planName}</Text>
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
