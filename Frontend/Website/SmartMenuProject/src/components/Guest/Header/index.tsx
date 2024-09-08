import React from "react";
import { Box, Flex, Heading, Button, Link, Text } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box as="header" bg="gray.100" py={6} px={12} boxShadow="sm">
      <Flex justify="space-between" align="center">
        {/* Logo và tên */}
        <Flex align="center">
          <Box
            bg="teal.500"
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
          <Heading size="lg" color="teal.600">
            Smart Menu
          </Heading>
        </Flex>

        {/* Liên kết và nút */}
        <Flex justify="flex-start" align="center">
          {/* Các liên kết */}
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
            colorScheme="teal"
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
