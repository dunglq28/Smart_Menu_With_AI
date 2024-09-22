import {
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
import style from "./Category.module.scss";
import Searchbar from "../../components/Searchbar";
import { useCallback, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { CategoryData } from "../../payloads/responses/CategoryData.model";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/CategoryService";
import { toast } from "react-toastify";
import moment from "moment";
import NavigationDot from "../../components/NavigationDot/NavigationDot";
import { IoAddCircleOutline } from "react-icons/io5";
import ModalForm from "../../components/Modals/ModalForm/ModalForm";
import ModalFormCategory from "../../components/Modals/ModalFormCategory/ModalFormCategory";
import ActionMenuCategory from "../../components/ActionMenu/ActionMenuCategory/ActionMenuCategory";
import { getOptions } from "../../utils/functionHelper";
import { useLocation } from "react-router-dom";

function Category() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [data, setData] = useState<CategoryData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([5]);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const brandId = localStorage.getItem("BrandId");
  const {
    isOpen: isOpenCategory,
    onOpen: onOpenCategory,
    onClose: onCloseCategory,
  } = useDisclosure();

  const fetchData = useCallback(
    async (searchValue?: string) => {
      try {
        setIsLoading(true);
        let result;

        const loadData = async () => {
          if (searchValue) {
            result = await getCategories(
              Number(brandId),
              currentPage,
              rowsPerPage,
              searchValue
            );
          } else {
            result = await getCategories(
              Number(brandId),
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
          setIsInitialLoad(false);
        };

        if (isInitialLoad) {
          setTimeout(loadData, 500);
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
  }, [fetchData]);

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

  async function handleCreate(id: number, categoryName: string) {
    try {
      setIsLoading(true);
      const cateResult = await createCategory(categoryName, id);

      if (cateResult.statusCode === 200) {
        fetchData();
        toast.success("Thêm loại sản phẩm thành công");
        onCloseCategory();
      } else {
        toast.error(cateResult.message);
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }

  async function handleDelete(id: number) {
    try {
      const result = await deleteCategory(id);
      if (result.statusCode === 200) {
        if ((totalRecords - 1) % rowsPerPage === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          fetchData();
        }
        toast.success("Xoá loại sản phẩm thành công");
      }
    } catch (e) {
      toast.error("Xoá loại sản phẩm thất bại");
    }
  }

  async function handleEdit(
    cateId: number,
    brandId: number,
    categoryName: string,
    onClose: () => void
  ) {
    try {
      var result = await updateCategory(cateId, brandId, categoryName);
      if (result.statusCode === 200) {
        fetchData();
        toast.success("Cập nhật loại sản phẩm thành công");
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Cập nhật loại sản phẩm thất bại");
    }
  }

  async function handleSearch(value: string) {
    fetchData(value);
  }

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
        <Button onClick={onOpenCategory} className={style.AddCategoryBtn}>
          <Text as="span" fontSize="25px" me={3}>
            <IoAddCircleOutline />
          </Text>
          Tạo danh mục
        </Button>
        <ModalForm
          formBody={
            <ModalFormCategory
              onClose={onCloseCategory}
              handleCreate={handleCreate}
              isEdit={false}
            />
          }
          isEdit={false}
          onClose={onCloseCategory}
          isOpen={isOpenCategory}
          title={"Tạo mới danh mục"}
        />
      </Flex>
      <Flex className={style.Category}>
        <TableContainer className={style.CategoryTbl}>
          <Table>
            <TableCaption>Bảng quản lý loại danh mục</TableCaption>
            <Thead>
              <Tr>
                <Th className={style.HeaderTbl}>Id</Th>
                <Th className={style.HeaderTbl}>Tên danh mục</Th>
                <Th className={style.HeaderTbl}>Ngày tạo</Th>
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
              ) : data.length === 0 ? (
                <Tr>
                  <Td colSpan={10}>Không có loại sản phẩm để hiển thị</Td>
                </Tr>
              ) : (
                data.map((cate, index) => (
                  <Tr key={cate.categoryId} className={style.CategoryItem}>
                    <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                    <Td>{cate.categoryName}</Td>
                    <Td>{moment(cate.createDate).format("DD/MM/YYYY")}</Td>
                    <Td>
                      <ActionMenuCategory
                        id={cate.categoryId}
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

export default Category;
