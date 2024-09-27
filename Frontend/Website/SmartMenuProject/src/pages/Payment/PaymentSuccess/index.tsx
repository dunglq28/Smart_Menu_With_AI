import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useBreakpointValue,
  Icon,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { updatePaymentStatus } from "../../../services/PaymentService";
import { PaymentStatus } from "../../../constants/Enum";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const textSize = useBreakpointValue({ base: "md", md: "xl" });
  const [isRenew, setIsRenew] = useState<boolean>(false);

  useEffect(() => {
    const fetchChangePaymentStatus = async () => {
      const queryParams = new URLSearchParams(location.search);
      const paymentIdParam = queryParams.get("payment-id");
      const userIdParam = queryParams.get("user-id");
      const statusParam = queryParams.get("status");
      const isRenewParam = queryParams.get("is-renew");

      if (isRenewParam) {
        setIsRenew(isRenewParam.toLowerCase() === "true");
      }

      if (statusParam != null && statusParam.toUpperCase() != "PAID") {
        navigate(
          `/payment/payment-failure?payment-id=${paymentIdParam}&user-id=${userIdParam}&is-renew=${isRenewParam}`,
        );
      }

      if (paymentIdParam && userIdParam && isRenewParam) {
        const paymentId = parseInt(paymentIdParam);
        const userId = parseInt(userIdParam);

        try {
          const result = await updatePaymentStatus(
            paymentId,
            userId,
            PaymentStatus.Succeed,
            isRenew,
          );
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error("Thông tin ID thanh toán hoặc người dùng không hợp lệ.");
      }
    };

    fetchChangePaymentStatus();
  }, []);

  const handleClickBackHome = () => {
    if (isRenew) {
      navigate("/brand-dashboard");
    } else {
    }
    navigate("/");
  };

  return (
    <Box height="100vh" bg="gray.100" w="100%" p={4}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        textAlign="center"
        maxW="650px"
        mx="auto"
      >
        {/* Icon thành công */}
        <Icon as={AiOutlineCheckCircle} color="green.500" boxSize={24} mb={4} />

        {/* Tiêu đề */}
        <Heading as="h1" size={headingSize} mb={4}>
          {isRenew ? "Gia hạn gói Smart Menu thành công!" : "Đăng ký gói Smart Menu thành công!"}
        </Heading>

        {/* Thông báo */}
        <Text fontSize={textSize} mb={6} px={4}>
          {isRenew
            ? "Cảm ơn bạn đã gia hạn gói. Tài khoản của bạn sẽ tiếp tục hoạt động với gói đã chọn."
            : "Cảm ơn bạn đã đăng ký. Tài khoản và mật khẩu sẽ được gửi đến email mà bạn đã đăng ký."}
        </Text>

        {/* Các bước tiếp theo */}
        <VStack spacing={3} alignItems="center" mb={6} px={4}>
          <Text fontSize={textSize} fontWeight="bold">
            Các bước tiếp theo:
          </Text>
          <HStack>
            <Icon as={AiOutlineCheckCircle} color="green.500" />
            <Text fontSize={textSize}>
              {isRenew
                ? "Tiếp tục sử dụng hệ thống Smart Menu với gói đã gia hạn"
                : "Kiểm tra email để nhận thông tin tài khoản"}
            </Text>
          </HStack>
          <HStack>
            <Icon as={AiOutlineCheckCircle} color="green.500" />
            <Text fontSize={textSize}>
              {isRenew ? "Không cần đăng nhập lại" : "Đăng nhập vào hệ thống Smart Menu"}
            </Text>
          </HStack>
          <HStack>
            <Icon as={AiOutlineCheckCircle} color="green.500" />
            <Text fontSize={textSize}>
              {isRenew
                ? "Tiếp tục tùy chỉnh và sử dụng Smart Menu"
                : "Bắt đầu tùy chỉnh và sử dụng Smart Menu"}
            </Text>
          </HStack>
        </VStack>

        {/* Nút quay về trang chủ */}
        <Button
          onClick={handleClickBackHome}
          colorScheme="teal"
          size="lg"
          mb={4}
          width="full"
          maxW="300px"
        >
          Quay về trang chủ
        </Button>

        {/* Nút chuyển đến trang hướng dẫn sử dụng */}
        <Button variant="outline" size="lg" colorScheme="teal" width="full" maxW="300px">
          Xem hướng dẫn sử dụng
        </Button>
      </Box>
    </Box>
  );
}

export default PaymentSuccess;
