import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, Flex, Grid, Alert, AlertIcon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PricingPackageCard from "../../../components/Payment/PricingPackageCard";
import { PricingPackageType } from "../../../models/PricingPackageType";
import { getPlans } from "../../../services/PlanService";
import { PlanData } from "../../../payloads/responses/PlanResponse.model";
import { formatCurrencyVND } from "../../../utils/functionHelper";
import { toast } from "react-toastify";
import basicPackage from "../../../assets/images/basicPackage.png";
import standardPackage from "../../../assets/images/standardPackage.png";
import premiumPackage from "../../../assets/images/premiumPackage.png";
import PackageDetails from "../../../components/Payment/PackageDetails";
import moment from "moment";
import { getInitialPlanData } from "../../../utils/initialData";
import FormInput from "../../../components/Payment/FormInput";

const RenewPackage = () => {
  const [pricingPackages, setPricingPackages] = useState<PricingPackageType[]>([]);
  const [plan, setPlan] = useState<PlanData>(getInitialPlanData());
  const today = moment();
  const effectiveDate = today.format("DD/MM/YYYY");
  const expirationDate = today.add(1, "month").format("DD/MM/YYYY");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleCreatePaymentLink() {}

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
        plan={plan}
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
