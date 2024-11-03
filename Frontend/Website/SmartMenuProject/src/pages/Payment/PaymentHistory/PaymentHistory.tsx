import { Badge, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import style from "./PaymentHistory.module.scss";
import { formatCurrencyVND, formatDateAndTime, getOptions } from "@/utils";
import { PaymentStatus } from "@/constants";
import { useFetchData, usePagination, useSort } from "@/hooks";
import { TableColumn } from "@/components/Table/TableColumn";
import { NavigationDot, Searchbar, TableComponent } from "@/components";
import { PaymentService } from "@/services";
import { PaymentData } from "@/payloads";

const PagmentHistory = () => {
  const { currentPage, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination({});

  const { sortField, sortDirection, rotation, handleSortChange } = useSort({});

  const { data, isLoading, isInitialLoad, fetchData, totalPages, totalRecords } =
    useFetchData<PaymentData>(
      {
        fetchFunction: (page, limit, searchValue) =>
          PaymentService.getPayments(page, limit, searchValue),
      },
      { currentPage, rowsPerPage },
    );

  useEffect(() => {
    fetchData();
    // console.log(sortField);
    // console.log(sortDirection);
  }, [currentPage, rowsPerPage, sortField, sortDirection]);

  async function handleSearch(value: string) {
    fetchData(value);
  }

  const paymentColumns: TableColumn<PaymentData>[] = [
    { header: "Mã giao dịch", field: "transactionId", accessor: (pay) => `#${pay.transactionId}` },
    { header: "Email", field: "email", accessor: (pay) => pay.email },
    {
      header: "Ngày & Giờ tạo",
      field: "createdAt",
      accessor: (pay) => formatDateAndTime(pay.createdAt),
    },
    {
      header: "Ngày & Giờ cập nhật",
      field: "updatedAt",
      accessor: (pay) => formatDateAndTime(pay.updatedAt),
    },
    {
      header: "tổng tiền",
      field: "amount",
      accessor: (pay) => formatCurrencyVND(pay.amount.toString()),
    },
    {
      header: "trạng thái",
      field: "status",
      accessor: (pay) =>
        pay.status === PaymentStatus.Succeed ? (
          <Badge colorScheme="green">Thành công</Badge>
        ) : pay.status === PaymentStatus.Failed ? (
          <Badge colorScheme="red">Thất bại</Badge>
        ) : pay.status === PaymentStatus.Pending ? (
          <Badge colorScheme="yellow">Chờ thanh toán</Badge>
        ) : pay.status === PaymentStatus.Cancelled ? (
          <Badge colorScheme="red">Đã huỷ</Badge>
        ) : (
          <Badge colorScheme="red">Có lỗi</Badge>
        ),
    },
    { header: "Gói", field: "planName", accessor: (pay) => pay.planName },
    {
      header: "Phương thức",
      field: "subscriptionId",
      isSort: false,
      accessor: (pay) => "Credit Card",
    },
  ];

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
      </Flex>
      <Flex className={style.PaymentHistory}>
        <TableComponent
          columns={paymentColumns}
          rows={data}
          rowKey="paymentId"
          handleSortClick={handleSortChange}
          selectedColumn={sortField}
          rotation={rotation}
          isLoading={isLoading}
          isInitialLoad={isInitialLoad}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          caption="Bảng quản lý lịch sử thanh toán"
          notifyNoData="Không có lịch sử để hiển thị"
          isView={true}
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
};

export default PagmentHistory;
