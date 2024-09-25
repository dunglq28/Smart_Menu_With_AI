import { Box, Heading, Divider, Button, Flex, Text } from "@chakra-ui/react";
import style from "./PackageDetails.module.scss"; // import CSS module if available
import PackageDetail from "../PackageDetail";
import { addOneMonthToDate, formatCurrencyVND, formatDate } from "../../../utils/functionHelper";
import { themeColors } from "../../../constants/GlobalStyles";
import { PlanData } from "../../../payloads/responses/PlanResponse.model";
import { getInitialPlanData, getInitialSubscriptionData } from "../../../utils/initialData";
import { SubscriptionData } from "../../../payloads/responses/SubscriptionData.model";

interface PackageDetailsProps {
  subscription?: SubscriptionData;
  plan?: PlanData;
  effectiveDate: string;
  expirationDate: string;
  isLoading: boolean;
  isRenew?: boolean;
  handleCreatePaymentLink: () => void;
}

const PackageDetails = ({
  subscription = getInitialSubscriptionData(),
  plan = getInitialPlanData(),
  effectiveDate,
  expirationDate,
  isLoading,
  isRenew = false,
  handleCreatePaymentLink,
}: PackageDetailsProps) => {
  const actualEffectiveDate =
    isRenew && subscription.endDate ? formatDate(subscription.endDate) : effectiveDate;
  const actualExpirationDate =
    isRenew && subscription.endDate ? addOneMonthToDate(subscription.endDate) : expirationDate;

  return (
    <Box bg="gray.50" p={6} borderRadius="md" className={style.packages}>
      <Heading className={style.packagesTitle} mb={4}>
        Thông tin chi tiết gói
      </Heading>
      <PackageDetail label="Tên gói" value={plan.planName || subscription.planName} />
      <PackageDetail label="Thời hạn gói" value={isRenew ? "Gia hạn 01 tháng" : "01 tháng"} />
      <Divider borderWidth="1px" mb={4} />
      <PackageDetail label="Ngày hiệu lực" value={actualEffectiveDate} />
      <PackageDetail label="Sử dụng đến" value={actualExpirationDate} />
      <Divider borderWidth="1px" mb={4} />
      <PackageDetail
        label="Trị giá"
        value={formatCurrencyVND(plan.price.toString() || subscription.price.toString())}
      />
      <Divider borderWidth="1px" mb={4} />

      {isRenew ? (
        <Text color={themeColors.primaryButton} fontWeight="bold" mb={4}>
          Bạn đang gia hạn gói dịch vụ của mình.
        </Text>
      ) : null}

      <PackageDetail
        label="Thành tiền"
        value={formatCurrencyVND(plan.price.toString() || subscription.price.toString())}
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
  );
};

export default PackageDetails;
