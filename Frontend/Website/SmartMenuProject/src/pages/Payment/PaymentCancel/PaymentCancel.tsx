import { useEffect, useState } from "react";
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
import { PaymentStatus } from "@/constants";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/assets";
import { PaymentService } from "@/services";

function PaymentCancel() {
  const navigate = useNavigate();
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const textSize = useBreakpointValue({ base: "md", md: "xl" });
  const [isRenew, setIsRenew] = useState<boolean>(false);

  useEffect(() => {
    const fetchChangePaymentStatus = async () => {
      const queryParams = new URLSearchParams(location.search);
      const paymentIdParam = queryParams.get("payment-id");
      const userIdParam = queryParams.get("user-id");
      const isRenewParam = queryParams.get("is-renew");

      if (isRenewParam) {
        setIsRenew(isRenewParam.toLowerCase() === "true");
      }

      if (paymentIdParam && userIdParam && isRenewParam) {
        const paymentId = parseInt(paymentIdParam);
        const userId = parseInt(userIdParam);

        try {
          const result = await PaymentService.updatePaymentStatus(
            paymentId,
            userId,
            PaymentStatus.Cancelled,
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
        maxW="650px" // Giới hạn chiều rộng để cân đối nội dung
        mx="auto" // Canh giữa cho nội dung
      >
        {/* Icon thanh toán bị hủy */}
        <Icon as={Icons.closeFail} color="red.500" boxSize={24} mb={4} />

        {/* Tiêu đề */}
        <Heading as="h1" size={headingSize} mb={4}>
          Thanh toán bị hủy!
        </Heading>

        {/* Thông báo */}
        <Text fontSize={textSize} mb={6} px={4}>
          Thanh toán của bạn đã bị hủy. Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ nếu bạn cần
          giúp đỡ.
        </Text>

        {/* Các bước tiếp theo */}
        <VStack spacing={3} alignItems="center" mb={6} px={4}>
          <Text fontSize={textSize} fontWeight="bold">
            Các bước tiếp theo:
          </Text>
          <HStack>
            <Icon as={Icons.closeFail} color="red.500" />
            <Text fontSize={textSize}>
              Thử lại thanh toán hoặc chọn một phương thức thanh toán khác.
            </Text>
          </HStack>
          <HStack>
            <Icon as={Icons.closeFail} color="red.500" />
            <Text fontSize={textSize}>Kiểm tra email để biết thêm thông tin nếu có vấn đề.</Text>
          </HStack>
          <HStack>
            <Icon as={Icons.closeFail} color="red.500" />
            <Text fontSize={textSize}>Liên hệ bộ phận hỗ trợ nếu bạn cần giúp đỡ.</Text>
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
      </Box>
    </Box>
  );
}

export default PaymentCancel;
