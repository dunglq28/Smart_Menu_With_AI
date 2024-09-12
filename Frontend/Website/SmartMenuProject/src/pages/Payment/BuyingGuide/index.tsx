import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { themeColors } from "../../../constants/GlobalStyles";

import qr from "../../../assets/images/qrCode.jpg"

function BuyingGuide() {
  const navigate = useNavigate();

  return (
    <Box w="100%" h="100%" p={8} backgroundColor="#fff">
      <VStack spacing={6} align="stretch" maxWidth="1000px" mx="auto">
        <Heading as="h1" size="xl">
          Hướng dẫn thanh toán
        </Heading>

        <Text fontSize="xl">
          Bạn vui lòng chuyển khoản cho chúng tôi theo một trong các hình thức
          sau đây.
        </Text>

        <Text fontSize="xl">
          Sau khi xác nhận thông tin chuyển khoản, tài khoản của bạn sẽ được
          kích hoạt tự động. Nếu gặp bất kỳ vấn đề nào, bạn có thể liên hệ với
          chúng tôi qua fanpage hoặc gọi điện trực tiếp để được hỗ trợ.
        </Text>

        <Text fontSize="xl">
          Liên hệ{" "}
          <a
            href="https://www.facebook.com/quangdung.le.1654/"
            style={{ color: themeColors.primaryButton, fontWeight: "bold" }}
          >
            fanpage của Smart Menu
          </a>
          . Hotline hỗ trợ kích hoạt:{" "}
          <span
            style={{ color: themeColors.primaryButton, fontWeight: "bold" }}
          >
            096-128-7613
          </span>
        </Text>

        <Divider />
        <VStack align="start" pl="20px" lineHeight={2}>
          <ul>
            <li>
              <Text as="b" fontSize="xl">
                Ngân hàng Techcombank - Ngân hàng thương mại cổ phần Kỹ Thương
                Việt Nam
              </Text>
            </li>
            <ul style={{ paddingLeft: 20 }}>
              <li>
                <Text fontSize="xl">
                  Chủ TK:{" "}
                  <b>LE QUANG DUNG</b>
                </Text>
              </li>
              <li>
                <Text fontSize="xl">
                  Số tài khoản: <b className="font-12">1903 7874 0450 14</b>
                </Text>
              </li>
              <li>
                <Text fontSize="xl">
                  Nội dung chuyển khoản: Tên + SĐT đặt hàng
                </Text>
              </li>
              <li>
                <Box>
                  <Text fontSize="xl" mb="4px">
                    Quét mã QR{" "}
                  </Text>
                </Box>
                <Box
                  id="collapseExtrabank1"
                  className="accordion-collapse collapse show"
                >
                  <img
                    src={qr}
                    alt="QR Code"
                    style={{ width: "320px" }}
                  />
                </Box>
              </li>
            </ul>
          </ul>
        </VStack>

        <Divider />

        <Text fontSize="xl" textAlign="center">
          Khi đăng ký gói, bạn xác nhận đã đọc và đồng ý với Điều khoản và điều
          kiện giao dịch của Smart Menu.
        </Text>

        {/* <Flex justifyContent="center">
          <Button
            colorScheme="teal"
            onClick={() => navigate("/")}
            mt={4}
            size="lg"
          >
            Trở về trang chủ
          </Button>
        </Flex> */}
      </VStack>
    </Box>
  );
}

export default BuyingGuide;
