import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  Flex,
  Image,
  Button,
  Text,
} from "@chakra-ui/react";
import style from "./Drawer.module.scss";

import HeaderImg from "../../../../assets/images/menu/CreateMenu/HeaderBackground.svg";
import ProductCard from "./ProductCard";
import { ProductData } from "../../../../payloads/responses/ProductData.model";
import { CategoryData } from "../../../../payloads/responses/CategoryData.model";
import { formatCurrency } from "../../../../utils/functionHelper";
import { toast } from "react-toastify";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToMenu: (selectedProducts: ProductData[], Index: number, maxProduct: number) => void;
  products: ProductData[];
  allSelectedProducts: ProductData[];
  currentListProducts: ProductData[];
  IndexList: number;
  MaxProduct: number;
  handleChangeProductByCate: (cateId: number) => void;
  categoryOptions: CategoryData[];
  currentCategory: number;
}

const DrawerComponent: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  onAddToMenu,
  products, // Sử dụng danh sách sản phẩm từ prop
  allSelectedProducts,
  currentListProducts,
  IndexList,
  MaxProduct,
  handleChangeProductByCate,
  categoryOptions,
  currentCategory,
}) => {
  const [selectedProductsOfMenu, setSelectedProductsOfMenu] = useState<ProductData[]>([]);
  const [selectedProductsOfList, setSelectedProductsOfList] = useState<ProductData[]>([]);

  useEffect(() => {
    setSelectedProductsOfMenu(allSelectedProducts);
    setSelectedProductsOfList(currentListProducts);
  }, [currentListProducts, allSelectedProducts]);

  // Function để thêm sản phẩm đã chọn vào danh sách
  const handleAddToSelectedProducts = (product: ProductData) => {
    if (selectedProductsOfList.length == MaxProduct) {
      toast.error(`Danh sách hiện tại chỉ được chứa ${MaxProduct} sản phẩm`);
    }

    // Kiểm tra nếu sản phẩm chưa được chọn và chưa đạt MaxProduct
    if (
      !selectedProductsOfMenu.find((p) => p.productId === product.productId) &&
      selectedProductsOfList.length < MaxProduct
    ) {
      setSelectedProductsOfMenu([...selectedProductsOfMenu, product]);
      setSelectedProductsOfList([...selectedProductsOfList, product]);
    }
  };

  // Function để loại bỏ sản phẩm đã chọn khỏi danh sách
  const handleRemoveFromSelectedProducts = (productId: number) => {
    const updatedProducts = selectedProductsOfList.filter(
      (product) => product.productId !== productId,
    );
    const updatedProductsOfMenu = selectedProductsOfMenu.filter(
      (product) => product.productId !== productId,
    );
    setSelectedProductsOfMenu(updatedProductsOfMenu);
    setSelectedProductsOfList(updatedProducts);
  };

  // Function để thêm danh sách sản phẩm đã chọn vào menu
  const addToMenu = () => {
    if (selectedProductsOfList.length != MaxProduct) {
      toast.error(`Vui lòng chọn đủ ${MaxProduct} sản phẩm`);
      return;
    }

    onAddToMenu(selectedProductsOfList, IndexList, MaxProduct);
    setSelectedProductsOfList([]); // Xóa danh sách sản phẩm đã chọn sau khi thêm vào menu
    onClose(); // Đóng Drawer sau khi thêm vào menu
  };

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="full">
      <DrawerOverlay />
      <DrawerContent backgroundColor="#E3F2F1">
        <DrawerCloseButton />
        <DrawerBody>
          <Flex w="100%" height="100%" padding="20px 10px">
            {/* Left panel for categories */}
            <Flex
              height="100%"
              width="15%"
              flexDirection="column"
              rowGap="20px"
              marginTop="20px"
              borderRight="1px solid #ccc"
            >
              <Flex height="10%" width="80%" justifyContent="center" alignItems="center">
                <Text position="absolute" fontSize="1.5vw" fontWeight="bold" color="#7DD7F3">
                  Loại đồ uống
                </Text>
                <Image src={HeaderImg} />
              </Flex>
              <Flex height="90%" width="80%" flexDirection="column" rowGap="5px">
                {/* Replace with your actual category buttons */}
                {categoryOptions.map((cate) => (
                  <Button
                    key={cate.categoryId}
                    height="60px"
                    marginBottom="10px"
                    w="100%"
                    border="1px solid #ccc"
                    bg={currentCategory === cate.categoryId ? "#466d6b" : "white"}
                    color={currentCategory === cate.categoryId ? "white" : "black"}
                    _hover={{
                      bg: "#466d6b",
                      color: "#fff",
                    }}
                    onClick={() => handleChangeProductByCate(cate.categoryId)}
                  >
                    {cate.categoryName}
                  </Button>
                ))}
              </Flex>
            </Flex>
            {/* Center panel for product list */}
            <Flex
              width="65%"
              alignItems="center"
              flexDirection="column"
              borderRight="1px solid #ccc"
            >
              <Flex
                height="10%"
                width="80%"
                justifyContent="center"
                alignItems="center"
                marginTop="20px"
              >
                <Text position="absolute" fontSize="2vw" fontWeight="bold" color="#7DD7F3">
                  Sản phẩm
                </Text>
                <Image src={HeaderImg} />
              </Flex>
              <Flex
                width="95%"
                marginTop="10px"
                justifyContent="space-around"
                flexWrap="wrap"
                overflowY="auto"
                paddingTop="15px"
                paddingBottom="15px"
                rowGap="10px"
              >
                {/* Example ProductCards */}
                {products.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    isSelected={selectedProductsOfMenu.some(
                      (p) => p.productId === product.productId,
                    )}
                    onClick={() => handleAddToSelectedProducts(product)}
                  />
                ))}
                {/* End of Example ProductCards */}
              </Flex>
            </Flex>
            {/* Right panel for selected products */}
            <Flex height="100%" width="20%" alignItems="center" flexDirection="column">
              <Flex
                height="10%"
                width="80%"
                justifyContent="center"
                alignItems="center"
                marginTop="20px"
              >
                <Text position="absolute" fontSize="1.7vw" fontWeight="bold" color="#7DD7F3">
                  ĐÃ CHỌN
                </Text>
                <Image src={HeaderImg} />
              </Flex>
              <Flex height="83%" width="100%" flexDirection="column" rowGap="1vw">
                <Flex justifyContent="space-between" padding="0 1.3vw" userSelect="none">
                  <Text fontWeight="bold" color="#1b4754">
                    Tối đa: {MaxProduct}
                  </Text>
                  <Text fontWeight="bold" color="#1b4754">
                    Đã chọn: {selectedProductsOfList.length}
                  </Text>
                </Flex>
                <Flex justifyContent="space-between" padding="0 1.3vw" userSelect="none">
                  <Text fontWeight="bold" color="#1b4754">
                    Nhấn vào sản phẩm để bỏ chọn
                  </Text>
                </Flex>
                <Flex
                  width="100%"
                  flexDirection="column"
                  rowGap="20px"
                  overflow="auto"
                  margin="0 10px 0 15px"
                  padding="20px"
                  borderTop="1px solid #ccc"
                  borderBottom="1px solid #ccc"
                  borderRadius="20px"
                >
                  {selectedProductsOfList.map((product) => (
                    <Flex
                      key={product.productId}
                      height="6.5vw"
                      width="100%"
                      justifyContent="center"
                      alignItems="center"
                      padding="5px"
                      bg="#fff"
                      borderRadius="10px"
                      cursor="pointer"
                      boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;"
                      transition="0.3s"
                      userSelect="none"
                      _hover={{
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
                      }}
                      _active={{
                        transition: "0.1s",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
                      }}
                      onClick={() => handleRemoveFromSelectedProducts(product.productId)}
                    >
                      <Image src={product.imageUrl} height="80%" />
                      <Flex flexDirection="column" w="80%">
                        <Flex justifyContent="space-between">
                          <Text fontSize="0.7vw" fontWeight="bold" color="#5A3D41">
                            {product.productName}
                          </Text>
                          <Text fontSize="0.7vw" fontWeight="bold" color="#5A3D41">
                            Giá {formatCurrency(product.price.toString())}
                          </Text>
                        </Flex>
                        <Text fontSize="0.5vw" color="#5A3D41" textAlign="justify" marginTop="3px">
                          {product.description}
                        </Text>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              <Button className={style.primaryButton} onClick={addToMenu}>
                Thêm vào menu
              </Button>
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
