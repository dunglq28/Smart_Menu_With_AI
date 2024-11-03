import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Text, Button, Icon, HStack, Grid, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import style from "./LandingPage.module.scss";
import { toast } from "react-toastify";

import { themeColors } from "@/constants";
import { formatCurrencyVND } from "@/utils";
import { PricingPackageType } from "@/models";
import { PricingPackageCard } from "@/components";
import { Icons, Images } from "@/assets";
import { PlanService } from "@/services";
import { PlanData } from "@/payloads";

type BusinessType = {
  icon: string;
  title: string;
  description: string;
};

type Feature = {
  icon: string;
  text: string;
};

type Benefit = {
  icon: React.ElementType;
  text: string;
};

const businessTypes: BusinessType[] = [
  {
    icon: Images.iconRestaurant,
    title: "Quán ăn",
    description: "Dễ dàng cập nhật thực đơn và tạo trải nghiệm tốt cho khách hàng.",
  },
  {
    icon: Images.iconCafe,
    title: "Chuỗi cà phê",
    description: "Tối ưu hóa quy trình phục vụ và tăng cường hiệu quả vận hành.",
  },
  {
    icon: Images.iconStore,
    title: "Dịch vụ buôn bán",
    description: "Giúp doanh nghiệp theo dõi thực đơn và nhu cầu khách hàng.",
  },
];

const features: Feature[] = [
  { icon: Images.camera, text: "Nhận diện khuôn mặt" },
  { icon: Images.menuRecommend, text: "Gợi ý thực đơn" },
  { icon: Images.menuManage, text: "Quản lý thực đơn" },
  { icon: Images.database, text: "Lưu trữ và phân tích dữ liệu khách hàng" },
];

const benefits: Benefit[] = [
  { icon: Icons.timer, text: "Tiết kiệm thời gian" },
  { icon: Icons.doubleArrowUp, text: "Tăng doanh thu" },
  { icon: Icons.doubleArrowUp, text: "Cải thiện chất lượng dịch vụ" },
  { icon: Icons.checkCircle, text: "Quản lý dễ dàng" },
  { icon: Icons.doubleArrowUp, text: "Nâng cao trải nghiệm người dùng" },
  { icon: Icons.checkCircle, text: "Tích hợp dữ liệu thông minh" },
];

function LandingPage() {
  const navigate = useNavigate();
  const [pricingPackages, setPricingPackages] = useState<PricingPackageType[]>([]);

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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const result = await PlanService.getPlans();
        if (result.isSuccess) {
          const packages: PricingPackageType[] = result.data.map(
            (plan: PlanData, index: number) => ({
              id: plan.planId,
              image: [Images.basicPackage, Images.standardPackage, Images.premiumPackage][index],
              title: plan.planName,
              price: `${formatCurrencyVND(plan.price.toString())}/tháng`,
              features: [
                `${plan.maxMenu} lượt tạo thực đơn`,
                `${plan.maxAccount} lượt tạo chi nhánh`,
              ],
            }),
          );
          setPricingPackages(packages);
        } else {
          toast.error("Không có dữ liệu kế hoạch");
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu gói dịch vụ", err);
      }
    };

    fetchPlans();
  }, []);

  return (
    <>
      <Flex direction="column" align="center" justify="center" w="100%" h="auto">
        <Box id="about" py={24} px={24} bg="#F5F7FA" w="100%">
          <Flex align="center" justify="space-around">
            <Box textAlign="start">
              <Heading size="2xl" mb={4} color={themeColors.textColor}>
                Dịch vụ Smart Menu
              </Heading>
              <Text fontSize="xl" fontWeight="bold" color={themeColors.textColor}>
                - Menu thông minh
              </Text>
              <Text fontSize="xl" fontWeight="bold" color={themeColors.textColor}>
                - Nhanh chóng
              </Text>
              <Text fontSize="xl" fontWeight="bold" color={themeColors.textColor}>
                - Tiện lợi
              </Text>

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
                onClick={() => handleNavigateAndScroll("pricing")}
              >
                Đăng ký ngay
              </Button>
            </Box>

            <Box
              width="40%"
              bg="#F5F7FA"
              _hover={{
                transform: "scale(1.2)",
                transition: "transform 0.3s ease-in-out",
                willChange: "transform",
              }}
              transition="transform 0.3s ease-in-out"
            >
              <img src={Images.menuSample} alt="Dịch vụ Smart Menu" className={style.img} />
            </Box>
          </Flex>
        </Box>

        {/* Giới thiệu */}
        <Box py={8} px={24} textAlign="center" bg="#fff" w="100%">
          <Flex align="center" justify="flex-start">
            <Box minW="25%" textAlign="start">
              <img
                src={Images.landingImage1}
                alt="Dịch vụ Smart Menu"
                className={style.imgBgWhite}
              />
            </Box>
            <Box textAlign="left" marginLeft="6rem">
              <Heading className={style.title}>Smart Menu là gì?</Heading>
              <Text fontSize="xl" color="gray.600" lineHeight="tall">
                Dự án <strong>SmartMenu</strong> là một hệ thống quản lý thực đơn nhà hàng thông
                minh, sử dụng công nghệ trí tuệ nhân tạo (AI) và nhận diện khuôn mặt để phân tích
                nhân khẩu học của khách hàng như độ tuổi, giới tính. Từ đó, hệ thống đưa ra gợi ý
                thực đơn cá nhân hóa theo từng khách hàng và thời gian trong ngày.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box py={16} px={8} textAlign="center" w="100%" bg="#F5F7FA">
          {/* Tiêu đề chính */}
          <Box mb={8}>
            <Heading className={style.title}>Tối ưu quản lý thực đơn với Smart Menu</Heading>
            <Text fontSize="20px" color="gray.600">
              Smart Menu phù hợp với
            </Text>
          </Box>

          {/* Danh sách các doanh nghiệp phù hợp */}
          <Flex justify="space-evenly" wrap="wrap" gap={6}>
            {businessTypes.map((business, i) => (
              <Box
                key={i}
                p={6}
                rounded="md"
                maxW="280px"
                bg="white"
                boxShadow="xl"
                textAlign="center"
                _hover={{
                  transform: "scale(1.2)",
                  transition: "transform 0.3s ease-in-out",
                  willChange: "transform",
                }}
                transition="transform 0.3s ease-in-out"
              >
                <Box mb={4}>
                  <img src={business.icon} alt={business.title} width={48} />
                </Box>
                <Heading fontSize="20px" mb={2} color={themeColors.textColor}>
                  {business.title}
                </Heading>
                <Text fontSize="18px" color="gray.600" lineHeight="tall">
                  {business.description}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Tính năng */}
        <Box id="features" pb={8} px={24} textAlign="center" bg="#fff" w="100%">
          <Flex align="center" justify="flex-start">
            <Box minW="25%" textAlign="start">
              <img src={Images.featuresImage} alt="Features" className={style.imgBgWhite} />
            </Box>
            <Box textAlign="left" marginLeft="6rem">
              <Heading className={style.title} mb="50px">
                Tính năng nổi bật
              </Heading>
              <Grid templateColumns="1fr 1fr" gap={6}>
                {features.map((feature, i) => (
                  <HStack spacing={4} mb={6} key={i}>
                    <img src={feature.icon} alt={feature.text} width="40" height="40" />
                    <Text fontSize="xl" color="gray.600" lineHeight="tall">
                      {feature.text}
                    </Text>
                  </HStack>
                ))}
              </Grid>
            </Box>
          </Flex>
        </Box>

        {/* Lợi ích */}
        <Box id="benefits" py={16} px={8} bg="#F5F7FA" textAlign="center" w="100%">
          <Heading className={style.title} mb="50px">
            Lợi ích nổi bật của Smart Menu
          </Heading>
          <Flex justify="center" align="center" wrap="wrap" gap={4}>
            {/* Cột bên trái */}
            <Box>
              <VStack align="flex-start" spacing={6}>
                {benefits.slice(0, 3).map((benefit, index) => (
                  <HStack key={index}>
                    <Icon as={benefit.icon} w={6} h={6} color="teal.500" />
                    <Text fontSize="2xl" color="gray.600">
                      {benefit.text}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Hình ảnh ở giữa */}
            <Box maxW="50%">
              <img src={Images.twoLaptop} alt="Lợi ích" className={style.img} />
            </Box>

            {/* Cột bên phải */}
            <Box>
              <VStack align="flex-start" spacing={6}>
                {benefits.slice(3, 6).map((benefit, index) => (
                  <HStack key={index}>
                    <Icon as={benefit.icon} w={6} h={6} color="teal.500" />
                    <Text fontSize="2xl" color="gray.600">
                      {benefit.text}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Flex>
        </Box>

        {/* Bảng giá */}
        <Box id="pricing" py={8} px={8} bg="#fff" textAlign="center" w="100%">
          <Flex direction="column" align="center" justify="center" textAlign="center" mb={8}>
            <Heading className={style.title} p={2}>
              Chọn gói dịch vụ phù hợp cho doanh nghiệp của bạn
            </Heading>
            <Text fontSize="20px" color="gray.600" maxW="700px" textAlign="center">
              Với Smart Menu, doanh nghiệp có thể tối ưu hoá trải nghiệm khách hàng, nâng cao hiệu
              suất hoạt động, và tăng doanh thu bằng cách cung cấp thực đơn cá nhân hóa dựa trên
              nhân khẩu học của mỗi khách hàng.
            </Text>
          </Flex>
          <Flex justify="space-evenly" wrap="wrap" gap={6} pb={48}>
            {pricingPackages.map((pricing, index) => (
              <PricingPackageCard key={pricing.id} pricing={pricing} />
            ))}
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

export default LandingPage;
