import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BranchData } from "../../payloads/responses/BranchData.model";
import style from "./Branch.module.scss";
import {
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Loading from "../../components/Loading";
import NavigationDot from "../../components/NavigationDot/NavigationDot";
import { deleteBranch, getBranches, updateBranch } from "../../services/BranchService";
import moment from "moment";
import Searchbar from "../../components/Searchbar";
import ActionMenuBranch from "../../components/ActionMenu/ActionMenuBranch/ActionMenuBranch";
import { branchUpdate } from "../../payloads/requests/updateRequests.model";
import { getOptions } from "../../utils/functionHelper";
import { themeColors } from "../../constants/GlobalStyles";
import { getLimitBrandByUserId } from "../../services/BrandService";
import { LimitBrandData } from "../../payloads/responses/BrandData.model";
import { getInitialLimitBrandData } from "../../utils/initialData";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [branchData, setBranchData] = useState<BranchData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([5]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [limitBrand, setLimitBrand] = useState<LimitBrandData>(getInitialLimitBrandData());
  const flagRef = useRef(false);

  const getLimitBrand = async () => {
    const userId = initialUserBrandId;
    if (userId) {
      const { statusCode, data } = await getLimitBrandByUserId(userId);
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

  const fetchData = useCallback(
    async (searchValue?: string) => {
      if (!brandInfo.id) {
        toast.error("ID chi nhánh không tồn tại");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        let result;

        const loadData = async () => {
          if (searchValue) {
            result = await getBranches(brandInfo.id, currentPage, rowsPerPage, searchValue);
          } else {
            result = await getBranches(brandInfo.id, currentPage, rowsPerPage, "");
          }
          setBranchData(result.list);
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
    [currentPage, rowsPerPage, isInitialLoad, brandInfo.id],
  );

  useEffect(() => {
    getLimitBrand();
    fetchData();
  }, [fetchData, currentPage, isInitialLoad, brandInfo.id]);

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

  async function handleDelete(id: number) {
    try {
      const result = await deleteBranch(id, brandInfo.id);
      if (result.statusCode === 200) {
        getLimitBrand();
        if ((totalRecords - 1) % rowsPerPage === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          fetchData();
        }
        toast.success("Xoá chi nhánh thành công");
      }
    } catch (e) {
      toast.error("Xoá chi nhánh thất bại");
    }
  }

  async function handleEdit(branch: branchUpdate) {
    try {
      var result = await updateBranch(branch, brandInfo.id);
      if (result.statusCode === 200) {
        fetchData();
        toast.success("Cập nhật chi nhánh thành công");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Cập nhật chi nhánh thất bại");
    }
  }

  async function handleSearch(value: string) {
    fetchData(value);
  }

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
            <TableContainer className={style.BranchTbl}>
              <Table>
                <TableCaption>Bảng quản lý chi nhánh</TableCaption>
                <Thead>
                  <Tr>
                    <Th className={style.HeaderTbl}>Id</Th>
                    <Th className={style.HeaderTbl}>Thành phố</Th>
                    <Th className={style.HeaderTbl}>Địa chỉ</Th>
                    <Th className={style.HeaderTbl}>Ngày tạo</Th>
                    <Th className={style.HeaderTbl}>Đang hoạt động</Th>
                    <Th className={style.HeaderTbl}>Cài đặt</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isLoading && isInitialLoad ? (
                    <Tr>
                      <Td colSpan={10} className={style.LoadingCell}>
                        <Loading />
                      </Td>
                    </Tr>
                  ) : branchData.length === 0 ? (
                    <Tr>
                      <Td colSpan={10}>Không có chi nhánh để hiển thị</Td>
                    </Tr>
                  ) : (
                    branchData.map((branch, index) => (
                      <Tr className={style.BranchItem} key={branch.storeId}>
                        <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                        <Td>{branch.city}</Td>
                        <Td>{branch.address}</Td>
                        <Td>{moment(branch.createDate).format("DD/MM/YYYY")}</Td>
                        <Td>{branch.isActive ? "Có" : "Không"}</Td>
                        <Td>
                          <ActionMenuBranch
                            id={branch.storeId}
                            brandName={brandInfo.brandName}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                          />
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
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default Branch;
