import {
  Box,
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
import style from "./User.module.scss";

import React, { useCallback, useEffect, useState } from "react";
import { deleteUser, getUsers, updateUser } from "../../services/UserService";
import NavigationDot from "../../components/NavigationDot/NavigationDot";
import { UserData } from "../../payloads/responses/UserData.model";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Searchbar from "../../components/Searchbar";
import ActionMenuUser from "../../components/ActionMenu/ActionMenuUser/ActionMenuUser";
import { userUpdate } from "../../payloads/requests/updateRequests.model";
import { getGender, getOptions, getRoleName } from "../../utils/functionHelper";

function User() {
  const [brandId, setBrandId] = useState<string | null>(localStorage.getItem("BrandId"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [data, setData] = useState<UserData[]>([]);
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
            result = await getUsers(currentPage, rowsPerPage, searchValue, brandId);
          } else {
            result = await getUsers(currentPage, rowsPerPage, "", brandId);
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

  async function handleDelete(id: number) {
    try {
      var result = await deleteUser(id, brandId);
      if (result.statusCode === 200) {
        if ((totalRecords - 1) % rowsPerPage === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          fetchData();
        }
        toast.success("Xoá người dùng thành công");
      }
    } catch (e) {
      toast.error("Xoá người dùng thất bại");
    }
  }

  async function handleEdit(id: number, user: userUpdate) {
    try {
      var result = await updateUser(id, brandId, user);
      if (result.statusCode === 200) {
        fetchData();
        toast.success("Cập nhật thành công");
      }
    } catch {
      toast.error("Cập nhật thất bại");
    }
  }

  async function handleSearch(value: string) {
    fetchData(value);
  }

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
      </Flex>
      <Flex className={style.User}>
        <TableContainer className={style.UserTbl}>
          <Table>
            <TableCaption>Bảng quản lý người dùng</TableCaption>
            <Thead>
              <Tr>
                <Th className={style.HeaderTbl}>Id</Th>
                <Th className={style.HeaderTbl}>Họ và tên</Th>
                <Th className={style.HeaderTbl}>Tên tài khoản</Th>
                <Th className={style.HeaderTbl}>ngày sinh</Th>
                <Th className={style.HeaderTbl}>giới tính</Th>
                <Th className={style.HeaderTbl}>số điện thoại</Th>
                <Th className={style.HeaderTbl}>vai trò</Th>
                <Th className={style.HeaderTbl}>ngày tạo</Th>
                <Th className={style.HeaderTbl}>đang hoạt động</Th>
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
                  <Td colSpan={10}>Không có người dùng để hiển thị</Td>
                </Tr>
              ) : (
                data.map((user, index) => (
                  <Tr key={user.userCode} className={style.UserItem}>
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

export default User;
