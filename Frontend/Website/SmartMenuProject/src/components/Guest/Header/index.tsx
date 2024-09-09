import React from "react";
import { Box, Flex, Heading, Button, Link, Text } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { themeColors } from "../../../constants/GlobalStyles";
import style from "./Header.module.scss";

const Header: React.FC = () => {
  const navigate = useNavigate();

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
      <Flex justify="space-between" align="center">
        {/* Logo và tên */}
        <Flex align="center">
          <Box
            bg={themeColors.primaryButton}
            color="white"
            rounded="full"
            p={3}
            mr={4}
            boxSize="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="2xl" fontWeight="bold">
              S
            </Text>
          </Box>
          <Heading size="lg" color={themeColors.primaryButton}>
            Smart Menu
          </Heading>
        </Flex>

        {/* Liên kết và nút */}
        <Flex justify="flex-start" align="center">
          <Flex align="flex-end" fontSize="lg">
            <Link href="#about" mx={5} fontWeight="bold">
              Giới thiệu
            </Link>
            <Link href="#features" mx={5} fontWeight="bold">
              Tính năng
            </Link>
            <Link href="#benefits" mx={5} fontWeight="bold">
              Lợi ích
            </Link>
            <Link href="#pricing" mx={5} fontWeight="bold">
              Bảng giá
            </Link>
          </Flex>

          {/* Nút Đăng nhập */}
          <Button
            leftIcon={<FaUser />}
            bg={themeColors.primaryButton}
            colorScheme="white"
            variant="solid"
            ml={6}
            size="lg"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
