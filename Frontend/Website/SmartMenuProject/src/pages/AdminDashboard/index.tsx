import style from "./AdminDashboard.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  Heading,
  Icon,
  Table,
  Tbody,
  Tr,
  Td,
  Badge,
  Thead,
  Th,
  GridItem,
} from "@chakra-ui/react";
import { FaUserCheck, FaLuggageCart, FaTrademark } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { GlobalStyles, themeColors } from "../../constants/GlobalStyles";
import { formatCurrency } from "../../utils/functionHelper";

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const flag = useRef(false);

  useEffect(() => {
    if (location.state?.toastMessage && !flag.current) {
      toast.success(location.state.toastMessage, {
        autoClose: 2500,
      });
      flag.current = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const users = [
    {
      fullName: "Nguyễn Văn A",
      createDate: "01/09/2024",
      userName: "plhcmgv6225SmartMenu",
    },
    {
      fullName: "Nguyễn Văn A",
      createDate: "01/09/2024",
      userName: "HighlandsSmartMenu",
    },
  ];

  const orders = [
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 2,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
    {
      userFullName: "lequangdung232@gmail.com",
      orderDate: "Sep 5, 2024, 2.15PM",
      totalPrice: 100000,
      status: 1,
    },
  ];

  const lineChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Doanh thu",
        data: [500000, 1000000, 1500000, 2000000, 2000000, 4000000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: themeColors.revenueLightenColor,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Thương hiệu",
        data: [10, 20, 15, 30, 25, 25, 25, 25, 25, 25, 0, 0],
        backgroundColor: themeColors.tradeMarkLightenColor,
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  return (
    <Box className={style.container}>
      {/* <Heading as="h3" size="lg" mb={3} fontWeight="bold">
        Báo cáo
      </Heading> */}
      <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4}>
        <Card>
          <CardBody>
            <Icon as={FaUserCheck} boxSize={12} color="#55AD9B" />
            <Text>Người dùng</Text>
            <Heading size="md" id="userCount">
              10
            </Heading>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Icon
              as={FaLuggageCart}
              boxSize={12}
              color={themeColors.revenueDarkenColor}
            />
            <Text>Doanh thu</Text>
            <Heading size="md" id="totalRevenue">
              {formatCurrency("10000000")}
            </Heading>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Icon
              as={FaTrademark}
              boxSize={12}
              color={themeColors.tradeMarkDarkenColor}
            />
            <Text>Thương hiệu</Text>
            <Heading size="md" id="brandCount">
              15
            </Heading>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} mt={8}>
        <Card>
          <CardBody>
            <Heading className={style.title}>
              Thống kê doanh thu theo tháng
            </Heading>
            <Line data={lineChartData} />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading className={style.title}>
              Thống kê thương hiệu theo tháng
            </Heading>
            <Bar data={barChartData} />
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4} mt={8}>
        <GridItem colSpan={1}>
          <Card>
            <CardBody>
              <Heading className={style.title}>Người dùng mới</Heading>
              <Box maxHeight="300px" maxW="350px" overflowY="auto">
                <Table className={style.tableNewUser}>
                  <Tbody>
                    {users.map((user, index) => (
                      <Tr key={index}>
                        <Td className={style.userInfo}>
                          <Box
                            className={style.avatar}
                            bg="#55AD9B"
                            color="white"
                            rounded="full"
                            display="inline-block"
                            p={2}
                          >
                            {user.fullName.charAt(0)}
                          </Box>
                          <Box>
                            <Text className={style.userDetails}>
                              {user.fullName} - {user.createDate}
                            </Text>
                            <Text className={style.userName}>
                              {user.userName}
                            </Text>
                          </Box>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={2}>
          <Card>
            <CardBody>
              <Heading className={style.title}>Lịch sử giao dịch</Heading>
              <Box maxHeight="300px" overflowY="auto">
                <Table className={style.tablePaymentHistory}>
                  <Thead>
                    <Tr>
                      <Th className={style.subtitle}>Người dùng</Th>
                      <Th className={style.subtitle}>Ngày & Giờ</Th>
                      <Th className={style.subtitle}>Tổng tiền</Th>
                      <Th className={style.subtitle}>Trạng thái</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orders.map((order, index) => (
                      <Tr key={index}>
                        <Td className={style.textDescription}>
                          <Badge
                            colorScheme="white"
                            maxW="250px"
                            whiteSpace="normal"
                            textOverflow="clip"
                            fontSize="14px"
                          >
                            Thanh toán từ {order.userFullName}
                          </Badge>
                        </Td>
                        <Td className={style.textDescription}>
                          {order.orderDate}
                        </Td>
                        <Td className={style.textDescription}>
                          {formatCurrency(order.totalPrice.toString())}
                        </Td>
                        <Td className={style.textDescription}>
                          {order.status === 1 ? (
                            <Badge colorScheme="green">Thành công</Badge>
                          ) : (
                            <Badge colorScheme="red">Thất bại</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}

export default AdminDashboard;
