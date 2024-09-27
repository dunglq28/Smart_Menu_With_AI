import { Box, Card, CardBody, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import style from "./BrandDashboard.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CardStats from "../../components/Dashboard/CardStats";
import { themeColors } from "../../constants/GlobalStyles";
import { IoGitBranchOutline } from "react-icons/io5";
import { MdListAlt } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { Bar, Line } from "react-chartjs-2";
import { TooltipItem } from "chart.js";
import { BrandDashboardData } from "../../payloads/responses/DashboarData.model";
import { getInitialBrandDashboardData } from "../../utils/initialData";
import { getDashboardBrand } from "../../services/DashbroadService";
import LineChart from "../../components/Dashboard/LineChart";
import BarChart from "../../components/Dashboard/BarChart";

function BrandDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const flag = useRef(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<BrandDashboardData>(getInitialBrandDashboardData());

  useEffect(() => {
    if (location.state?.toastMessage && !flag.current) {
      toast.success(location.state.toastMessage, {
        autoClose: 2500,
      });
      flag.current = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const loadData = async () => {
        const { statusCode, data } = await getDashboardBrand(
          Number(localStorage.getItem("BrandId")),
        );
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

  const stats = [
    {
      icon: IoGitBranchOutline,
      label: "Chi nhánh",
      value: data.store,
      bgColor: themeColors.userStatColor,
    },
    {
      icon: MdListAlt,
      label: "Thực đơn",
      value: data.menus,
      bgColor: themeColors.revenueDarkenColor,
    },
    {
      icon: AiOutlineProduct,
      label: "Sản phẩm",
      value: data.product,
      bgColor: themeColors.tradeMarkDarkenColor,
    },
  ];

  const maxMenuNameLength = 4;

  const truncatedMenuAppearanceData = data.timesRecomments.map((menu) => ({
    ...menu,
    displayName:
      menu.description && menu.description.length > maxMenuNameLength
        ? menu.description.substring(0, maxMenuNameLength) + "..."
        : menu.description || "",
  }));

  const barChartMenuData = {
    labels: truncatedMenuAppearanceData.map((data) => data.displayName),
    datasets: [
      {
        label: "Số lần menu xuất hiện",
        data: truncatedMenuAppearanceData.map((data) => data.times),
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
            return data.timesRecomments[tooltipItem.dataIndex].description || "";
          },
        },
      },
    },
  };

  const barChartProductData = {
    labels: data.productsByCate.map((data) => data.cateName),
    datasets: [
      {
        label: "Sản phẩm theo danh mục",
        data: data.productsByCate.map((data) => data.numberOfProduct),
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
  };

  return (
    <Box className={style.container_dashboard}>
      <CardStats stats={stats} />

      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} mt={8}>
        <LineChart
          title="Thống kê số lần xuất hiện của menu"
          data={barChartMenuData}
          options={lineChartOptions}
        />

        <BarChart
          title="Thống kê sản phẩm theo danh mục"
          data={barChartProductData}
          options={barChartProductOptions}
        />
      </SimpleGrid>
    </Box>
  );
}

export default BrandDashboard;
