import {
  Box,
  Button,
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
  useDisclosure,
} from "@chakra-ui/react";
import style from "./CustomerSegment.module.scss";

import React, { useCallback, useEffect, useState } from "react";
import NavigationDot from "../../components/NavigationDot/NavigationDot";
import moment from "moment";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Searchbar from "../../components/Searchbar";
import { customerSegmentUpdate } from "../../payloads/requests/updateRequests.model";
import { IoAddCircleOutline } from "react-icons/io5";
import ModalForm from "../../components/Modals/ModalForm/ModalForm";
import ModalFormCustomerSegment from "../../components/Modals/ModalFormCustomerSegment/ModalFormCusSegment";
import ActionMenuCustomerSegment from "../../components/ActionMenu/ActionMenuCustomerSegment/ActionMenuCusSegment";
import { getOptions, translateDemographics } from "../../utils/functionHelper";
import {
  createCustomerSegment,
  deleteCustomerSegment,
  getCustomerSegments,
  updateCustomerSegment,
} from "../../services/CustomerSegmentService";
import { CustomerSegmentData } from "../../payloads/responses/CustomerSegment.model";
import { customerSegmentCreate } from "../../payloads/requests/createRequests.model";
import ModalError from "../../components/Modals/ModalError/ModalError";
import { CustomerSegmentForm } from "../../models/SegmentForm.model";

interface ErrorState {
  hasError: boolean;
  errorMessage: string;
}

function CustomerSegment() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [data, setData] = useState<CustomerSegmentData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([5]);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const initialFormData: CustomerSegmentForm = {
    segmentName: { value: "", errorMessage: "" },
    gender: { value: "Male", errorMessage: "" },
    sessions: { value: [], errorMessage: "" },
    ageFrom: { value: "", errorMessage: "" },
    ageTo: { value: "", errorMessage: "" },
  };
  const [segmentFormData, setSegmentFormData] =
    useState<CustomerSegmentForm>(initialFormData);
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

  const fetchData = useCallback(
    async (searchValue?: string) => {
      try {
        setIsLoading(true);
        let result;

        const loadData = async () => {
          if (searchValue) {
            result = await getCustomerSegments(
              brandId,
              currentPage,
              rowsPerPage,
              searchValue
            );
          } else {
            result = await getCustomerSegments(
              brandId,
              currentPage,
              rowsPerPage,
              ""
            );
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
    [currentPage, rowsPerPage, isInitialLoad]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, currentPage, isInitialLoad]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handleRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setCurrentPage(1);
      setRowsPerPage(newRowsPerPage);
    },
    [setCurrentPage, setRowsPerPage]
  );

  function resetFormData() {
    setSegmentFormData(initialFormData);
  }

  async function handleCreate(brandId: number, segment: customerSegmentCreate) {
    try {
      setIsLoading(true);
      const cusSegmentResult = await createCustomerSegment(brandId, segment);

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

  async function handleDelete(id: number) {
    try {
      var result = await deleteCustomerSegment(id);
      if (result.statusCode === 200) {
        if ((totalRecords - 1) % rowsPerPage === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          fetchData();
        }
        toast.success("Xoá phân khúc khách hàng thành công");
      }
    } catch (e) {
      toast.error("Xoá phân khúc khách hàng thất bại");
    }
  }

  async function handleEdit(
    brandId: number,
    segmentId: number,
    segment: customerSegmentUpdate,
    onClose: () => void
  ) {
    try {
      setIsLoading(true);
      var result = await updateCustomerSegment(segmentId, brandId, segment);
      if (result.statusCode === 200) {
        fetchData();
        toast.success("Cập nhật phân khúc khách hàng thành công");
        onClose();
      } else {
        toast.error(result.message);
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }

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

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
        <Button
          onClick={onOpenCustomerSegmentHandler}
          className={style.AddCustomerSegmentBtn}
        >
          <Text as="span" fontSize="25px" me={3}>
            <IoAddCircleOutline />
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
        <TableContainer className={style.CustomerSegmentTbl}>
          <Table>
            <TableCaption>Bảng quản lý phân khúc khách hàng</TableCaption>
            <Thead>
              <Tr>
                <Th className={style.HeaderTbl}>Id</Th>
                <Th className={style.HeaderTbl}>Tên phân khúc khách hàng</Th>
                <Th className={style.HeaderTbl}>Nhân khẩu học</Th>
                <Th className={style.HeaderTbl}>Ngày tạo</Th>
                <Th className={style.HeaderTbl}>Cài đặt</Th>
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
                  <Td colSpan={10}>Không có phân khúc khách hàng để hiển thị</Td>
                </Tr>
              ) : (
                data.map((customerSegment, index) => (
                  <Tr className={style.CustomerSegmentItem}>
                    <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                    <Td>{customerSegment.customerSegmentName}</Td>
                    <Td>{`${translateDemographics(customerSegment.demographic)}, ${customerSegment.age} tuổi`}</Td>
                    <Td>
                      {" "}
                      {moment(customerSegment.createDate).format("DD/MM/YYYY")}
                    </Td>
                    <Td>
                      <ActionMenuCustomerSegment
                        formData={segmentFormData}
                        setFormData={setSegmentFormData}
                        id={customerSegment.customerSegmentId}
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
        {isLoading && !isInitialLoad && (
          <ModalForm
            formBody={
              <Flex
                w="100%"
                h="300px"
                justifyContent="center"
                alignItems="center"
              >
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
          rowsPerPageOptions={rowsPerPageOption}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Flex>
    </Flex>
  );
}

export default CustomerSegment;
