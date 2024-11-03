import { useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import moment from "moment";
import { getInitialSubscriptionData } from "@/utils";
import { PackageDetails } from "@/components";
import { CheckoutService, SubscriptionsService } from "@/services";
import { SubscriptionData } from "@/payloads";

const RenewPackage = () => {
  const [subscription, setSubscription] = useState<SubscriptionData>(getInitialSubscriptionData());
  const today = moment();
  const effectiveDate = today.format("DD/MM/YYYY");
  const expirationDate = today.add(1, "month").format("DD/MM/YYYY");
  const [isLoading, setIsLoading] = useState(false);

  const getSubscriptionByUserId = async (): Promise<SubscriptionData | null> => {
    try {
      var userId = localStorage.getItem("UserId");
      const response = await SubscriptionsService.getSubscription(Number(userId));
      if (!response.isSuccess) {
        throw new Error("Failed to fetch Subscription");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching Subscription:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      const subscriptionData = await getSubscriptionByUserId();
      if (subscriptionData) {
        setSubscription(subscriptionData);
      }
    };
    fetchSubscription();
  }, []);

  async function handleCreatePaymentLink() {
    const result = await CheckoutService.createExtendPaymentLink(subscription.subscriptionId);

    if (result.isSuccess) {
      return (window.location.href = result.data);
    }
  }

  return (
    <Box
      p={8}
      w={{ base: "100%", md: "75%", lg: "50%" }}
      mb="2rem"
      mt="2rem"
      mx="auto"
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
    >
      {/* Heading Section */}
      <Heading mb={6} size="lg" textAlign="center">
        Gia hạn gói dịch vụ
      </Heading>

      {/* Package Details Section */}
      <PackageDetails
        subscription={subscription}
        effectiveDate={effectiveDate}
        expirationDate={expirationDate}
        isLoading={isLoading}
        isRenew={true}
        handleCreatePaymentLink={handleCreatePaymentLink}
      />
    </Box>
  );
};

export default RenewPackage;
