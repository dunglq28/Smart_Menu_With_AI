import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import style from "./CustomerSegment.module.scss";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  formatDate,
  getOptions,
  translateDemographics,
  getInitialCustomerSegmentForm,
} from "@/utils";
import { CustomerSegmentForm } from "@/models";
import { useDelete, useFetchData, usePagination, useSort, useUpdate } from "@/hooks";
import { TableColumn } from "@/components/Table/TableColumn";
import {
  ActionMenuCustomerSegment,
  Loading,
  ModalError,
  ModalForm,
  ModalFormCustomerSegment,
  NavigationDot,
  Searchbar,
  TableComponent,
} from "@/components";
import { Icons } from "@/assets";
import { CustomerSegmentService } from "@/services";
import { customerSegmentCreate, CustomerSegmentData, customerSegmentUpdate } from "@/payloads";

interface ErrorState {
  hasError: boolean;
  errorMessage: string;
}

function CustomerSegment() {
  const [segmentFormData, setSegmentFormData] = useState<CustomerSegmentForm>(
    getInitialCustomerSegmentForm,
  );
  const [isErrorCusSegment, setIsErrorCusSegment] = useState<ErrorState>({
    hasError: false,
    errorMessage: "",
  });
  const brandId = Number(localStorage.getItem("BrandId"));
  const {
    isOpen: isOpenCustomerSegment,
    onOpen: onOpenCustomerSegment,
    onClose: onCloseCustomerSegment,
  } = useDisclosure();
  const {
    isOpen: isOpenModalError,
    onOpen: onOpenModalError,
    onClose: onCloseModalError,
  } = useDisclosure();

  const { currentPage, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination({});

  const { sortField, sortDirection, rotation, handleSortChange } = useSort({});

  const { data, isLoading, isInitialLoad, setIsLoading, fetchData, totalPages, totalRecords } =
    useFetchData<CustomerSegmentData>(
      {
        fetchFunction: (page, limit, searchValue) =>
          CustomerSegmentService.getCustomerSegments(Number(brandId), page, limit, searchValue),
      },
      { currentPage, rowsPerPage },
    );

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, sortField, sortDirection]);

  function resetFormData() {
    setSegmentFormData(getInitialCustomerSegmentForm);
  }

  async function handleCreate(brandId: number, segment: customerSegmentCreate) {
    try {
      setIsLoading(true);
      const cusSegmentResult = await CustomerSegmentService.createCustomerSegment(brandId, segment);

      if (cusSegmentResult.statusCode === 200) {
        fetchData();
        toast.success("Thêm phân khúc khách hàng thành công");
        onCloseCustomerSegment();
      } else {
        setIsErrorCusSegment({
          hasError: true,
          errorMessage: cusSegmentResult.message,
        });
        onCloseCustomerSegment();
        onOpenModalError();
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }

  const { handleDelete } = useDelete(
    { deleteFunction: (id) => CustomerSegmentService.deleteCustomerSegment(id), fetchData },
    {
      currentPage,
      rowsPerPage,
      totalRecords,
      handlePageChange,
    },
  );

  const { handleEdit } = useUpdate<customerSegmentUpdate>({
    updateFunction: (id, data, brandId) =>
      CustomerSegmentService.updateCustomerSegment(id, data, brandId),
    fetchData,
  });

  async function handleSearch(value: string) {
    fetchData(value);
  }

  function onOpenCustomerSegmentHandler() {
    if (
      segmentFormData.segmentName.value !== "" ||
      segmentFormData.sessions.value.length > 0 ||
      segmentFormData.ageFrom.value !== "" ||
      segmentFormData.ageTo.value !== ""
    ) {
      resetFormData();
    }
    onOpenCustomerSegment();
  }

  const cusSegColumns: TableColumn<CustomerSegmentData>[] = [
    {
      header: "Tên phân khúc khách hàng",
      field: "customerSegmentName",
      accessor: (cusSeg) => cusSeg.customerSegmentName,
    },
    {
      header: "Nhân khẩu học",
      field: "demographic",
      accessor: (cusSeg) => `${translateDemographics(cusSeg.demographic)}, ${cusSeg.age} tuổi`,
    },
    {
      header: "ngày tạo",
      field: "createDate",
      accessor: (cusSeg) => formatDate(cusSeg.createDate),
    },
  ];

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
        <Button onClick={onOpenCustomerSegmentHandler} className={style.AddCustomerSegmentBtn}>
          <Text as="span" fontSize="25px" me={3}>
            {<Icons.addPlus />}
          </Text>
          Tạo phân khúc khách hàng
        </Button>
        <ModalForm
          formBody={
            <ModalFormCustomerSegment
              onClose={onCloseCustomerSegment}
              handleCreate={handleCreate}
              formData={segmentFormData}
              setFormData={setSegmentFormData}
              isEdit={false}
            />
          }
          isEdit={false}
          onClose={onCloseCustomerSegment}
          isOpen={isOpenCustomerSegment}
          title={"Tạo mới phân khúc khách hàng"}
        />
      </Flex>
      <Flex className={style.CustomerSegment}>
        <TableComponent
          columns={cusSegColumns}
          rows={data}
          rowKey="customerSegmentId"
          handleSortClick={handleSortChange}
          selectedColumn={sortField}
          rotation={rotation}
          isLoading={isLoading}
          isInitialLoad={isInitialLoad}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          caption="Bảng quản lý phân khúc khách hàng"
          notifyNoData="Không có phân khúc khách hàng để hiển thị"
          renderAction={(cusSeg: CustomerSegmentData) => (
            <ActionMenuCustomerSegment
              formData={segmentFormData}
              setFormData={setSegmentFormData}
              id={cusSeg.customerSegmentId}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        />

        {isLoading && !isInitialLoad && (
          <ModalForm
            formBody={
              <Flex w="100%" h="300px" justifyContent="center" alignItems="center">
                <Loading />
              </Flex>
            }
            onClose={onCloseModalError}
            isOpen={isOpenModalError}
            title={"Add New Customer Segment"}
          />
        )}

        {isErrorCusSegment && !isLoading && (
          <ModalForm
            formBody={
              <ModalError
                onClose={onCloseModalError}
                onOpenPrev={onOpenCustomerSegment}
                errorMessage={isErrorCusSegment.errorMessage}
              />
            }
            onClose={onCloseModalError}
            isOpen={isOpenModalError}
            title={"Add New Customer Segment"}
          />
        )}
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

export default CustomerSegment;
