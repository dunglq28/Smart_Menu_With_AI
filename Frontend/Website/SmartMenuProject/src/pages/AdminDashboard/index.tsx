import style from "./AdminDashboard.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
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
  Grid,
} from "@chakra-ui/react";
import { FaUserCheck, FaLuggageCart, FaTrademark } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { GlobalStyles, themeColors } from "../../constants/GlobalStyles";
import { formatCurrency } from "../../utils/functionHelper";
import { ChartOptions } from "chart.js/auto";
import { getDashboardAdmin } from "../../services/DashbroadService";
import { DashboardData } from "../../payloads/responses/DashboarData.model";
import { getInitialDashboardData } from "../../utils/initialData";
import moment from "moment";

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DashboardData>(getInitialDashboardData());

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

  const lineChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Doanh thu",
        data: data.listRevenue
          .sort((a, b) => a.month - b.month)
          .map((rev) => rev.totalRevenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: themeColors.revenueLightenColor,
        fill: true,
      },
    ],
  };

  const lineChartOptions: ChartOptions<"line"> = {
    scales: {
      y: {
        ticks: {
          callback: function (value: number | string) {
            return value.toLocaleString("vi-VN");
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const barChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Thương hiệu",
        data: data.listBrandCounts
          .sort((a, b) => a.month - b.month)
          .map((brand) => brand.totalBrands),
        backgroundColor: themeColors.tradeMarkLightenColor,
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      let result;

      const loadData = async () => {
        result = await getDashboardAdmin();
        if (result.isSuccess) {
          console.log(result.data.totalRevenue);

          setData(result.data);
          setIsLoading(false);
        }
      };

      setTimeout(loadData, 500);
    } catch (err) {
      toast.error("Lỗi khi lấy dữ liệu");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!flag.current) {
      fetchData();
      flag.current = true;
    } else {
      fetchData();
    }
  }, [fetchData]);

  return (
    <Box className={style.container}>
      {/* <Heading as="h3" size="lg" mb={3} fontWeight="bold">
        Báo cáo
      </Heading> */}
      <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4}>
        <Card>
          <CardBody>
            <Grid templateColumns="auto 1fr" alignItems="center" gap={6}>
              <Box
                bg="#55AD9B"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius={4}
                p={6}
              >
                <Icon as={FaUserCheck} boxSize={10} color="#fff" />
              </Box>
              <Box>
                <Text paddingBottom={2}>Người dùng</Text>
                <Heading size="md" id="userCount">
                  {data.numberOfUsers}
                </Heading>
              </Box>
            </Grid>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Grid templateColumns="auto 1fr" alignItems="center" gap={6}>
              <Box
                bg={themeColors.revenueDarkenColor}
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius={4}
                p={6}
              >
                <Icon as={FaLuggageCart} boxSize={10} color="#fff" />
              </Box>
              <Box>
                <Text paddingBottom={2}>Doanh thu</Text>
                <Heading size="md" id="totalRevenue">
                  {formatCurrency(data.totalRevenue.toString())}
                </Heading>
              </Box>
            </Grid>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Grid templateColumns="auto 1fr" alignItems="center" gap={6}>
              <Box
                bg={themeColors.tradeMarkDarkenColor}
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius={4}
                p={6}
              >
                <Icon as={FaTrademark} boxSize={10} color="#fff" />
              </Box>
              <Box>
                <Text paddingBottom={2}>Thương hiệu</Text>
                <Heading size="md" id="brandCount">
                  15
                </Heading>
              </Box>
            </Grid>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} mt={8}>
        <Card>
          <CardBody>
            <Heading className={style.title}>
              Thống kê doanh thu theo tháng
            </Heading>
            <Line data={lineChartData} options={lineChartOptions} />
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
              <Box maxHeight="300px" maxW="380px" overflowY="auto">
                <Table className={style.tableNewUser}>
                  <Tbody>
                    {data.latestUsers.map((user, index) => (
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
                            {user.fullname.charAt(0)}
                          </Box>
                          <Box>
                            <Text className={style.userDetails}>
                              {user.fullname} -{" "}
                              {moment(user.createDate).format("DD/MM/YYYY")}
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
                    {data.recentTransactions.map((transaction, index) => (
                      <Tr key={index}>
                        <Td className={style.textDescription}>
                          <Badge
                            colorScheme="white"
                            maxW="250px"
                            whiteSpace="normal"
                            textOverflow="clip"
                            fontSize="14px"
                          >
                            Thanh toán từ {transaction.email}
                          </Badge>
                        </Td>
                        <Td className={style.textDescription}>
                          {moment(transaction.paymentDate).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </Td>
                        <Td className={style.textDescription}>
                          {formatCurrency(transaction.amount.toString())}
                        </Td>
                        <Td className={style.textDescription}>
                          {transaction.status === 1 ? (
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
