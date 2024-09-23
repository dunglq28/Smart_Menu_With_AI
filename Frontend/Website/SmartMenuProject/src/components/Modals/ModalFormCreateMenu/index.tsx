import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Image,
  Text,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tabs,
  TabPanel,
  TabPanels,
  Input,
  ModalBody,
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Textarea,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import Draggable from "react-draggable";
import Select from "react-select";
import template from "../../../assets/images/menu/CreateMenu/menuTemplate1.svg";
import style from "./ModalFormCreateMenu.module.scss";
import component1 from "../../../assets/images/menu/CreateMenu/Component1.svg";
import component2 from "../../../assets/images/menu/CreateMenu/Component2.svg";
import { AiOutlineGlobal } from "react-icons/ai";
import circleSpotlight from "../../../assets/images/menu/CreateMenu/circle.svg";
import circleStar from "../../../assets/images/menu/CreateMenu/circleStar.svg";

import { MdPhoneInTalk } from "react-icons/md";
import html2canvas from "html2canvas-pro";
import { formatCurrencyMenu, translateDemographics } from "../../../utils/functionHelper";
import { toast } from "react-toastify";
import { getCustomerSegmentsNoPaging } from "../../../services/CustomerSegmentService";
import { Menu, MenuList } from "../../../models/Menu.model";
import { useNavigate } from "react-router-dom";
import CustomAlertDialog from "../../AlertDialog";
import { validateMenu } from "../../../utils/validation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenListProduct: (Index: number) => void;
  selectedProducts1: MenuList;
  selectedProducts2: MenuList;
  selectedProducts3: MenuList;
  selectedProducts4: MenuList;
  selectedProductspotLight: MenuList;
  menu: Menu;
  setMenu: React.Dispatch<React.SetStateAction<Menu>>;
  checkListNamesNotEmpty: () => boolean;
  handleChangeTitle: (listName: string, index: number) => void;
  handleCreateMenu: (menuForm: FormData) => void;
  handleUpdateMenu: (menuForm: FormData) => void;
  handleDeleteMenu: (menuId: Number) => void;
  resetLists: () => void;
  isEdit: boolean;
  menuId: number;
}

const ModalFormCreateMenu: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onOpenListProduct,
  selectedProducts1,
  selectedProducts2,
  selectedProducts3,
  selectedProducts4,
  selectedProductspotLight,
  menu,
  setMenu,
  checkListNamesNotEmpty,
  handleChangeTitle,
  handleCreateMenu,
  handleUpdateMenu,
  handleDeleteMenu,
  resetLists,
  isEdit,
  menuId,
}) => {
  const navigate = useNavigate();
  const brandId = Number(localStorage.getItem("BrandId"));
  const [currentTab, setCurrentTab] = React.useState(0);
  const [IsDraggable, setIsDraggable] = React.useState(false);
  const [isBorder, setIsBorder] = React.useState(false);
  const [isItemUpdate, setIsItemUpdate] = React.useState(true);
  const [dimensions, setDimensions] = React.useState({ width: 5, height: 5 });
  const [customerSegmentOptions, setCustomerSegmentOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const imageRef = React.useRef<HTMLImageElement>(null);
  const {
    isOpen: isOpenAlertCancelForm,
    onOpen: onOpenAlertCancelForm,
    onClose: onCloseAlertCancelForm,
  } = useDisclosure();
  const {
    isOpen: isOpenAlertConfirmForm,
    onOpen: onOpenAlertConfirmForm,
    onClose: onCloseAlertConfirmForm,
  } = useDisclosure();

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const segments = await getCustomerSegmentsNoPaging(brandId);
        if (segments.statusCode === 200) {
          const options = segments.data.map((segment) => ({
            value: segment.customerSegmentId,
            label: `${segment.customerSegmentName}, ${translateDemographics(
              segment.demographic,
            )}, ${segment.age} tuổi`,
          }));
          setCustomerSegmentOptions(options);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        toast.error("Error fetching data");
      }
    };

    loadData();
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setDimensions({
          width: imageRef.current.clientWidth,
          height: imageRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setDimensions({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight,
      });
    }
  };

  const handleDraggable = () => {
    setIsDraggable(!IsDraggable);
  };
  const handleBorder = () => {
    setIsBorder(!isBorder);
  };

  const handleChange = (field: keyof Menu, value: string | number) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      [field]: { value, errorMessage: "" },
    }));
  };

  const handleSegmentChange = (selectedOptions: any) => {
    setMenu({
      ...menu,
      segmentId: {
        value: selectedOptions ? selectedOptions.map((option: any) => option.value) : [],
        errorMessage: "",
      },
    });
  };

  const getSelectedSegments = () => {
    return menu.segmentId.value
      .map((segmentId) => {
        const segmentOption = customerSegmentOptions.find((option) => option.value === segmentId);
        return segmentOption ? segmentOption : null;
      })
      .filter((option) => option !== null);
  };

  const handleNextTab = () => {
    if (
      selectedProducts1.productData.length == 0 ||
      selectedProducts2.productData.length == 0 ||
      selectedProducts3.productData.length == 0 ||
      selectedProducts4.productData.length == 0 ||
      selectedProductspotLight.productData.length == 0
    ) {
      toast.error("Vui lòng chọn đầy đủ các danh sách");
      return;
    }
    if (!checkListNamesNotEmpty()) {
      toast.error("Vui lòng điền đẩy đủ tiêu đề");
      return;
    }
    // handleCaptureAndDisplay();
    setCurrentTab((prevTab) => (prevTab < 2 ? prevTab + 1 : prevTab));
  };

  const handlePreviousTab = () => {
    setCurrentTab((prevTab) => (prevTab > 0 ? 0 : prevTab));
  };

  // const [capturedImage, setCapturedImage] = useState<string | undefined>(undefined);

  // const handleCaptureAndDisplay = async () => {
  //   const element = document.querySelector(".takeAPhoto") as HTMLElement;
  //   if (element) {
  //     html2canvas(element, {
  //       scale: 3,
  //       useCORS: true,
  //       logging: true,
  //       allowTaint: false,
  //     })
  //       .then((canvas) => {
  //         const imageDataURL = canvas.toDataURL("image/png");
  //         setCapturedImage(imageDataURL);

  //         if (
  //           imageDataURL.includes("image/png") &&
  //           !imageDataURL.includes("data:,")
  //         ) {
  //           fetch(imageDataURL)
  //             .then((res) => res.blob())
  //             .then((blob) => {
  //               // Create a File from the Blob
  //               const file = new File([blob], "captured_image.png", {
  //                 type: "image/png",
  //               });

  //               setMenu((prevMenu) => ({
  //                 ...prevMenu,
  //                 menuImage: { value: file, errorMessage: "" },
  //               }));
  //             })
  //             .catch((error) => {
  //               console.error("Failed to convert image to file:", error);
  //             });
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Failed to capture image:", error);
  //         setCapturedImage(undefined); // or handle error state accordingly
  //       });
  //   }
  // };

  const handleCloseForm = () => {
    if (isEdit) {
      navigate("/menu");
    }
    setCurrentTab(0);
    onCloseAlertCancelForm();
    resetLists();
    onClose();
  };
  const handleUpdateItem = () => {
    setIsItemUpdate(!isItemUpdate);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleDonebtn = () => {
    const errors = validateMenu(menu);

    const updatedMenu = {
      ...menu,
      description: {
        ...menu.description,
        errorMessage: errors.description,
      },
      segmentId: {
        ...menu.segmentId,
        errorMessage: errors.segmentId,
      },
      priority: {
        ...menu.priority,
        errorMessage: errors.priority,
      },
    };

    setMenu(updatedMenu);

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (!hasErrors) {
      const menuForm = new FormData();
      menuForm.append("IsActive", menu.isActive.toString());
      menuForm.append("BrandId", brandId.toString());
      menuForm.append("Description", menu.description.value);
      menuForm.append("Priority", menu.priority.value.toString());
      if (menu.menuImage.value) {
        menuForm.append("MenuImage", menu.menuImage.value);
        // menuForm.append("MenuImage", "null");
      }
      menu.segmentId.value.forEach((id) => {
        menuForm.append("SegmentIds", id.toString());
      });
      if (!isEdit) {
        handleCreateMenu(menuForm);
      } else {
        menuForm.append("menuId", menuId.toString());
        handleUpdateMenu(menuForm);
      }
    }
  };

  return (
    <>
      <Modal onClose={onClose} size="full" isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>
            {currentTab === 0 ? (
              <Flex columnGap="20px">
                <Text as="b" fontSize="30px">
                  {isEdit ? "Cập nhật menu" : "Tạo menu"}
                </Text>
                <Button className={style.primaryButton} onClick={handleDraggable}>
                  Di chuyển item: {!IsDraggable ? "Bật" : "Tắt"}
                </Button>
                <Button className={style.primaryButton} onClick={handleBorder}>
                  Viền: {isBorder ? "Bật" : "Tắt"}
                </Button>
                <Button className={style.primaryButton} onClick={handleUpdateItem}>
                  Chỉnh sửa item: {isItemUpdate ? "Bật" : "Tắt"}
                </Button>
                <Button className={style.primaryButton} onClick={() => resetLists()}>
                  Đặt lại menu
                </Button>
                {isEdit && (
                  <Button
                    style={{ backgroundColor: "#E53E3E", color: "#fff" }}
                    onClick={onOpenAlertConfirmForm}
                  >
                    Xoá menu
                  </Button>
                )}
              </Flex>
            ) 
            : (
              // : currentTab === 1 ? (
              //   <Text as="b" fontSize="30px">
              //     Xem lại menu đã tạo
              //   </Text>
              // )
              <Text as="b" fontSize="30px">
                Thông tin menu
              </Text>
            )}
          </ModalHeader>
          <ModalBody>
            <Tabs index={currentTab}>
              <TabPanels>
                <TabPanel>
                  <Flex width="100%" justifyContent="center" userSelect="none">
                    <Flex
                      width={`${dimensions.width}px`}
                      height={`${dimensions.height}px`}
                      position="absolute"
                      className="takeAPhoto"
                    >
                      <Flex height="100%" width="33.3333%" flexDirection="column">
                        {/* List 1 */}
                        <Flex w="100%" height="48%" flexDirection="column">
                          <Draggable disabled={IsDraggable}>
                            <Flex height="20px" marginTop="7px" marginLeft="30%">
                              <Input
                                border={isBorder ? "1px solid black" : "1px solid transparent"}
                                contentEditable={true}
                                spellCheck={false}
                                color="#7AD7F4"
                                fontSize="0.8vw"
                                w="8vw"
                                height="1.5vw"
                                whiteSpace="nowrap"
                                fontWeight="bold"
                                textAlign="center"
                                placeholder="Tiêu đề"
                                value={selectedProducts1.listName}
                                onChange={(e) => handleChangeTitle(e.target.value, 1)}
                              />
                            </Flex>
                          </Draggable>
                          <Draggable disabled={IsDraggable}>
                            <Flex
                              border={isBorder ? "1px solid black" : "1px solid transparent"}
                              height="80%"
                              width="90%"
                              justifyContent="space-between"
                              alignItems="center"
                              marginTop="10px"
                              marginLeft="10px"
                              borderRadius="8px"
                              flexDirection="column"
                            >
                              {selectedProducts1.productData.length !== 0 &&
                                selectedProducts1.productData.map((product) => (
                                  <Flex
                                    key={product.productId}
                                    height="23%"
                                    width="100%"
                                    justifyContent="center"
                                    alignItems="center"
                                    cursor="pointer"
                                    onClick={isItemUpdate ? () => onOpenListProduct(1) : () => {}}
                                  >
                                    <Flex width="30%" height="100%" justifyContent="center">
                                      <Image
                                        src={product.imageUrl}
                                        style={{ pointerEvents: "none" }}
                                      />
                                    </Flex>
                                    <Flex
                                      width="70%"
                                      height="100%"
                                      flexDirection="column"
                                      justifyContent="center"
                                    >
                                      <Flex justifyContent="space-between" textOverflow="ellipsis">
                                        <Text fontWeight="bold" fontSize="0.7vw" color="#5A3D41">
                                          {product.productName}
                                        </Text>
                                        <Text fontWeight="bold" fontSize="0.7vw" color="#B1292D">
                                          {formatCurrencyMenu(product.price.toString())}
                                        </Text>
                                      </Flex>
                                      <Text fontSize="0.6vw" color="#5A3D41">
                                        {product.description}
                                      </Text>
                                    </Flex>
                                  </Flex>
                                ))}
                              {selectedProducts1.productData.length !== 4 && (
                                <FaPlus
                                  onClick={() => onOpenListProduct(1)}
                                  style={{
                                    height: "4vw",
                                    width: "4vw",
                                    color: "#444444",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </Flex>
                          </Draggable>
                        </Flex>
                        {/* End List 1 */}
                        {/* List 2 */}
                        <Flex w="100%" height="52%" flexDirection="column">
                          <Draggable disabled={IsDraggable}>
                            <Flex height="20px" marginLeft="32%">
                              <Input
                                border={isBorder ? "1px solid black" : "1px solid transparent"}
                                // contentEditable={true}
                                spellCheck={false}
                                color="#7AD7F4"
                                fontSize="0.8vw"
                                w="8vw"
                                height="1.5vw"
                                whiteSpace="nowrap"
                                fontWeight="bold"
                                textAlign="center"
                                placeholder="Tiêu đề"
                                value={selectedProducts2.listName}
                                onChange={(e) => handleChangeTitle(e.target.value, 2)}
                              />
                            </Flex>
                          </Draggable>
                          <Draggable disabled={IsDraggable}>
                            <Flex
                              border={isBorder ? "1px solid black" : "1px solid transparent"}
                              height="70%"
                              width="90%"
                              justifyContent="space-between"
                              alignItems="center"
                              marginTop="10px"
                              marginLeft="10px"
                              borderRadius="8px"
                              flexWrap="wrap"
                            >
                              {selectedProducts2.productData.length !== 0 &&
                                selectedProducts2.productData.map((product) => (
                                  <Flex
                                    key={product.productId}
                                    marginTop="1vw"
                                    height="50%"
                                    width="47%"
                                    flexDirection="column"
                                    cursor="pointer"
                                    onClick={isItemUpdate ? () => onOpenListProduct(2) : () => {}}
                                  >
                                    <Flex height="50%" w="50%">
                                      <Image
                                        src={product.imageUrl}
                                        style={{ pointerEvents: "none" }}
                                      />
                                    </Flex>
                                    <Flex height="50%" w="100%" flexDirection="column">
                                      <Flex w="100%" justifyContent="space-between">
                                        <Text fontWeight="bold" fontSize="0.7vw" color="#5A3D41">
                                          {product.productName}
                                        </Text>
                                        <Text fontWeight="bold" fontSize="0.7vw" color="#B1292D">
                                          {formatCurrencyMenu(product.price.toString())}
                                        </Text>
                                      </Flex>
                                      <Text fontSize="0.6vw" color="#5A3D41">
                                        {product.description}
                                      </Text>
                                    </Flex>
                                  </Flex>
                                ))}
                              {selectedProducts2.productData.length !== 4 && (
                                <FaPlus
                                  onClick={() => onOpenListProduct(2)}
                                  style={{
                                    height: "4vw",
                                    width: "4vw",
                                    color: "#444444",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </Flex>
                          </Draggable>
                        </Flex>
                        {/* End List 2 */}
                      </Flex>
                      <Flex height="100%" width="33.3333%" flexDirection="column" paddingTop="8px">
                        {/* List 3 */}
                        <Flex w="100%" height="47%" flexDirection="column">
                          <Draggable disabled={IsDraggable}>
                            <Flex height="20px" marginLeft="32%">
                              <Input
                                border={isBorder ? "1px solid black" : "1px solid transparent"}
                                // contentEditable={true}
                                spellCheck={false}
                                color="#7AD7F4"
                                fontSize="0.8vw"
                                w="8vw"
                                height="1.5vw"
                                whiteSpace="nowrap"
                                fontWeight="bold"
                                textAlign="center"
                                placeholder="Tiêu đề"
                                value={selectedProducts3.listName}
                                onChange={(e) => handleChangeTitle(e.target.value, 3)}
                              />
                            </Flex>
                          </Draggable>
                          <Draggable disabled={IsDraggable}>
                            <Flex
                              border={isBorder ? "1px solid black" : "1px solid transparent"}
                              height="70%"
                              width="90%"
                              justifyContent="space-between"
                              alignItems="center"
                              marginTop="10px"
                              marginLeft="10px"
                              borderRadius="8px"
                              flexWrap="wrap"
                            >
                              {selectedProducts3.productData.length !== 0 &&
                                selectedProducts3.productData.map((product) => (
                                  <Flex
                                    key={product.productId}
                                    height="65%"
                                    width="47%"
                                    flexDirection="column"
                                    cursor="pointer"
                                    onClick={isItemUpdate ? () => onOpenListProduct(3) : () => {}}
                                  >
                                    <Flex height="50%" w="50%">
                                      <Image
                                        src={product.imageUrl}
                                        style={{ pointerEvents: "none" }}
                                      />
                                    </Flex>
                                    <Flex height="50%" w="100%" flexDirection="column">
                                      <Flex w="100%" justifyContent="space-between">
                                        <Text fontWeight="bold" fontSize="0.7vw" color="#5A3D41">
                                          {product.productName}
                                        </Text>
                                        <Text fontWeight="bold" fontSize="0.7vw" color="#B1292D">
                                          {formatCurrencyMenu(product.price.toString())}
                                        </Text>
                                      </Flex>
                                      <Text fontSize="0.6vw" color="#5A3D41">
                                        {product.description}
                                      </Text>
                                    </Flex>
                                  </Flex>
                                ))}
                              {selectedProducts3.productData.length !== 4 && (
                                <FaPlus
                                  onClick={() => onOpenListProduct(3)}
                                  style={{
                                    height: "4vw",
                                    width: "4vw",
                                    color: "#444444",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </Flex>
                          </Draggable>
                        </Flex>
                        {/* End List 3 */}
                        {/* List 4 */}
                        <Flex w="100%" height="50%" flexDirection="column">
                          <Draggable disabled={IsDraggable}>
                            <Flex height="20px" marginLeft="32%">
                              <Input
                                border={isBorder ? "1px solid black" : "1px solid transparent"}
                                // contentEditable={true}
                                spellCheck={false}
                                color="#7AD7F4"
                                fontSize="0.8vw"
                                w="8vw"
                                height="1.5vw"
                                whiteSpace="nowrap"
                                fontWeight="bold"
                                textAlign="center"
                                placeholder="Tiêu đề"
                                value={selectedProducts4.listName}
                                onChange={(e) => handleChangeTitle(e.target.value, 4)}
                              />
                            </Flex>
                          </Draggable>
                          <Draggable disabled={IsDraggable}>
                            <Flex
                              border={isBorder ? "1px solid black" : "1px solid transparent"}
                              height="50%"
                              width="90%"
                              justifyContent="space-between"
                              alignItems="center"
                              marginLeft="10px"
                              borderRadius="8px"
                              flexWrap="wrap"
                            >
                              {selectedProducts4.productData.length !== 0 &&
                                selectedProducts4.productData.map((product) => (
                                  <Flex
                                    key={product.productId}
                                    marginTop="1vw"
                                    height="85%"
                                    width="47%"
                                    flexDirection="column"
                                    cursor="pointer"
                                    onClick={isItemUpdate ? () => onOpenListProduct(4) : () => {}}
                                  >
                                    <Flex height="50%" w="50%">
                                      <Image
                                        src={product.imageUrl}
                                        style={{ pointerEvents: "none" }}
                                      />
                                    </Flex>
                                    <Flex height="50%" w="100%" flexDirection="column">
                                      <Flex w="100%" justifyContent="space-between">
                                        <Text fontWeight="bold" fontSize="0.7vw" color="#5A3D41">
                                          {product.productName}
                                        </Text>
                                        <Text fontWeight="bold" fontSize="0.7vw" color="#B1292D">
                                          {formatCurrencyMenu(product.price.toString())}
                                        </Text>
                                      </Flex>
                                      <Text fontSize="0.6vw" color="#5A3D41">
                                        {product.description}
                                      </Text>
                                    </Flex>
                                  </Flex>
                                ))}
                              {selectedProducts4.productData.length !== 2 && (
                                <FaPlus
                                  onClick={() => onOpenListProduct(4)}
                                  style={{
                                    height: "4vw",
                                    width: "4vw",
                                    color: "#444444",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </Flex>
                          </Draggable>
                          <Draggable disabled={IsDraggable}>
                            <Flex
                              w="100%"
                              height="25%"
                              alignItems="center"
                              justifyContent="center"
                              flexDirection="column"
                              marginLeft="0.3vw"
                            >
                              <Text
                                fontSize="0.7vw"
                                fontWeight="bold"
                                color="#7AD7F4"
                                marginTop="0.3vw"
                              >
                                ĐỊA CHỈ
                              </Text>
                              <Text
                                fontSize="0.7vw"
                                fontWeight="bold"
                                color="#5A3D41"
                                contentEditable={true}
                                spellCheck={false}
                              >
                                YOUR ADDRESS HERE IN THIS LINE
                              </Text>
                              <Text
                                fontSize="0.7vw"
                                fontWeight="bold"
                                color="#5A3D41"
                                contentEditable={true}
                                spellCheck={false}
                                userSelect="auto"
                              >
                                www.example.com
                              </Text>
                            </Flex>
                          </Draggable>
                        </Flex>
                        {/* End List 4 */}
                      </Flex>
                      {/* Spotlight */}
                      <Flex
                        height="100%"
                        width="33.3333%"
                        flexDirection="column"
                        // paddingTop="8px"
                      >
                        <Flex height="37.5%" width="100%" flexDirection="column">
                          <Flex height="50%" width="100%"></Flex>
                          <Flex height="50%" width="100%" justifyContent="space-between">
                            <Draggable disabled={IsDraggable}>
                              <Flex cursor="pointer">
                                <Image
                                  src={component1}
                                  height="3.3vw"
                                  style={{ pointerEvents: "none" }}
                                />
                              </Flex>
                            </Draggable>
                            <Flex
                              marginTop="-1vw"
                              marginLeft="-1.4vw"
                              height="100%"
                              w="70%"
                              transform="rotate(-7deg)"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Draggable disabled={IsDraggable}>
                                <Text
                                  className={style.SpotligtTitle}
                                  textAlign="center"
                                  contentEditable={true}
                                  spellCheck={false}
                                >
                                  {selectedProductspotLight.productData.length !== 0
                                    ? selectedProductspotLight.productData[0].productName
                                    : "Sản Phẩm Spotlight"}
                                </Text>
                              </Draggable>
                            </Flex>
                            <Draggable disabled={IsDraggable}>
                              <Flex cursor="pointer">
                                <Image
                                  src={component2}
                                  height="3.2vw"
                                  marginTop="1vw"
                                  style={{ pointerEvents: "none" }}
                                />
                              </Flex>
                            </Draggable>
                          </Flex>
                        </Flex>
                        <Flex height="62.5%" width="100%" flexDirection="column">
                          <Flex height="50%" width="100%" justifyContent="center">
                            <Draggable disabled={IsDraggable}>
                              <Flex
                                w="55%"
                                height="94%"
                                borderRadius="50%"
                                justifyContent="center"
                                alignItems="center"
                                cursor="pointer"
                                onClick={isItemUpdate ? () => onOpenListProduct(5) : () => {}}
                              >
                                {selectedProductspotLight.productData.length !== 0 ? (
                                  // <Image
                                  //   src={spotLightProduct.spotlightVideoImageUrl}
                                  // />
                                  <Image
                                    src={selectedProductspotLight.productData[0].imageUrl}
                                    zIndex={10}
                                    borderRadius="50%"
                                    position="absolute"
                                    width="9vw"
                                    cursor="pointer"
                                    style={{ pointerEvents: "none" }}
                                  />
                                ) : (
                                  <FaPlus
                                    onClick={() => onOpenListProduct(5)}
                                    style={{
                                      height: "4vw",
                                      width: "4vw",
                                      color: "#444444",
                                      cursor: "pointer",
                                      zIndex: "999",
                                      position: "absolute",
                                    }}
                                  />
                                )}
                                <Image
                                  src={circleSpotlight}
                                  w="100%"
                                  zIndex={5}
                                  style={{ pointerEvents: "none" }}
                                />
                              </Flex>
                            </Draggable>
                            <Draggable disabled={IsDraggable}>
                              <Flex justifyContent="center">
                                <Image
                                  src={circleStar}
                                  height="5vw"
                                  style={{ pointerEvents: "none" }}
                                />
                                <Text className={style.spotLight}>
                                  {selectedProductspotLight.productData.length !== 0
                                    ? formatCurrencyMenu(
                                        selectedProductspotLight.productData[0].price.toString(),
                                      )
                                    : "0"}
                                </Text>
                              </Flex>
                            </Draggable>
                          </Flex>
                          <Flex
                            height="50%"
                            width="100%"
                            flexDirection="column"
                            alignItems="center"
                            rowGap="10px"
                          >
                            <Draggable disabled={IsDraggable}>
                              <Flex
                                height="20%"
                                width="40%"
                                marginTop="3vw"
                                bg="#444444"
                                alignItems="center"
                                justifyContent="space-around"
                              >
                                <Flex
                                  width="41%"
                                  height="90%"
                                  justifyContent="center"
                                  alignItems="center"
                                  flexDirection="column"
                                >
                                  <Text fontSize="0.5vw" color="#fff">
                                    DOOR OPEN
                                  </Text>
                                  <Text
                                    fontSize="1vw"
                                    color="#7DD7F3"
                                    fontWeight="bold"
                                    contentEditable={true}
                                    spellCheck={false}
                                    textAlign="center"
                                    whiteSpace="nowrap"
                                  >
                                    08 AM
                                  </Text>
                                </Flex>
                                <Flex
                                  width="41%"
                                  height="90%"
                                  justifyContent="center"
                                  flexDirection="column"
                                >
                                  <Text fontSize="0.5vw" color="#fff">
                                    DOOR CLOSE
                                  </Text>
                                  <Text
                                    fontSize="1vw"
                                    color="#7DD7F3"
                                    fontWeight="bold"
                                    contentEditable={true}
                                    spellCheck={false}
                                    textAlign="center"
                                    whiteSpace="nowrap"
                                  >
                                    09 PM
                                  </Text>
                                </Flex>
                              </Flex>
                            </Draggable>
                            <Draggable disabled={IsDraggable}>
                              <Text
                                fontSize="0.9vw"
                                fontWeight="bold"
                                color="#5A3D41"
                                contentEditable={true}
                                spellCheck={false}
                              >
                                ORDER NOW
                              </Text>
                            </Draggable>
                            <Draggable disabled={IsDraggable}>
                              <Text
                                fontSize="0.6vw"
                                fontWeight="bold"
                                color="#5A3D41"
                                contentEditable={true}
                                spellCheck={false}
                                textAlign="center"
                                width="70%"
                              >
                                Your detail address here in this line
                              </Text>
                            </Draggable>
                            <Draggable disabled={IsDraggable}>
                              <Flex justifyContent="space-between" width="100%">
                                <Flex
                                  height="50%"
                                  width="100%"
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <MdPhoneInTalk
                                    style={{
                                      height: "1vw",
                                      width: "1vw",
                                      marginTop: "0.2vw",
                                    }}
                                  />
                                  <Text
                                    fontSize="1vw"
                                    fontWeight="bold"
                                    color="#5A3D41"
                                    contentEditable={true}
                                    spellCheck={false}
                                  >
                                    0123456789
                                  </Text>
                                </Flex>
                                <Flex
                                  height="50%"
                                  width="100%"
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  <AiOutlineGlobal
                                    style={{
                                      height: "1vw",
                                      width: "1vw",
                                      marginTop: "0.2vw",
                                    }}
                                  />
                                  <Text
                                    fontSize="0.8vw"
                                    fontWeight="bold"
                                    color="#5A3D41"
                                    contentEditable={true}
                                    spellCheck={false}
                                  >
                                    www.example.com
                                  </Text>
                                </Flex>
                              </Flex>
                            </Draggable>
                          </Flex>
                        </Flex>
                      </Flex>
                      {/* End Spotlight */}
                      <Flex width={`${dimensions.width}px`} position="absolute" zIndex={-1}>
                        <Image ref={imageRef} src={template} style={{ pointerEvents: "none" }} />
                      </Flex>
                      <Flex
                        width={`${dimensions.width}px`}
                        height={`${dimensions.height}px`}
                        position="absolute"
                        bg="#B8D7D5"
                        zIndex={-2}
                      ></Flex>
                    </Flex>

                    {/* Menu img */}
                    <Flex w="60%" zIndex={-99}>
                      <Image
                        ref={imageRef}
                        src={template}
                        onLoad={handleImageLoad}
                        style={{ pointerEvents: "none" }}
                      />
                    </Flex>
                    {/* End Menu img */}

                    {/* Background of menu */}

                    {/* End Background of menu */}
                  </Flex>
                </TabPanel>
                {/* <TabPanel>
                  <Flex w="100%" justifyContent="center">
                    <Flex justifyContent="center">
                      <Image
                        w="60%"
                        h="auto"
                        src={capturedImage}
                        alt="enter"
                        style={{ pointerEvents: "none" }}
                      />
                    </Flex>
                  </Flex>
                </TabPanel> */}
                <TabPanel>
                  <Flex width="100%" height="100%" justifyContent="center">
                    <Flex
                      justifyContent="center"
                      width="70%"
                      height="100%"
                      padding="40px 0 30px 0"
                      flexDirection="column"
                      alignItems="center"
                      rowGap="2vw"
                      boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;"
                      transition="0.3s"
                      borderRadius="10px"
                      _hover={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      }}
                    >
                      <Flex flexDirection="column" rowGap="1vw" width="50%">
                        <Text as="b" fontSize="20px">
                          Phân khúc khách hàng
                          <br />
                          <div
                            style={{
                              fontSize: "14px",
                              color: "rgb(127 113 113)",
                              fontStyle: "italic",
                            }}
                          >
                            Có thể chọn nhiều phân khúc khách hàng
                          </div>
                        </Text>
                        <Select
                          options={customerSegmentOptions}
                          closeMenuOnSelect={true}
                          isMulti
                          styles={{
                            control: (styles) => ({
                              ...styles,
                              border: "2px solid #55ad9b",
                            }),
                          }}
                          placeholder="Chọn phân khúc"
                          onChange={handleSegmentChange}
                          value={getSelectedSegments()}
                        />
                        {menu.segmentId.errorMessage && (
                          <Text className={style.ErrorText}>{menu.segmentId.errorMessage}</Text>
                        )}
                      </Flex>
                      <Flex flexDirection="column" rowGap="1vw" width="50%">
                        <Text as="b" fontSize="20px">
                          Độ ưu tiên
                        </Text>
                        <NumberInput
                          value={menu.priority.value}
                          min={0}
                          onChange={(valueAsString, valueAsNumber) =>
                            handleChange("priority", valueAsNumber)
                          }
                        >
                          <NumberInputField
                            border="2px solid #55ad9b"
                            _focus={{ border: "2px solid #95d2b3" }}
                            _hover={{ border: "2px solid #95d2b3" }}
                          />
                        </NumberInput>
                        {menu.priority.errorMessage && (
                          <Text className={style.ErrorText}>{menu.priority.errorMessage}</Text>
                        )}
                      </Flex>
                      <Flex flexDirection="column" rowGap="1vw" width="50%">
                        <Text as="b" fontSize="20px">
                          Mô tả menu
                        </Text>
                        <Textarea
                          border="2px solid #55ad9b"
                          _focus={{ border: "2px solid #95d2b3" }}
                          _hover={{ border: "2px solid #95d2b3" }}
                          value={menu.description.value}
                          onChange={(e) => handleChange("description", e.target.value)}
                        />
                        {menu.description.errorMessage && (
                          <Text className={style.ErrorText}>{menu.description.errorMessage}</Text>
                        )}
                      </Flex>
                      <Flex flexDirection="column" rowGap="1vw" width="50%">
                        <Text as="b" fontSize="20px">
                          {isEdit ? "Ngày cập nhật" : "Ngày tạo"}
                        </Text>
                        <Input
                          userSelect="none"
                          isReadOnly
                          border="2px solid #55ad9b"
                          placeholder="Select Date"
                          size="md"
                          value={getCurrentDate()}
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Flex columnGap="30px" zIndex={100}>
              <Button onClick={onOpenAlertCancelForm} colorScheme="red">
                Huỷ
              </Button>
              <Button className={style.primaryButton} onClick={handlePreviousTab}>
                Quay lại
              </Button>
              {currentTab === 1 ? (
                <Button className={style.primaryButton} onClick={handleDonebtn}>
                  {isEdit ? "Cập nhật menu" : "Tạo menu"}
                </Button>
              ) : (
                <Button className={style.primaryButton} onClick={handleNextTab}>
                  Tiếp theo
                </Button>
              )}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isOpenAlertCancelForm}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlertCancelForm}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isEdit ? "Huỷ cập nhật menu" : "Hủy tạo menu"}
            </AlertDialogHeader>

            <AlertDialogBody>
              Menu đang {isEdit ? "cập nhật" : "tạo"} sẽ không thể phục hồi sau khi bị hủy, bạn có
              chắc chắn muốn hủy ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                className={style.primaryButton}
                ref={cancelRef}
                onClick={onCloseAlertCancelForm}
              >
                Không
              </Button>
              <Button colorScheme="red" onClick={handleCloseForm} ml={3}>
                Hủy
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <CustomAlertDialog
        onClose={onCloseAlertConfirmForm}
        isOpen={isOpenAlertConfirmForm}
        id={menuId}
        onDelete={handleDeleteMenu}
        titleHeader="Xoá menu"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName="Xoá"
      />
    </>
  );
};

export default ModalFormCreateMenu;
