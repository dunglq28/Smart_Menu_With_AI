import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";

import style from "./Product.module.scss";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, getOptions } from "@/utils";
import { useDelete, useFetchData, usePagination, useSort, useUpdate } from "@/hooks";
import { TableColumn } from "@/components/Table/TableColumn";
import {
  ActionMenuProduct,
  ModalForm,
  ModalFormProduct,
  NavigationDot,
  Searchbar,
  TableComponent,
} from "@/components";
import { Icons } from "@/assets";
import { ProductService } from "@/services";
import { ProductData } from "@/payloads";

function Product() {
  const brandId = localStorage.getItem("BrandId");
  const { isOpen: isOpenProduct, onOpen: onOpenProduct, onClose: onCloseProduct } = useDisclosure();

  const location = useLocation();
  const navigate = useNavigate();
  let flag = false;

  useEffect(() => {
    if (location.state?.toastMessage && !flag) {
      toast.success(location.state.toastMessage, {
        autoClose: 2500,
      });
      flag = true;
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const { currentPage, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination({});

  const { sortField, sortDirection, rotation, handleSortChange } = useSort({});

  const { data, isLoading, setIsLoading, fetchData, totalPages, totalRecords } =
    useFetchData<ProductData>(
      {
        fetchFunction: (page, limit, searchValue) =>
          ProductService.getProducts(Number(brandId), page, limit, searchValue),
        isAllLoad: true,
      },
      { currentPage, rowsPerPage },
    );

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, sortField, sortDirection]);

  async function handleCreate(productForm: FormData) {
    try {
      setIsLoading(true);
      const productResult = await ProductService.createProduct(productForm);

      if (productResult.statusCode === 200) {
        fetchData();
        toast.success("Thêm sản phẩm thành công");
        onCloseProduct();
      } else {
        toast.error(productResult.message);
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }

  const { handleDelete } = useDelete(
    { deleteFunction: (id) => ProductService.deleteProduct(id), fetchData },
    {
      currentPage,
      rowsPerPage,
      totalRecords,
      handlePageChange,
    },
  );

  const { handleEdit } = useUpdate<FormData>({
    updateFunction: (id, productForm) => ProductService.updateProduct(id, productForm),
    fetchData,
  });

  async function handleSearch(value: string) {
    fetchData(value);
  }

  const productColumns: TableColumn<ProductData>[] = [
    { header: "Tên sản phẩm", field: "productName", accessor: (pro) => pro.productName },
    {
      header: "Hình ảnh",
      field: "imageUrl",
      isSort: false,
      accessor: (pro) => (
        <>
          <img src={pro.imageUrl} alt={pro.productName} className={style.ProductImage} />
        </>
      ),
    },
    { header: "Loại", field: "productName", accessor: (pro) => pro.categoryName },
    {
      header: "Giá",
      field: "price",
      accessor: (pro) => formatCurrency(pro.price.toString()),
    },
    {
      header: "Mô tả",
      field: "description",
      accessor: (pro) => pro.description,
      className: `${style.WrapText}`,
    },
    { header: "ngày tạo", field: "createDate", accessor: (pro) => formatDate(pro.createDate) },
  ];

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
        <Button onClick={onOpenProduct} className={style.AddProductBtn}>
          <Text as="span" fontSize="25px" me={3}>
            {<Icons.addPlus />}
          </Text>
          Tạo sản phẩm
        </Button>
        <ModalForm
          formBody={
            <ModalFormProduct onClose={onCloseProduct} handleCreate={handleCreate} isEdit={false} />
          }
          onClose={onCloseProduct}
          isOpen={isOpenProduct}
          title={"Tạo mới sản phẩm"}
        />
      </Flex>
      <Flex className={style.Product}>
        <TableComponent
          columns={productColumns}
          rows={data}
          rowKey="productCode"
          handleSortClick={handleSortChange}
          selectedColumn={sortField}
          rotation={rotation}
          isLoading={isLoading}
          isInitialLoad={true}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          caption="Bảng quản lý sản phẩm"
          notifyNoData="Không có sản phẩm để hiển thị"
          renderAction={(product: ProductData) => (
            <ActionMenuProduct id={product.productId} onDelete={handleDelete} onEdit={handleEdit} />
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

export default Product;
