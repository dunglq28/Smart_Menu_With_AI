import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import style from "./Branch.module.scss";
import { Flex, Text } from "@chakra-ui/react";
import { formatDate, getOptions, getInitialLimitBrandData } from "@/utils";
import { themeColors } from "@/constants";
import { useDelete, useFetchData, usePagination, useSort, useUpdate } from "@/hooks";
import { ActionMenuBranch, NavigationDot, Searchbar, TableComponent } from "@/components";
import { TableColumn } from "@/components/Table/TableColumn";
import { BranchService, BrandService } from "@/services";
import { BranchData, branchUpdate, LimitBrandData } from "@/payloads";

function Branch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const initialId = state?.id || localStorage.getItem("BrandId") || "";
  const initialBrandName = state?.brandName || localStorage.getItem("BrandName") || "";
  const initialUserBrandId = state?.userBrandId
    ? state.userBrandId
    : localStorage.getItem("UserId");
  const initialState = { id: initialId, brandName: initialBrandName };

  const [brandInfo, setBrandInfo] = useState(initialState);
  const [limitBrand, setLimitBrand] = useState<LimitBrandData>(getInitialLimitBrandData());
  const flagRef = useRef(false);

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

  useEffect(() => {
    const toastMessage = localStorage.getItem("toastMessage");
    if (toastMessage && !flagRef.current) {
      const brandName = localStorage.getItem("brandName");
      const brandId = localStorage.getItem("brandId");
      if (brandName && brandId) {
        setBrandInfo({
          id: brandId,
          brandName: brandName,
        });
      }
      toast.success(toastMessage, {
        autoClose: 2500,
      });

      flagRef.current = true;
      localStorage.removeItem("toastMessage");
      localStorage.removeItem("brandName");
      localStorage.removeItem("brandId");
      fetchData();
    }
  }, [location.pathname, navigate, brandInfo.id]);

  const { currentPage, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination({});

  const { sortField, sortDirection, rotation, handleSortChange } = useSort({});

  const { data, isLoading, isInitialLoad, fetchData, totalPages, totalRecords } =
    useFetchData<BranchData>(
      {
        fetchFunction: (page, limit, searchValue) =>
          BranchService.getBranches(page, limit, brandInfo.id, searchValue),
      },
      { currentPage, rowsPerPage },
    );

  const fetchBranchData = useCallback(async () => {
    if (!brandInfo.id) {
      toast.error("ID chi nhánh không tồn tại");
      return;
    }

    try {
      await fetchData();
    } catch (err) {
      toast.error("Lỗi khi lấy dữ liệu");
    }
  }, [currentPage, rowsPerPage, sortField, sortDirection, brandInfo.id]);

  useEffect(() => {
    getLimitBrand();
    fetchBranchData();
  }, [currentPage, isInitialLoad, brandInfo.id]);

  const { handleDelete } = useDelete(
    { deleteFunction: (id) => BranchService.deleteBranch(id, brandInfo.id), fetchData },
    {
      currentPage,
      rowsPerPage,
      totalRecords,
      handlePageChange,
    },
  );

  const { handleEdit } = useUpdate<branchUpdate>({
    updateFunction: (id, data) => BranchService.updateBranch(id, data, brandInfo.id),
    fetchData,
  });

  async function handleSearch(value: string) {
    fetchData(value);
  }

  const branchColumns: TableColumn<BranchData>[] = [
    { header: "thành phố", field: "city", accessor: (branch) => branch.city },
    { header: "địa chỉ", field: "address", accessor: (branch) => branch.address },
    {
      header: "ngày tạo",
      field: "createDate",
      accessor: (branch) => formatDate(branch.createDate),
    },
    {
      header: "đang hoạt động",
      field: "isActive",
      accessor: (branch) => (branch.isActive ? "Có" : "Không"),
    },
  ];

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Flex className={style.searchWrapperSub}>
          <Searchbar onSearch={handleSearch} />
          <Text className={style.searchWrapperCount} bg={themeColors.darken40}>
            Số chi nhánh: {limitBrand.numberAccount}/{limitBrand.maxAccount}
          </Text>
        </Flex>
      </Flex>

      <Flex className={style.Branch}>
        {!brandInfo.id ? (
          <Flex justifyContent="center" alignItems="center" height="50vh">
            <p>ID chi nhánh không tồn tại. Vui lòng kiểm tra lại.</p>
          </Flex>
        ) : (
          <>
            <TableComponent
              columns={branchColumns}
              rows={data}
              rowKey="storeCode"
              handleSortClick={handleSortChange}
              selectedColumn={sortField}
              rotation={rotation}
              isLoading={isLoading}
              isInitialLoad={isInitialLoad}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              caption="Bảng quản lý chi nhánh"
              notifyNoData="Không có chi nhánh để hiển thị"
              renderAction={(branch: BranchData) => (
                <ActionMenuBranch
                  id={branch.storeId}
                  brandName={brandInfo.brandName}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              )}
            />

            <NavigationDot
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              rowsPerPageOptions={getOptions(totalRecords)}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default Branch;
