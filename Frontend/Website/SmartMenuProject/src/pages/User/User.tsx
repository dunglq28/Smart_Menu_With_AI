import { Flex } from "@chakra-ui/react";
import style from "./User.module.scss";

import { useEffect, useState } from "react";

import { formatDate, getGender, getOptions, getRoleName } from "@/utils";
import { TableColumn } from "@/components/Table/TableColumn";
import { ActionMenuUser, NavigationDot, Searchbar, TableComponent } from "@/components";
import { useDelete, useFetchData, usePagination, useSort, useUpdate } from "@/hooks";
import { UserService } from "@/services";
import { UserData, userUpdate } from "@/payloads";

function User() {
  const [brandId, setBrandId] = useState<string | null>(localStorage.getItem("BrandId"));

  const {
    currentPage,
    rowsPerPage,
    // rowsPerPageOptions,
    // setRowsPerPageOptions,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination({});

  const { sortField, sortDirection, rotation, handleSortChange } = useSort({});

  const { data, isLoading, isInitialLoad, fetchData, totalPages, totalRecords } =
    useFetchData<UserData>(
      {
        fetchFunction: (page, limit, searchValue) =>
          UserService.getUsers(page, limit, brandId, searchValue),
      },
      { currentPage, rowsPerPage },
    );

  useEffect(() => {
    fetchData();
    // setRowsPerPageOptions(getOptions(totalRecords));
    console.log(sortField);
    console.log(sortDirection);
  }, [currentPage, rowsPerPage, sortField, sortDirection]);

  const { handleDelete } = useDelete(
    { deleteFunction: (id) => UserService.deleteUser(id, brandId), fetchData },
    {
      currentPage,
      rowsPerPage,
      totalRecords,
      handlePageChange,
    },
  );

  const { handleEdit } = useUpdate<userUpdate>({
    updateFunction: (id, data, brandId) => UserService.updateUser(id, data, brandId),
    fetchData,
  });

  async function handleSearch(value: string) {
    fetchData(value);
  }

  const userColumns: TableColumn<UserData>[] = [
    { header: "Họ và tên", field: "fullname", accessor: (user) => user.fullname },
    { header: "Tên tài khoản", field: "userName", accessor: (user) => user.userName },
    { header: "Ngày sinh", field: "dob", accessor: (user) => formatDate(user.dob) },
    { header: "Giới tính", field: "gender", accessor: (user) => getGender(user.gender) },
    { header: "Số điện thoại", field: "phone", accessor: (user) => user.phone },
    { header: "Vai trò", field: "roleId", accessor: (user) => getRoleName(user.roleId) },
    { header: "Ngày tạo", field: "createDate", accessor: (user) => formatDate(user.createDate) },
    {
      header: "Đang hoạt động",
      field: "isActive",
      accessor: (user) => (user.isActive ? "Có" : "Không"),
    },
  ];

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
      </Flex>
      <Flex className={style.User}>
        <TableComponent
          columns={userColumns}
          rows={data}
          rowKey="userCode"
          handleSortClick={handleSortChange}
          selectedColumn={sortField}
          rotation={rotation}
          isLoading={isLoading}
          isInitialLoad={isInitialLoad}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          caption="Bảng quản lý người dùng"
          notifyNoData="Không có người dùng để hiển thị"
          renderAction={(user: UserData) => (
            <ActionMenuUser id={user.userId} onDelete={handleDelete} onEdit={handleEdit} />
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

export default User;
