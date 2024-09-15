import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Flex, Image, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link as ReactRouterLink, useLocation, useNavigate } from "react-router-dom";
import style from "./Menu.module.scss";
import MenuCard from "../../components/Menu/MenuCard";
import { MenuData } from "../../payloads/responses/MenuData.model";
import { getAllMenu } from "../../services/MenuService";
import { getBrandOptions, getOptions } from "../../utils/functionHelper";
import { toast } from "react-toastify";
import NavigationDot from "../../components/NavigationDot/NavigationDot";
import Loading from "../../components/Loading";

function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<MenuData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([5]);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const brandId = localStorage.getItem("BrandId");
  const flagRef = useRef(false);

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
          setRowsPerPageOption(getBrandOptions(result.totalRecord));
          setIsLoading(false);
        };

        setTimeout(loadData, 500);
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

  const handleClickMenu = (menuId: number) => {
    navigate(`/menu/update-menu`, { state: { menuId } });
  };

  return (
    <>
      <Flex className={style.Container}>
        <Flex>
          <ChakraLink as={ReactRouterLink} to="/menu/create-menu" className={style.MenuItem}>
            <Button className={style.AddMenuBtn}>Tạo menu</Button>
          </ChakraLink>
        </Flex>
        <Flex className={style.CardContainer}>
          {data.length === 0 ? (
            <div>Không có menu để hiển thị</div>
          ) : (
            data.map((menu, index) => (
              <MenuCard key={index} menu={menu} handleClickMenu={handleClickMenu} />
            ))
          )}
        </Flex>
        <div style={{ width: "100%" }}>
          <NavigationDot
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            rowsPerPageOptions={rowsPerPageOption}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </Flex>
    </>
  );
}

export default Menu;
