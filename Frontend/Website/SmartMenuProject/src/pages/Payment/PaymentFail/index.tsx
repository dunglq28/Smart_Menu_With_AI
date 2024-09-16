import React, { useEffect } from "react";
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
import { AiOutlineCloseCircle } from "react-icons/ai"; // Import biểu tượng thất bại
import { updatePaymentStatus } from "../../../services/PaymentService";
import { PaymentStatus } from "../../../constants/Enum";

function PaymentFailure() {
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const textSize = useBreakpointValue({ base: "md", md: "xl" });

  useEffect(() => {
    const fetchChangePaymentStatus = async () => {
      const queryParams = new URLSearchParams(location.search);
      const paymentIdParam = queryParams.get("payment-id");
      const userIdParam = queryParams.get("user-id");

      if (paymentIdParam && userIdParam) {
        const paymentId = parseInt(paymentIdParam);
        const userId = parseInt(userIdParam);

        try {
          const result = await updatePaymentStatus(
            paymentId,
            userId,
            PaymentStatus.Failed,
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

  return (
    <Box height="100vh" bg="gray.100" w="100%" p={4}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        textAlign="center"
        maxW="650px" // Giới hạn chiều rộng để cân đối nội dung
        mx="auto" // Canh giữa cho nội dung
      >
        {/* Icon thất bại */}
        <Icon as={AiOutlineCloseCircle} color="red.500" boxSize={24} mb={4} />

        {/* Tiêu đề */}
        <Heading as="h1" size={headingSize} mb={4}>
          Thanh toán thất bại!
        </Heading>

        {/* Thông báo */}
        <Text fontSize={textSize} mb={6} px={4}>
          Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.
        </Text>

        {/* Hướng dẫn các bước khắc phục */}
        <VStack spacing={3} alignItems="center" mb={6} px={4}>
          <Text fontSize={textSize} fontWeight="bold">
            Bạn có thể thử:
          </Text>
          <HStack>
            <Icon as={AiOutlineCloseCircle} color="red.500" />
            <Text fontSize={textSize}>
              Kiểm tra lại thông tin thẻ hoặc tài khoản của bạn
            </Text>
          </HStack>
          <HStack>
            <Icon as={AiOutlineCloseCircle} color="red.500" />
            <Text fontSize={textSize}>
              Thử lại sau vài phút nếu có sự cố mạng
            </Text>
          </HStack>
          <HStack>
            <Icon as={AiOutlineCloseCircle} color="red.500" />
            <Text fontSize={textSize}>
              Liên hệ bộ phận hỗ trợ nếu vấn đề vẫn tiếp diễn
            </Text>
          </HStack>
        </VStack>

        {/* Nút quay về trang chủ */}
        <Button colorScheme="teal" size="lg" mb={4} width="full" maxW="300px">
          Quay về trang chủ
        </Button>
      </Box>
    </Box>
  );
}

export default PaymentFailure;
