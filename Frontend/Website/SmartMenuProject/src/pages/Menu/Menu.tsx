import { useEffect, useRef, useState } from "react";
import { Button, Flex, Text, Collapse, Box } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./Menu.module.scss";
import { toast } from "react-toastify";

import { formatDate, getOptions, translateDemographics, getInitialLimitBrandData } from "@/utils";
import { themeColors } from "@/constants";
import { useFetchData, usePagination, useSort } from "@/hooks";
import { TableColumn } from "@/components/Table/TableColumn";
import { NavigationDot, Searchbar, TableComponent } from "@/components";
import { Icons } from "@/assets";
import { BrandService, CustomerSegmentService, MenuService } from "@/services";
import { CustomerSegmentData, LimitBrandData, MenuData } from "@/payloads";

function Menu() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [segments, setSegments] = useState<{ menuId: number; segments: CustomerSegmentData[] }[]>(
    [],
  );

  const [openMenuIds, setOpenMenuIds] = useState<number[]>([]);
  const [limitBrand, setLimitBrand] = useState<LimitBrandData>(getInitialLimitBrandData());

  const initialUserBrandId = state?.userBrandId
    ? state.userBrandId
    : localStorage.getItem("UserId");
  const isAdmin = state?.userBrandId ? true : false;
  const brandId = state?.id || localStorage.getItem("BrandId") || "";
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

  const getLimitBrand = async () => {
    const userId = initialUserBrandId;
    if (userId) {
      const { statusCode, data } = await BrandService.getLimitBrandByUserId(userId);
      if (statusCode === 200) {
        setLimitBrand(data);
      }
    }
    return;
  };

  const { currentPage, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination({});

  const { sortField, sortDirection, rotation, handleSortChange } = useSort({});

  const { data, isLoading, isInitialLoad, fetchData, totalPages, totalRecords } =
    useFetchData<MenuData>(
      {
        fetchFunction: (page, limit, searchValue) =>
          MenuService.getAllMenu(Number(brandId), page, limit, searchValue),
      },
      { currentPage, rowsPerPage },
    );

  useEffect(() => {
    getLimitBrand();
    fetchData();
  }, [currentPage, rowsPerPage, sortField, sortDirection]);

  async function handleSearch(value: string) {
    fetchData(value);
  }

  const handleClickMenu = (menuId: number) => {
    navigate(`/menu/update-menu`, { state: { menuId } });
  };

  const handleClickCreate = async () => {
    if (limitBrand.numberMenu < limitBrand.maxMenu) {
      navigate("/menu/create-menu");
    } else {
      toast.error(`Bạn đã tạo đủ ${limitBrand.maxMenu} thực đơn`);
    }
  };

  const handleToggleMenu = async (menuId: number) => {
    // Kiểm tra xem đã có segments của menu này chưa
    const existingMenuSegments = segments.find((s) => s.menuId === menuId);

    // Nếu đã có, chỉ cần toggle openMenuIds mà không gọi API
    if (existingMenuSegments) {
      setOpenMenuIds((prevIds) =>
        prevIds.includes(menuId) ? prevIds.filter((id) => id !== menuId) : [...prevIds, menuId],
      );
      return;
    }

    // Nếu chưa có, gọi API để lấy segments cho menu này
    const { statusCode, data } = await CustomerSegmentService.getCustomerSegmentByMenuId(menuId);
    if (statusCode === 200) {
      // Cập nhật state segments với menuId và dữ liệu mới
      setSegments((prevSegments) => [
        ...prevSegments,
        { menuId, segments: data }, // Lưu các segment kèm theo menuId
      ]);
    }

    // Toggle openMenuIds
    setOpenMenuIds((prevIds) =>
      prevIds.includes(menuId) ? prevIds.filter((id) => id !== menuId) : [...prevIds, menuId],
    );
  };

  const menuColumns: TableColumn<MenuData>[] = [
    { header: "ngày tạo", field: "createDate", accessor: (menu) => formatDate(menu.createDate) },
    {
      header: "mô tả",
      field: "description",
      accessor: (menu) => menu.description,
      className: `${style.description_cell}`,
    },
    { header: "độ ưu tiên", field: "priority", accessor: (menu) => menu.priority },
    {
      header: "nhân khẩu học",
      field: "menuSegments",
      accessor: (menu) => renderDemographicInfo(menu.menuId),
      className: `${style.demographic_cell}`,
    },
    {
      header: "đang hoạt động",
      field: "isActive",
      accessor: (menu) => (menu.isActive ? "Có" : "Không"),
    },
  ];

  const renderDemographicInfo = (menuId: number) => (
    <>
      <Text onClick={() => handleToggleMenu(menuId)} className={style.demographic_toggle_text}>
        {openMenuIds.includes(menuId) ? "Đóng" : "Xem"}
      </Text>
      <Collapse in={openMenuIds.includes(menuId)} animateOpacity>
        <Box className={style.demographic_info}>
          {segments
            .filter((segment) => segment.menuId === menuId)
            .map((segment) =>
              segment.segments.map((seg) => (
                <Text key={seg.customerSegmentId} className={style.demographic_info_text}>
                  {`${seg.customerSegmentName}: ${translateDemographics(seg.demographic)}, ${
                    seg.age
                  } tuổi`}
                </Text>
              )),
            )}
        </Box>
      </Collapse>
    </>
  );

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Flex className={style.searchWrapperSub}>
          <Searchbar onSearch={handleSearch} />
          <Text className={style.searchWrapperCount} bg={themeColors.darken40}>
            Số thực đơn: {limitBrand.numberMenu}/{limitBrand.maxMenu}
          </Text>
        </Flex>
        {!isAdmin && (
          <Button onClick={handleClickCreate} className={style.AddMenuBtn}>
            <Text as="span" fontSize="25px" me={3}>
              <Icons.addPlus />
            </Text>
            Tạo menu
          </Button>
        )}
      </Flex>

      <Flex className={style.Menu}>
        <TableComponent
          columns={menuColumns}
          rows={data}
          rowKey="menuCode"
          handleSortClick={handleSortChange}
          selectedColumn={sortField}
          rotation={rotation}
          isLoading={isLoading}
          isInitialLoad={isInitialLoad}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          caption="Bảng quản lý thực đơn"
          notifyNoData="Không có thực đơn để hiển thị"
          renderAction={(menu: MenuData) => (
            <Button onClick={() => handleClickMenu(menu.menuId)} className={style.MenuButton}>
              Chỉnh sửa
            </Button>
          )}
        />

        <NavigationDot
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowsPerPageOptions={getOptions(totalRecords)}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Flex>
    </Flex>
  );
}

export default Menu;
