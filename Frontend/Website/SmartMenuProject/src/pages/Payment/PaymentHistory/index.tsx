import {
  Badge,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import Searchbar from "../../../components/Searchbar";
import Loading from "../../../components/Loading";
import NavigationDot from "../../../components/NavigationDot/NavigationDot";
import style from "./PaymentHistory.module.scss";
import {
  formatCurrency,
  formatCurrencyVND,
  formatDateAndTime,
  getOptions,
} from "../../../utils/functionHelper";
import { PaymentData } from "../../../payloads/responses/PaymentData.model";
import { toast } from "react-toastify";
import { getPayments } from "../../../services/PaymentService";
import moment from "moment";
import { PaymentStatus } from "../../../constants/Enum";

const PagmentHistory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [data, setData] = useState<PaymentData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([5]);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchData = useCallback(
    async (searchValue?: string) => {
      try {
        setIsLoading(true);
        let result;

        const loadData = async () => {
          if (searchValue) {
            result = await getPayments(currentPage, rowsPerPage, searchValue);
          } else {
            result = await getPayments(currentPage, rowsPerPage, "");
            console.log(result);
          }
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
    [currentPage, rowsPerPage, isInitialLoad],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, currentPage, isInitialLoad]);

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

  async function handleSearch(value: string) {
    fetchData(value);
  }

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
      </Flex>
      <Flex className={style.PaymentHistory}>
        <TableContainer className={style.PaymentHistoryTbl}>
          <Table>
            <TableCaption>Bảng quản lý lịch sử thanh toán</TableCaption>
            <Thead>
              <Tr>
                <Th className={style.HeaderTbl}>Id</Th>
                <Th className={style.HeaderTbl}>Mã giao dịch</Th>
                <Th className={style.HeaderTbl}>Email</Th>
                <Th className={style.HeaderTbl}>Ngày & Giờ tạo</Th>
                <Th className={style.HeaderTbl}>Ngày & Giờ cập nhật</Th>
                <Th className={style.HeaderTbl}>Tổng tiền</Th>
                <Th className={style.HeaderTbl}>Trạng thái</Th>
                <Th className={style.HeaderTbl}>Gói</Th>
                <Th className={style.HeaderTbl}>Phương thức</Th>
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
                  <Td colSpan={10}>Không có lịch sử để hiển thị</Td>
                </Tr>
              ) : (
                data.map((payment, index) => (
                  <Tr
                    key={payment.paymentId}
                    className={style.PaymentHistoryItem}
                  >
                    <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                    <Td>#{payment.transactionId}</Td>
                    <Td>{payment.email}</Td>
                    <Td>{formatDateAndTime(payment.createdAt)}</Td>
                    <Td>{formatDateAndTime(payment.updatedAt)}</Td>
                    <Td>{formatCurrencyVND(payment.amount.toString())}</Td>
                    <Td>
                      {payment.status === PaymentStatus.Succeed ? (
                        <Badge colorScheme="green">Thành công</Badge>
                      ) : payment.status === PaymentStatus.Failed ? (
                        <Badge colorScheme="red">Thất bại</Badge>
                      ) : payment.status === PaymentStatus.Pending ? (
                        <Badge colorScheme="yellow">Chờ thanh toán</Badge>
                      ) : payment.status === PaymentStatus.Cancelled ? (
                        <Badge colorScheme="red">Đã huỷ</Badge>
                      ) : (
                        <Badge colorScheme="red">Có lỗi</Badge>
                      )}
                    </Td>
                    <Td>{payment.planName}</Td>
                    <Td>Credit Card</Td>
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
};

export default PagmentHistory;
