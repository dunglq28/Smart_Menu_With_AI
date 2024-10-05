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
import { themeColors } from "../../constants/GlobalStyles";
import {
  formatCurrency,
  formatCurrencyVND,
  formatDate,
  formatDateAndTime,
} from "../../utils/functionHelper";
import { ChartOptions } from "chart.js/auto";
import { getDashboardAdmin } from "../../services/DashbroadService";
import { AdminDashboardData } from "../../payloads/responses/DashboarData.model";
import { getInitialAdminDashboardData } from "../../utils/initialData";
import { PaymentStatus } from "../../constants/Enum";
import CardStats from "../../components/Dashboard/CardStats";
import LineChart from "../../components/Dashboard/LineChart";
import BarChart from "../../components/Dashboard/BarChart";

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<AdminDashboardData>(getInitialAdminDashboardData());

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

  const stats = [
    {
      icon: FaUserCheck,
      label: "Người dùng",
      value: data.numberOfUsers,
      bgColor: themeColors.userStatColor,
    },
    {
      icon: FaLuggageCart,
      label: "Doanh thu",
      value: formatCurrencyVND(data.totalRevenue.toString()),
      bgColor: themeColors.revenueDarkenColor,
    },
    {
      icon: FaTrademark,
      label: "Thương hiệu",
      value: data.numberOfBrands,
      bgColor: themeColors.tradeMarkDarkenColor,
    },
  ];

  const lineChartData = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Doanh thu",
        data: data.listRevenue.sort((a, b) => a.month - b.month).map((rev) => rev.totalRevenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: themeColors.revenueLightenColor,
        fill: true,
      },
    ],
  };

  const lineChartOptions: ChartOptions<"line"> = {
    scales: {
      y: {
        beginAtZero: true,
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

  const barChartProductOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    datasets: {
      bar: {
        minBarLength: 5,
      },
    },
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const loadData = async () => {
        const { statusCode, data } = await getDashboardAdmin();
        if (statusCode === 200) {
          setData(data);
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
    <Box className={style.container_dashboard}>
      <CardStats stats={stats} />

      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} mt={8}>
        <LineChart
          title="Thống kê doanh thu theo tháng"
          data={lineChartData}
          options={lineChartOptions}
        />

        <BarChart
          title="Thống kê thương hiệu theo tháng"
          data={barChartData}
          options={barChartProductOptions}
        />
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
                              {user.fullname} - {formatDate(user.createDate)}
                            </Text>
                            <Text className={style.userName}>{user.userName}</Text>
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
                      <Th className={style.subtitle}>Ngày & Giờ tạo</Th>
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
                          {formatDateAndTime(transaction.paymentDate)}
                        </Td>
                        <Td className={style.textDescription}>
                          {formatCurrency(transaction.amount.toString())}
                        </Td>
                        <Td className={style.textDescription}>
                          {transaction.status === PaymentStatus.Succeed ? (
                            <Badge colorScheme="green">Thành công</Badge>
                          ) : transaction.status === PaymentStatus.Failed ? (
                            <Badge colorScheme="red">Thất bại</Badge>
                          ) : transaction.status === PaymentStatus.Pending ? (
                            <Badge colorScheme="yellow">Chờ thanh toán</Badge>
                          ) : transaction.status === PaymentStatus.Cancelled ? (
                            <Badge colorScheme="red">Đã huỷ</Badge>
                          ) : (
                            <Badge colorScheme="red">Có lỗi</Badge>
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
