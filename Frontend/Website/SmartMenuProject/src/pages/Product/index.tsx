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
import { IoAddCircleOutline } from "react-icons/io5";

import style from "./Product.module.scss";
import { useCallback, useEffect, useState } from "react";
import { ProductData } from "../../payloads/responses/ProductData.model";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/ProductService";
import { toast } from "react-toastify";
import moment from "moment";
import NavigationDot from "../../components/NavigationDot/NavigationDot";
import Loading from "../../components/Loading";
import ModalForm from "../../components/Modals/ModalForm/ModalForm";
import ModalFormProduct from "../../components/Modals/ModalFormProduct/ModalFormProduct";
import Searchbar from "../../components/Searchbar";
import { useLocation, useNavigate } from "react-router-dom";
import ActionMenuProduct from "../../components/ActionMenu/ActionMenuProduct/ActionMenuProduct";
import { formatCurrency, getOptions } from "../../utils/functionHelper";

function Product() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<ProductData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([5]);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const brandId = localStorage.getItem("BrandId");
  const {
    isOpen: isOpenProduct,
    onOpen: onOpenProduct,
    onClose: onCloseProduct,
  } = useDisclosure();

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

  const fetchData = useCallback(
    async (searchValue?: string) => {
      try {
        setIsLoading(true);
        let result;

        const loadData = async () => {
          if (searchValue) {
            result = await getProducts(
              Number(brandId),
              currentPage,
              rowsPerPage,
              searchValue
            );
          } else {
            result = await getProducts(
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
        };

        setTimeout(loadData, 500);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu");
        setIsLoading(false);
      }
    },
    [currentPage, rowsPerPage]
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

  async function handleCreate(productForm: FormData) {
    try {
      setIsLoading(true);
      const productResult = await createProduct(productForm);

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

  async function handleDelete(id: number) {
    try {
      const result = await deleteProduct(id);
      if (result.statusCode === 200) {
        if ((totalRecords - 1) % rowsPerPage === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          fetchData();
        }
        toast.success("Xoá sản phẩm thành công");
      }
    } catch (e) {
      toast.error("Xoá sản phẩm thất bại");
    }
  }

  async function handleEdit(id: number, productForm: FormData) {
    try {
      var result = await updateProduct(id, productForm);
      if (result.statusCode === 200) {
        fetchData();
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Cập nhật sản phẩm thất bại");
    }
  }

  async function handleSearch(value: string) {
    fetchData(value);
  }

  return (
    <Flex className={style.container}>
      <Flex className={style.searchWrapper}>
        <Searchbar onSearch={handleSearch} />
        <Button onClick={onOpenProduct} className={style.AddProductBtn}>
          <Text as="span" fontSize="25px" me={3}>
            <IoAddCircleOutline />
          </Text>
          Tạo sản phẩm
        </Button>
        <ModalForm
          formBody={
            <ModalFormProduct
              onClose={onCloseProduct}
              handleCreate={handleCreate}
              isEdit={false}
            />
          }
          onClose={onCloseProduct}
          isOpen={isOpenProduct}
          title={"Tạo mới sản phẩm"}
        />
      </Flex>
      <Flex className={style.Product}>
        <TableContainer className={style.ProductTbl}>
          <Table>
            <TableCaption>Bảng quản lý sản phẩm</TableCaption>
            <Thead>
              <Tr>
                <Th className={style.HeaderTbl}>Id</Th>
                <Th className={style.HeaderTbl}>Tên sản phẩm</Th>
                <Th className={style.HeaderTbl}>Hình ảnh</Th>
                <Th className={style.HeaderTbl}>Loại</Th>
                <Th className={style.HeaderTbl}>Giá</Th>
                <Th className={style.HeaderTbl}>Mô tả</Th>
                <Th className={style.HeaderTbl}>Ngày tạo</Th>
                <Th className={style.HeaderTbl}>Cài đặt</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={10} className={style.LoadingCell}>
                    <Loading />
                  </Td>
                </Tr>
              ) : data.length === 0 ? (
                <Tr>
                  <Td colSpan={10}>Không có sản phẩm để hiển thị</Td>
                </Tr>
              ) : (
                data.map((product, index) => (
                  <Tr key={product.productCode} className={style.ProductItem}>
                    <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                    <Td>{product.productName}</Td>
                    <Td>
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className={style.ProductImage}
                      />
                    </Td>
                    <Td>{product.categoryName}</Td>
                    <Td>{formatCurrency(product.price.toString())}</Td>
                    <Td className={style.WrapText}>{product.description}</Td>
                    <Td>{moment(product.createDate).format("DD/MM/YYYY")}</Td>
                    <Td>
                      <ActionMenuProduct
                        id={product.productId}
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

export default Product;
