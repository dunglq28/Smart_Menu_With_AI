import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import style from "./Category.module.scss";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { formatDate, getOptions } from "@/utils";
import { useDelete, useFetchData, usePagination, useSort, useUpdate } from "@/hooks";
import {
  ActionMenuCategory,
  ModalForm,
  ModalFormCategory,
  NavigationDot,
  Searchbar,
  TableComponent,
} from "@/components";
import { TableColumn } from "@/components/Table/TableColumn";
import { Icons } from "@/assets";
import { CategoryService } from "@/services";
import { CategoryData, categoryUpdate } from "@/payloads";

function Category() {
  const brandId = localStorage.getItem("BrandId");
  const {
    isOpen: isOpenCategory,
    onOpen: onOpenCategory,
    onClose: onCloseCategory,
  } = useDisclosure();

  const { currentPage, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination({});

  const { sortField, sortDirection, rotation, handleSortChange } = useSort({});

  const { data, isLoading, isInitialLoad, setIsLoading, fetchData, totalPages, totalRecords } =
    useFetchData<CategoryData>(
      {
        fetchFunction: (page, limit, searchValue) =>
          CategoryService.getCategories(Number(brandId), page, limit, searchValue),
      },
      { currentPage, rowsPerPage },
    );

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, sortField, sortDirection]);

  async function handleCreate(id: number, categoryName: string) {
    try {
      setIsLoading(true);
      const cateResult = await CategoryService.createCategory(categoryName, id);

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

  const { handleDelete } = useDelete(
    { deleteFunction: (id) => CategoryService.deleteCategory(id), fetchData },
    {
      currentPage,
      rowsPerPage,
      totalRecords,
      handlePageChange,
    },
  );

  const { handleEdit } = useUpdate<string>({
    updateFunction: (id, cateName, brandId) =>
      CategoryService.updateCategory(id, cateName, brandId),
    fetchData,
  });

  async function handleSearch(value: string) {
    fetchData(value);
  }

  const cateColumns: TableColumn<CategoryData>[] = [
    { header: "Tên danh mục", field: "categoryName", accessor: (cate) => cate.categoryName },
    { header: "ngày tạo", field: "createDate", accessor: (cate) => formatDate(cate.createDate) },
  ];

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
        <Button onClick={onOpenCategory} className={style.AddCategoryBtn}>
          <Text as="span" fontSize="25px" me={3}>
            {<Icons.addPlus />}
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
        <TableComponent
          columns={cateColumns}
          rows={data}
          rowKey="categoryId"
          handleSortClick={handleSortChange}
          selectedColumn={sortField}
          rotation={rotation}
          isLoading={isLoading}
          isInitialLoad={isInitialLoad}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          caption="Bảng quản lý loại danh mục"
          notifyNoData="Không có loại sản phẩm để hiển thị"
          renderAction={(cate: CategoryData) => (
            <ActionMenuCategory id={cate.categoryId} onDelete={handleDelete} onEdit={handleEdit} />
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

export default Category;
