import { Box, Card, CardBody, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import style from "./BrandDashboard.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import CardStats from "../../components/Dashboard/CardStats";
import { themeColors } from "../../constants/GlobalStyles";
import { IoGitBranchOutline } from "react-icons/io5";
import { MdListAlt } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { Bar, Line } from "react-chartjs-2";

function BrandDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  let flag = false;

  useEffect(() => {
    if (location.state?.toastMessage && !flag) {
      toast.success(location.state.toastMessage, {
        autoClose: 2500,
      });
      flag = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const stats = [
    {
      icon: IoGitBranchOutline,
      label: "Chi nhánh",
      value: 10,
      bgColor: themeColors.userStatColor,
    },
    {
      icon: MdListAlt,
      label: "Thực đơn",
      value: 10,
      bgColor: themeColors.revenueDarkenColor,
    },
    {
      icon: AiOutlineProduct,
      label: "Sản phẩm",
      value: 10,
      bgColor: themeColors.tradeMarkDarkenColor,
    },
  ];

  const fakeProductData = [
    { category: "Trà", count: 5 },
    { category: "Cà Phê", count: 4 },
    { category: "Đá xay", count: 3 },
    { category: "Đồ Ăn Nhẹ", count: 6 },
    { category: "Trà Sữa", count: 2 },
  ];

  // const lineChartData = {
  //   labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  //   datasets: [
  //     {
  //       label: "Doanh thu",
  //       data: data.listRevenue.sort((a, b) => a.month - b.month).map((rev) => rev.totalRevenue),
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       backgroundColor: themeColors.revenueLightenColor,
  //       fill: true,
  //     },
  //   ],
  // };

  const barChartData = {
    labels: fakeProductData.map((data) => data.category),
    datasets: [
      {
        label: "Sản phẩm theo danh mục",
        data: fakeProductData.map((data) => data.count),
        backgroundColor: themeColors.tradeMarkLightenColor,
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  return (
    <Box className={style.container_dashboard}>
      <CardStats stats={stats} />

      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} mt={8}>
        {/* <Card>
          <CardBody>
            <Heading className={style.title}>Thống kê doanh thu theo tháng</Heading>
            <Line data={lineChartData} options={lineChartOptions} />
          </CardBody>
        </Card> */}

        <Card>
          <CardBody>
            <Heading className={style.title}>Thống kê sản phẩm theo danh mục</Heading>
            <Bar data={barChartData} />
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

export default BrandDashboard;
