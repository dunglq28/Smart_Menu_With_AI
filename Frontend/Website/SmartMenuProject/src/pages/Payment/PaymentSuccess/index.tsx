import React from "react";
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

function PaymentSuccess() {
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const textSize = useBreakpointValue({ base: "md", md: "xl" });

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
        {/* Icon thành công */}
        <Icon as={AiOutlineCheckCircle} color="green.500" boxSize={24} mb={4} />

        {/* Tiêu đề */}
        <Heading as="h1" size={headingSize} mb={4}>
          Đăng ký gói Smart Menu thành công!
        </Heading>

        {/* Thông báo */}
        <Text fontSize={textSize} mb={6} px={4}>
          Cảm ơn bạn đã đăng ký. Tài khoản và mật khẩu sẽ được gửi đến email mà bạn đã đăng ký.
        </Text>

        {/* Các bước tiếp theo */}
        <VStack spacing={3} alignItems="center" mb={6} px={4}>
          <Text fontSize={textSize} fontWeight="bold">
            Các bước tiếp theo:
          </Text>
          <HStack>
            <Icon as={AiOutlineCheckCircle} color="green.500" />
            <Text fontSize={textSize}>
              Kiểm tra email để nhận thông tin tài khoản
            </Text>
          </HStack>
          <HStack>
            <Icon as={AiOutlineCheckCircle} color="green.500" />
            <Text fontSize={textSize}>Đăng nhập vào hệ thống Smart Menu</Text>
          </HStack>
          <HStack>
            <Icon as={AiOutlineCheckCircle} color="green.500" />
            <Text fontSize={textSize}>Bắt đầu tùy chỉnh và sử dụng Smart Menu</Text>
          </HStack>
        </VStack>

        {/* Nút quay về trang chủ */}
        <Button colorScheme="teal" size="lg" mb={4} width="full" maxW="300px">
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
