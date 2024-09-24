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
import { TooltipItem } from "chart.js";

const menuAppearanceData = [
  { menuName: "Menu dành cho giới trẻ", count: 120 },
  { menuName: "Menu dành cho giới trung niên", count: 80 },
  { menuName: "Menu dành cho giới trẻ", count: 60 },
  { menuName: "Menu dành cho giới trẻ", count: 150 },
  { menuName: "Menu dành cho giới trẻ", count: 150 },
  { menuName: "Menu dành cho giới trẻ", count: 150 },
  { menuName: "Menu dành cho giới trẻ", count: 150 },
  { menuName: "Menu dành cho giới trẻ", count: 150 },
  { menuName: "Menu dành cho giới trẻ", count: 150 },
  { menuName: "Menu dành cho giới trẻ", count: 150 },
];

const fakeProductData = [
  { category: "Trà", count: 5 },
  { category: "Cà Phê", count: 4 },
  { category: "Đá xay", count: 3 },
  { category: "Đồ Ăn Nhẹ", count: 6 },
  { category: "Trà Sữa", count: 2 },
];

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

  const maxMenuNameLength = 4;

  const truncatedMenuAppearanceData = menuAppearanceData.map((menu) => ({
    ...menu,
    displayName:
      menu.menuName.length > maxMenuNameLength
        ? menu.menuName.substring(0, maxMenuNameLength) + "..."
        : menu.menuName,
  }));

  const barChartMenuData = {
    labels: truncatedMenuAppearanceData.map((data) => data.displayName),
    datasets: [
      {
        label: "Số lần menu xuất hiện",
        data: truncatedMenuAppearanceData.map((data) => data.count),
        backgroundColor: themeColors.revenueLightenColor,
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const lineChartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Di chuột để xem tên",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">) {
            return menuAppearanceData[tooltipItem.dataIndex].menuName;
          },
        },
      },
    },
  };

  const barChartProductData = {
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
        <Card>
          <CardBody>
            <Heading className={style.title}>Thống kê số lần xuất hiện của menu</Heading>
            <Line data={barChartMenuData} options={lineChartOptions} />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading className={style.title}>Thống kê sản phẩm theo danh mục</Heading>
            <Bar data={barChartProductData} />
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

export default BrandDashboard;
