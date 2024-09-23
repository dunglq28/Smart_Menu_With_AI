import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Image,
  Text,
  Link as ChakraLink,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  Collapse,
  Box,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useLocation, useNavigate } from "react-router-dom";
import style from "./Menu.module.scss";
import MenuCard from "../../components/Menu/MenuCard";
import { MenuData } from "../../payloads/responses/MenuData.model";
import { getAllMenu } from "../../services/MenuService";
import { getOptions } from "../../utils/functionHelper";
import { toast } from "react-toastify";
import NavigationDot from "../../components/NavigationDot/NavigationDot";
import Loading from "../../components/Loading";
import moment from "moment";
import Searchbar from "../../components/Searchbar";
import { IoAddCircleOutline } from "react-icons/io5";
import { getLimitBrandByUserId } from "../../services/BrandService";
import { GlobalStyles, themeColors } from "../../constants/GlobalStyles";

function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [data, setData] = useState<MenuData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([5]);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [openMenuIds, setOpenMenuIds] = useState<number[]>([]);
  const brandId = localStorage.getItem("BrandId");
  const flagRef = useRef(false);
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    if (location.state?.toastMessage && !flagRef.current) {
      toast.success(location.state.toastMessage, {
        autoClose: 2500,
      });
      flagRef.current = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const fetchData = useCallback(
    async (searchValue?: string) => {
      try {
        setIsLoading(true);
        const loadData = async () => {
          var result = await getAllMenu(Number(brandId), currentPage, rowsPerPage);

          setData(result.list);
          setTotalPages(result.totalPage);
          setTotalRecords(result.totalRecord);
          setRowsPerPageOption(getOptions(result.totalRecord));
          setIsLoading(false);
          if (isInitialLoad) {
            setIsInitialLoad(false);
          }
        };

        if (isInitialLoad) {
          setTimeout(async () => {
            await loadData();
          }, 500);
        } else {
          await loadData();
        }
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu");
        setIsLoading(false);
      }
    },
    [currentPage, rowsPerPage],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage],
  );

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setCurrentPage(1);
      setRowsPerPage(newRowsPerPage);
    },
    [setCurrentPage, setRowsPerPage],
  );

  if (isLoading) {
    return (
      <Flex className={style.Container}>
        <Loading />;
      </Flex>
    );
  }

  async function handleSearch(value: string) {
    fetchData(value);
  }

  const handleClickMenu = (menuId: number) => {
    navigate(`/menu/update-menu`, { state: { menuId } });
  };

  const handleClickCreate = async () => {
    const userId = localStorage.getItem("UserId");
    if (userId) {
      const { statusCode, data } = await getLimitBrandByUserId(userId);
      if (statusCode === 200) {
        if (data.numberMenu < data.maxMenu) {
          navigate("/menu/create-menu");
        } else {
          toast.error(`Bạn đã tạo đủ ${data.maxMenu} thực đơn`);
        }
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
      }
    }
    return;
  };

  const handleToggleMenu = (menuId: number) => {
    setOpenMenuIds((prevIds) =>
      prevIds.includes(menuId) ? prevIds.filter((id) => id !== menuId) : [...prevIds, menuId],
    );
  };

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Flex className={style.searchWrapperSub}>
          <Searchbar onSearch={handleSearch} />
          <Text className={style.searchWrapperCount} bg={themeColors.darken40}>
            Số thực đơn: 0/0
          </Text>
        </Flex>
        <Button onClick={handleClickCreate} className={style.AddMenuBtn}>
          <Text as="span" fontSize="25px" me={3}>
            <IoAddCircleOutline />
          </Text>
          Tạo menu
        </Button>
      </Flex>

      <Flex className={style.Menu}>
        <TableContainer className={style.MenuTbl}>
          <Table>
            <TableCaption>Bảng quản lý thực đơn</TableCaption>
            <Thead>
              <Tr>
                <Th className={style.HeaderTbl}>Id</Th>
                <Th className={style.HeaderTbl}>ngày tạo</Th>
                <Th className={style.HeaderTbl}>mô tả</Th>
                <Th className={style.HeaderTbl}>độ ưu tiên</Th>
                <Th className={style.HeaderTbl}>Nhân khẩu học</Th>
                <Th className={style.HeaderTbl}>cài đặt</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isInitialLoad && isLoading ? (
                <Tr>
                  <Td colSpan={10} className={style.LoadingCell}>
                    <Loading />
                  </Td>
                </Tr>
              ) : data.length === 0 ? (
                <Tr>
                  <Td colSpan={10}>Không có thực đơn để hiển thị</Td>
                </Tr>
              ) : (
                data.map((menu, index) => (
                  <Tr key={menu.menuId} className={style.MenuItem}>
                    <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                    <Td>{moment(menu.createDate).format("DD/MM/YYYY")}</Td>
                    <Td className={style.description_cell}>{menu.description || "N/A"}</Td>
                    <Td>{menu.priority || "N/A"}</Td>
                    <Td className={style.demographic_cell}>
                      <Text
                        onClick={() => handleToggleMenu(menu.menuId)}
                        className={style.demographic_toggle_text}
                      >
                        {openMenuIds.includes(menu.menuId) ? "Đóng" : "Xem"}
                      </Text>
                      <Collapse in={openMenuIds.includes(menu.menuId)} animateOpacity>
                        <Box className={style.demographic_info}>
                          <Text className={style.demographic_info_text}>
                            Phân khúc trẻ: Nữ, Buổi Chiều, 18-25 tuổi
                          </Text>
                          <Text className={style.demographic_info_text}>
                            Phân khúc trẻ: Nữ, Buổi Chiều, 18-25 tuổi
                          </Text>
                        </Box>
                      </Collapse>
                    </Td>
                    <Td>
                      <Button
                        onClick={() => handleClickMenu(menu.menuId)}
                        className={style.MenuButton}
                      >
                        Chỉnh sửa
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <NavigationDot
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowsPerPageOptions={rowsPerPageOption}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Flex>
    </Flex>
  );
}

export default Menu;
