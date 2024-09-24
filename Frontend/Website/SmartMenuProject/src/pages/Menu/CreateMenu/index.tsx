import React, { useEffect, useState } from "react";
import { Flex, Text, Image } from "@chakra-ui/react";
import ModalFormCreateMenu from "../../../components/Modals/ModalFormCreateMenu";
import DrawerComponent from "../../../components/Menu/CreateMenu/DrawerComponent";
import style from "./CreateMenu.module.scss";
import fakeMenu from "../../../assets/images/menu/menuImg.png";
import { ProductData } from "../../../payloads/responses/ProductData.model";
import { CategoryData } from "../../../payloads/responses/CategoryData.model";
import { getCategoriesByBrandId } from "../../../services/CategoryService";
import { toast } from "react-toastify";
import { getProductsByCategory } from "../../../services/ProductService";
import { CustomerSegmentData } from "../../../payloads/responses/CustomerSegment.model";
import { Menu, MenuList } from "../../../models/Menu.model";
import {
  createListPosition,
  createMenu,
  createMenuList,
  createProductList,
  deleteMenu,
  getMenu,
  updateListPosition,
  updateMenu,
  updateProductList,
} from "../../../services/MenuService";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";

function CreateMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const menuId = state?.menuId || "";
  const [isOpenCreateMenu, setIsOpenCreateMenu] = useState(false);
  const [isOpenListProduct, setIsOpenListProduct] = useState(false);
  const initializeMenuListState = (listIndex: number, maxProduct: number) => ({
    listId: 0,
    listName: "",
    productData: [],
    listIndex,
    maxProduct,
  });
  const [selectedProducts1, setSelectedProducts1] = useState<MenuList>(
    initializeMenuListState(1, 4),
  );
  const [selectedProducts2, setSelectedProducts2] = useState<MenuList>(
    initializeMenuListState(2, 4),
  );
  const [selectedProducts3, setSelectedProducts3] = useState<MenuList>(
    initializeMenuListState(3, 4),
  );
  const [selectedProducts4, setSelectedProducts4] = useState<MenuList>(
    initializeMenuListState(4, 2),
  );
  const [selectedProductspotLight, setSelectedProductspotLight] = useState<MenuList>(
    initializeMenuListState(5, 1),
  );
  const [currentListProduct, setCurrentListProduct] = useState<ProductData[]>([]);
  const [allSelectedProducts, setAllSelectedProducts] = useState<ProductData[]>([]);
  const [menu, setMenu] = useState<Menu>({
    isActive: true,
    segmentId: { value: [], errorMessage: "" },
    description: { value: "", errorMessage: "" },
    menuImage: { value: null, errorMessage: "" },
    priority: { value: 0, errorMessage: "" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const brandId = Number(localStorage.getItem("BrandId"));
  const [currentListIndex, setCurrentIndex] = useState(0);
  const [maxProduct, setMaxProduct] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState<CategoryData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [startCategory, setStartCategory] = useState<number>(1);
  const [currentCategory, setCurrentCategory] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onOpenCreateMenu = () => setIsOpenCreateMenu(true);
  const onCloseCreateMenu = () => setIsOpenCreateMenu(false);

  const onOpenListProduct = (Index: number) => {
    setCurrentIndex(Index);
    switch (Index) {
      case 1:
        setCurrentListProduct(selectedProducts1.productData);
        setMaxProduct(4);
        break;
      case 2:
        setCurrentListProduct(selectedProducts2.productData);
        setMaxProduct(4);
        break;
      case 3:
        setCurrentListProduct(selectedProducts3.productData);
        setMaxProduct(4);
        break;
      case 4:
        setCurrentListProduct(selectedProducts4.productData);
        setMaxProduct(2);
        break;
      case 5:
        setCurrentListProduct(selectedProductspotLight.productData);
        setMaxProduct(1);
        break;
    }
    const allSelectedProducts = [
      ...selectedProducts1.productData,
      ...selectedProducts2.productData,
      ...selectedProducts3.productData,
      ...selectedProducts4.productData,
      ...selectedProductspotLight.productData,
    ];
    handleChangeProductByCate(startCategory);
    setAllSelectedProducts(allSelectedProducts);
    setIsOpenListProduct(true);
  };

  const onCloseListProduct = () => setIsOpenListProduct(false);

  const handleAddToMenu = (products: ProductData[], Index: number, maxProduct: number) => {
    let newMenuList: MenuList;
    switch (Index) {
      case 1:
        newMenuList = {
          ...selectedProducts1,
          productData: products,
          listIndex: Index,
          maxProduct: maxProduct,
        };
        setSelectedProducts1(newMenuList);
        break;
      case 2:
        newMenuList = {
          ...selectedProducts2,
          productData: products,
          listIndex: Index,
          maxProduct: maxProduct,
        };
        setSelectedProducts2(newMenuList);
        break;
      case 3:
        newMenuList = {
          ...selectedProducts3,
          productData: products,
          listIndex: Index,
          maxProduct: maxProduct,
        };
        setSelectedProducts3(newMenuList);
        break;
      case 4:
        newMenuList = {
          ...selectedProducts4,
          productData: products,
          listIndex: Index,
          maxProduct: maxProduct,
        };
        setSelectedProducts4(newMenuList);
        break;
      case 5:
        newMenuList = {
          ...selectedProductspotLight,
          listName: products[0].productName,
          productData: products,
          listIndex: Index,
          maxProduct: maxProduct,
        };
        setSelectedProductspotLight(newMenuList);
        break;
    }
    onCloseListProduct();
  };

  const handleChangeProductByCate = (cateId: number) => {
    const loadData = async () => {
      try {
        const result = await getProductsByCategory(brandId, cateId);
        if (result) {
          setProducts(result.list);
          setCurrentCategory(cateId);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        toast.error("Error fetching data");
      }
    };

    loadData();
  };

  const checkListNamesNotEmpty = () => {
    return (
      selectedProducts1.listName.trim() !== "" &&
      selectedProducts2.listName.trim() !== "" &&
      selectedProducts3.listName.trim() !== "" &&
      selectedProducts4.listName.trim() !== ""
    );
  };

  const handleChangeTitle = (listName: string, Index: number) => {
    let updatedMenuList: MenuList;

    switch (Index) {
      case 1:
        updatedMenuList = {
          ...selectedProducts1,
          listName: listName,
        };
        setSelectedProducts1(updatedMenuList);
        break;
      case 2:
        updatedMenuList = {
          ...selectedProducts2,
          listName: listName,
        };
        setSelectedProducts2(updatedMenuList);
        break;
      case 3:
        updatedMenuList = {
          ...selectedProducts3,
          listName: listName,
        };
        setSelectedProducts3(updatedMenuList);
        break;
      case 4:
        updatedMenuList = {
          ...selectedProducts4,
          listName: listName,
        };
        setSelectedProducts4(updatedMenuList);
        break;
      case 5:
        updatedMenuList = {
          ...selectedProductspotLight,
          listName: selectedProductspotLight.productData[0].productName,
        };
        setSelectedProductspotLight(updatedMenuList);
        break;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getCategoriesByBrandId(brandId);

        if (result) {
          setCategoryOptions(result.data);
          if (result.data.length > 0) {
            const initialCategoryId = result.data[0].categoryId;
            handleChangeProductByCate(initialCategoryId);
            setStartCategory(initialCategoryId);
            setCurrentCategory(initialCategoryId);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        toast.error("Error fetching data");
      }
    };

    loadData();
  }, []);

  const handleCreateMenu = async (menuForm: FormData) => {
    try {
      setIsLoading(true);
      const menuResult = await createMenu(menuForm);

      if (menuResult.statusCode === 200) {
        const allListProducts: MenuList[] = [];
        allListProducts.push(selectedProducts1);
        allListProducts.push(selectedProducts2);
        allListProducts.push(selectedProducts3);
        allListProducts.push(selectedProducts4);
        allListProducts.push(selectedProductspotLight);

        const listPositionResult = await createListPosition(allListProducts, brandId);

        if (listPositionResult.statusCode === 200) {
          const listAddToMenu = listPositionResult.data.map((list, index) => ({
            listId: list.listId,
            listIndex: allListProducts[index].listIndex,
          }));

          const menuListResult = await createMenuList(
            menuResult.data.menuId,
            brandId,
            listAddToMenu,
          );

          if (menuListResult.statusCode === 200) {
            const listProductDetails = listPositionResult.data.map((list, index) => ({
              listId: list.listId,
              indexProducts: allListProducts[index].productData.map((product, productIndex) => ({
                productId: product.productId,
                indexInList: productIndex + 1,
              })),
            }));

            const productListResult = await createProductList(brandId, listProductDetails);
            if (productListResult.statusCode === 200) {
              resetLists();
              const toastMessage = "Thêm mới menu thành công";
              navigate("/menu", { state: { toastMessage } });
            } else {
              toast.error(productListResult.message);
            }
          } else {
            toast.error(menuListResult.message);
          }
        } else {
          toast.error(listPositionResult.message);
        }
      } else {
        toast.error(menuResult.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetLists = () => {
    setSelectedProducts1(initializeMenuListState(1, 4));
    setSelectedProducts2(initializeMenuListState(2, 4));
    setSelectedProducts3(initializeMenuListState(3, 4));
    setSelectedProducts4(initializeMenuListState(4, 2));
    setSelectedProductspotLight(initializeMenuListState(5, 1));
    setAllSelectedProducts([]);
    setMenu({
      isActive: true,
      segmentId: { value: [], errorMessage: "" },
      description: { value: "", errorMessage: "" },
      menuImage: { value: null, errorMessage: "" },
      priority: { value: 0, errorMessage: "" },
    });
  };

  useEffect(() => {
    if (menuId !== "") {
      setIsEdit(true);
      try {
        const loadData = async () => {
          var result = await getMenu(menuId);

          if (result.statusCode === 200) {
            setMenu({
              isActive: true,
              segmentId: {
                value: result.data.menuSegments.map((segment) => segment.segmentId),
                errorMessage: "",
              },
              description: { value: result.data.description, errorMessage: "" },
              menuImage: { value: null, errorMessage: "" },
              priority: { value: result.data.priority, errorMessage: "" },
            });

            result.data.menuLists
              .sort((a, b) => a.listIndex - b.listIndex)
              .forEach((menuList) => {
                let newMenuList: MenuList;
                const productData = menuList.list.productLists
                  .sort((a, b) => a.indexInList - b.indexInList)
                  .map((pl) => pl.product);

                switch (menuList.listIndex) {
                  case 1:
                    newMenuList = {
                      listId: menuList.list.listId,
                      listName: menuList.list.listName,
                      productData: productData,
                      listIndex: 1,
                      maxProduct: menuList.list.totalProduct,
                    };
                    setSelectedProducts1(newMenuList);
                    break;
                  case 2:
                    newMenuList = {
                      listId: menuList.list.listId,
                      listName: menuList.list.listName,
                      productData: productData,
                      listIndex: 2,
                      maxProduct: menuList.list.totalProduct,
                    };
                    setSelectedProducts2(newMenuList);
                    break;
                  case 3:
                    newMenuList = {
                      listId: menuList.list.listId,
                      listName: menuList.list.listName,
                      productData: productData,
                      listIndex: 3,
                      maxProduct: menuList.list.totalProduct,
                    };
                    setSelectedProducts3(newMenuList);
                    break;
                  case 4:
                    newMenuList = {
                      listId: menuList.list.listId,
                      listName: menuList.list.listName,
                      productData: productData,
                      listIndex: 4,
                      maxProduct: menuList.list.totalProduct,
                    };
                    setSelectedProducts4(newMenuList);
                    break;
                  case 5:
                    newMenuList = {
                      listId: menuList.list.listId,
                      listName: menuList.list.listName,
                      productData: productData,
                      listIndex: 5,
                      maxProduct: menuList.list.totalProduct,
                    };
                    setSelectedProductspotLight(newMenuList);
                    break;
                  default:
                    break;
                }
              });
          }
        };

        setTimeout(loadData, 500);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu");
      }

      onOpenCreateMenu();
    }
  }, []);

  const handleUpdateMenu = async (menuForm: FormData) => {
    try {
      setIsLoading(true);
      const menuResult = await updateMenu(menuForm);

      if (menuResult.statusCode === 200) {
        const allListProducts: MenuList[] = [];
        allListProducts.push(selectedProducts1);
        allListProducts.push(selectedProducts2);
        allListProducts.push(selectedProducts3);
        allListProducts.push(selectedProducts4);
        allListProducts.push(selectedProductspotLight);

        const listPositionResult = await updateListPosition(allListProducts, brandId);

        if (listPositionResult.statusCode === 200) {
          const listProductDetails = listPositionResult.data.map((list, index) => ({
            listId: list.listId,
            indexProducts: allListProducts[index].productData.map((product, productIndex) => ({
              productId: product.productId,
              indexInList: productIndex + 1,
            })),
          }));

          const productListResult = await updateProductList(brandId, listProductDetails);

          if (productListResult.statusCode === 200) {
            resetLists();
            const toastMessage = "Cập nhât menu thành công";
            navigate("/menu", { state: { toastMessage } });
          } else {
            toast.error(productListResult.message);
          }
        } else {
          toast.error(listPositionResult.message);
        }
      } else {
        toast.error(menuResult.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMenu = async (menuId: Number) => {
    try {
      setIsLoading(true);
      const result = await deleteMenu(menuId);
      if (result.statusCode === 200) {
        resetLists();
        const toastMessage = "Xoá menu thành công";
        navigate("/menu", { state: { toastMessage } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Flex className={style.Container}>
        <Loading />;
      </Flex>
    );
  }

  return (
    <Flex className={style.Container}>
      <Text as="b" fontSize="30px">
        Vui lòng chọn mẫu thực đơn
      </Text>
      <Flex className={style.CardContainer}>
        <Flex className={style.Card} bg="#E3F2F1" onClick={onOpenCreateMenu}>
          <Image className={style.MenuImg} src={fakeMenu} />
        </Flex>
      </Flex>
      <ModalFormCreateMenu
        isOpen={isOpenCreateMenu}
        onClose={onCloseCreateMenu}
        onOpenListProduct={onOpenListProduct}
        selectedProducts1={selectedProducts1}
        selectedProducts2={selectedProducts2}
        selectedProducts3={selectedProducts3}
        selectedProducts4={selectedProducts4}
        selectedProductspotLight={selectedProductspotLight}
        menu={menu}
        setMenu={setMenu}
        checkListNamesNotEmpty={checkListNamesNotEmpty}
        handleChangeTitle={handleChangeTitle}
        handleCreateMenu={handleCreateMenu}
        handleUpdateMenu={handleUpdateMenu}
        handleDeleteMenu={handleDeleteMenu}
        resetLists={resetLists}
        isEdit={isEdit}
        menuId={menuId}
      />
      <DrawerComponent
        isOpen={isOpenListProduct}
        onClose={onCloseListProduct}
        onAddToMenu={handleAddToMenu}
        IndexList={currentListIndex}
        products={products}
        allSelectedProducts={allSelectedProducts}
        currentListProducts={currentListProduct}
        MaxProduct={maxProduct}
        handleChangeProductByCate={handleChangeProductByCate}
        categoryOptions={categoryOptions}
        currentCategory={currentCategory}
      />
    </Flex>
  );
}

export default CreateMenu;
