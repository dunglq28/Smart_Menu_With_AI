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
  // const params = new URLSearchParams(location.search);
  // const step = parseInt(params.get("step") || "1", 10);
  // const index =
  //   pathname === "/payment/renew-package"
  //     ? step - 1
  //     : [
  //         "/payment/payment-success",
  //         "/payment/payment-failure",
  //         "/payment/payment-cancel",
  //         "/payment/payment-guide",
  //       ].includes(pathname)
  //     ? 3
  //     : 1;

  // const { activeStep, setActiveStep } = useSteps({
  //   index: index >= 0 && index < steps.length ? index : 0,
  //   count: steps.length,
  // });

  const index = [
    "/payment/payment-success",
    "/payment/payment-failure",
    "/payment/payment-cancel",
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

  const handleClickLogo = () => {
    const userId = localStorage.getItem("UserId");
    const brandId = localStorage.getItem("brandId");
    if (!userId && !brandId) {
      navigate("/");
    } else if (!userId && brandId) {
      navigate("/brand-dashboard");
    } else if (userId && !brandId) {
      navigate("/admin-dashboard");
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
        <Flex align="center" cursor="pointer" onClick={handleClickLogo}>
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
            Menius
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
                      <StepTitle style={{ color: "rgb(118 113 113)", width: "100%" }}>
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
