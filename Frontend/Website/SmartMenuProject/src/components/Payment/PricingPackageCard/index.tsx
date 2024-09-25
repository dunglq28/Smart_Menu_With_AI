import { Box, Heading, HStack, Icon, Text, Button } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PricingPackageType } from "../../../models/PricingPackageType";
import { themeColors } from "../../../constants/GlobalStyles";

interface PricingPackageCardProps {
  pricing: PricingPackageType;
  isRegisterNew?: boolean;
}

const PricingPackageCard: React.FC<PricingPackageCardProps> = ({ pricing, isRegisterNew = false }) => {
  const navigate = useNavigate();

  const handleClickRegister = (pricingId: number) => {
    if (!isRegisterNew) {
      navigate(`/payment/payment-infor?plan-id=${pricingId}`);
    } else {
      navigate(`/payment/renew-package?step=2&plan-id=${pricingId}`);
    }
  };

  return (
    <Box width="100%" maxW="400px" position="relative" key={pricing.id}>
      <Box mb={4}>
        <img
          src={pricing.image}
          alt={pricing.title}
          style={{ width: "100%", borderRadius: "4px" }}
        />
      </Box>
      <Box
        bg="#F5F7FA"
        p={6}
        rounded="md"
        boxShadow="lg"
        position="relative"
        maxW="90%"
        mt="-35%"
        transform="translateX(-50%)"
        left="50%"
        zIndex={1}
      >
        <Heading fontSize="24px" mb={8} color={themeColors.textColor}>
          {pricing.title}
          <Text>{pricing.price}</Text>
        </Heading>
        {pricing.features.map((feature, index) => (
          <HStack spacing={2} align="center" mb={6} key={index}>
            <Icon as={FaCheckCircle} w={6} h={6} color="teal.500" />
            <Text fontSize="20px" color="gray.600">
              {feature}
            </Text>
          </HStack>
        ))}
        <Button
          mt={6}
          bg={themeColors.primaryButton}
          colorScheme="white"
          size="lg"
          _hover={{
            borderColor: "transparent",
            bg: `${themeColors.primaryButton}`,
            opacity: 0.9,
          }}
          onClick={() => handleClickRegister(pricing.id)}
        >
          Đăng ký ngay
        </Button>
      </Box>
    </Box>
  );
};

export default PricingPackageCard;
