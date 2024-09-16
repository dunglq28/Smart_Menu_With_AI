import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Image,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepSeparator,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { themeColors } from "../../../constants/GlobalStyles";
import logo from "../../../assets/images/logoNoBg.png";

const steps = [
  { title: "Chọn gói" },
  { title: "Điền thông tin đăng ký & Thanh toán" },
  { title: "Kết quả" },
];

const HeaderPaymentStepper: React.FC = () => {
  const navigate = useNavigate();
  const pathname = location.pathname;
  const index = [
    "/payment/payment-success",
    "/payment/payment-failure",
    "/payment/payment-guide",
  ].includes(pathname)
    ? 3
    : 1;

  const { activeStep, setActiveStep } = useSteps({
    index: index,
    count: steps.length,
  });

  useEffect(() => {
    setActiveStep(index);
  }, [pathname, index, setActiveStep]);

  const handleNavigateAndScroll = (hash: string) => {
    if (window.location.pathname !== "/") {
      navigate("/");
    }

    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };
  const getSeparatorStyle = (status: string) => {
    switch (status) {
      case "complete":
        return { backgroundColor: themeColors.primaryButton };
      case "active":
        return { backgroundColor: "#ccc" };
      case "incomplete":
        return { backgroundColor: "#ccc" };
      default:
        return {};
    }
  };

  return (
    <Box
      as="header"
      w="100%"
      bg="gray.100"
      py={4}
      px={12}
      position="fixed"
      top="0"
      zIndex="9999"
      boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
    >
      <Flex justify="space-between" align="center" wrap="wrap">
        {/* Logo và tên */}
        <Flex align="center" cursor="pointer" onClick={() => navigate("/")}>
          <Box
            color="white"
            rounded="full"
            mr={4}
            w="70px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={logo} alt="Logo" w="100%" h="auto" />
          </Box>
          <Heading size="lg" color={themeColors.primaryButton}>
            Smart Menu
          </Heading>
        </Flex>
        {/* Stepper */}
        <Flex justify="flex-start" align="center" w="60%" pr="14px" mt={4}>
          <Stepper size="lg" index={activeStep} w="100%">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator
                  sx={{
                    "[data-status=complete] &": {
                      background: themeColors.primaryButton,
                      borderColor: themeColors.primaryButton,
                      color: "white",
                    },
                    "[data-status=active] &": {
                      background: "white",
                      borderColor: themeColors.primaryButton,
                      color: themeColors.primaryButton,
                    },
                    "[data-status=incomplete] &": {
                      background: "gray.300",
                      borderColor: "gray.400",
                      color: "rgb(118 113 113)",
                    },
                  }}
                >
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                {/* Title color based on step status */}
                <StepStatus
                  complete={
                    <Box flexShrink="0" ml={2} maxW="180px">
                      <StepTitle
                        style={{
                          color: themeColors.primaryButton,
                          width: "100%",
                        }}
                      >
                        {step.title}
                      </StepTitle>
                    </Box>
                  }
                  active={
                    <Box flexShrink="0" ml={2} maxW="180px">
                      <StepTitle
                        style={{
                          color: themeColors.primaryButton,
                          width: "100%",
                        }}
                      >
                        {step.title}
                      </StepTitle>
                    </Box>
                  }
                  incomplete={
                    <Box flexShrink="0" ml={2} maxW="180px">
                      <StepTitle
                        style={{ color: "rgb(118 113 113)", width: "100%" }}
                      >
                        {step.title}
                      </StepTitle>
                    </Box>
                  }
                />

                {index < steps.length - 1 && (
                  <StepSeparator
                    style={getSeparatorStyle(
                      index === activeStep
                        ? "active"
                        : index < activeStep
                        ? "complete"
                        : "incomplete",
                    )}
                  />
                )}
              </Step>
            ))}
          </Stepper>
        </Flex>

        <Flex justify="flex-start" align="center" mt={4}></Flex>
      </Flex>
    </Box>
  );
};

export default HeaderPaymentStepper;
