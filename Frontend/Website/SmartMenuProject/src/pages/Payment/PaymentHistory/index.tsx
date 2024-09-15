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
import React, { useEffect, useState } from "react";
import Searchbar from "../../../components/Searchbar"; 
import Loading from "../../../components/Loading";
import NavigationDot from "../../../components/NavigationDot/NavigationDot";
import style from "./PaymentHistory.module.scss";
import { formatCurrency } from "../../../utils/functionHelper"; 

const PagmentHistory = () => {
  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        {/* <Searchbar onSearch={handleSearch} /> */}
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
                <Th className={style.HeaderTbl}>Ngày & Giờ</Th>
                <Th className={style.HeaderTbl}>Tổng tiền</Th>
                <Th className={style.HeaderTbl}>Phương thức</Th>
                <Th className={style.HeaderTbl}>Gói</Th>
                <Th className={style.HeaderTbl}>Trạng thái</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr className={style.PaymentHistoryItem}>
                <Td>1</Td>
                <Td>#1232321</Td>
                <Td>lequangdung232@gmail.com</Td>
                <Td>02/09/2024 - 12AM</Td>
                <Td>{formatCurrency("1000000")}</Td>
                <Td>VN Pay</Td>
                <Td>Tiêu chuẩn</Td>
                <Td>
                  <Badge colorScheme="green">Thành công</Badge>
                </Td>
              </Tr>
            </Tbody>
            {/* <Tbody>
              {isInitialLoad && isLoading ? (
                <Tr>
                  <Td colSpan={10} className={style.LoadingCell}>
                    <Loading />
                  </Td>
                </Tr>
              ) : data.length === 0 ? (
                <Tr>
                  <Td colSpan={10}>Không có người dùng để hiển thị</Td>
                </Tr>
              ) : (
                data.map((user, index) => (
                  <Tr key={user.userCode} className={style.PaymentHistoryItem}>
                    <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                    <Td>{user.fullname}</Td>
                    <Td>{user.userName}</Td>
                    <Td>{moment(user.dob).format("DD/MM/YYYY")}</Td>
                    <Td>{getGender(user.gender)}</Td>
                    <Td>{user.phone}</Td>
                    <Td>{getRoleName(user.roleId)}</Td>
                    <Td>{moment(user.createDate).format("DD/MM/YYYY")}</Td>
                    <Td>{user.isActive ? "Có" : "Không"}</Td>
                    <Td>
                      <ActionMenuUser
                        id={user.userId}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody> */}
          </Table>
        </TableContainer>

        {/* <NavigationDot
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowsPerPageOptions={rowsPerPageOption}
          onRowsPerPageChange={handleRowsPerPageChange}
        /> */}
      </Flex>
    </Flex>
  );
};

export default PagmentHistory;
