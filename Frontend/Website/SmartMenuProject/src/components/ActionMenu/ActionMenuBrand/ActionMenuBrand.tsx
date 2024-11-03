import React, { FC, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import style from "./ActionMenuBrand.module.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { BrandService } from "@/services";
import { CustomAlertDialog, ModalForm, ModalFormBrand } from "@/components";
import { Icons } from "@/assets";
import { brandUpdate } from "@/payloads";
import { BrandForm } from "@/models";
import { getInitialBrandForm } from "@/utils";

interface ActionMenuProps {
  id: number;
  brandName: string;
  userBrandId: number;
  onDelete: (id: number) => void;
  onEdit: (id: number, brand: brandUpdate) => void;
}

const ActionMenuBrand: FC<ActionMenuProps> = ({ id, brandName, userBrandId, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenBrand, onOpen: onOpenBrand, onClose: onCloseBrand } = useDisclosure();
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);
  const navigate = useNavigate();
  //BRAND DATA
  const [brandForm, setBrandForm] = useState<BrandForm>(getInitialBrandForm());

  const updateBrandData = (brand: BrandForm, isSave: boolean) => {
    var brandUpdate: brandUpdate = {
      id: id,
      brandName: brand.brandName.value,
      image: brand.image.value,
    };
    if (isSave) {
      onEdit(id, brandUpdate);
    }
  };

  const handleEditClick = async () => {
    var result = await BrandService.getBrand(id);
    if (result.statusCode === 200) {
      const { brandName, imageUrl } = result.data;
      const updatedBrandData: BrandForm = {
        brandName: { value: brandName, errorMessage: "" },
        image: { value: null, errorMessage: "" },
        imageUrl: { value: imageUrl, errorMessage: "" },
      };
      setBrandForm(updatedBrandData);
      onOpenBrand();
    }
  };

  const handleViewClick = (path: string) => {
    switch (path) {
      case "branches":
        navigate(`/branches/${brandName}`, { state: { id, brandName, userBrandId } });
        break;
      case "menu":
        navigate(`/menu/${brandName}`, { state: { id, userBrandId } });
        break;
      default:
        break;
    }
  };

  const actionItems = [
    {
      icon: <Icons.branch />,
      label: "Xem chi nhánh",
      onClick: () => handleViewClick("branches"),
    },
    {
      icon: <Icons.menu />,
      label: "Xem thực đơn",
      onClick: () => handleViewClick("menu"),
    },
    {
      icon: <Icons.edit />,
      label: "Cập nhật thương hiệu",
      onClick: handleEditClick,
    },
    {
      icon: <Icons.delete />,
      label: "Xoá thương hiệu",
      onClick: onOpen,
    },
  ];

  return (
    <>
      <Flex className={style.SettingBrand}>
        <Popover>
          <PopoverTrigger>
            <Button className={style.SettingsIconBtn}>
              <Flex>
                <Icons.outlineMoreHoriz className={style.SettingsIcon} />
              </Flex>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={style.PopoverContent}>
            <PopoverHeader className={style.PopoverHeader}>Cài đặt thương hiệu</PopoverHeader>
            <PopoverBody className={style.PopoverBody}>
              {actionItems.map((actionItem, i) => (
                <Flex key={i} className={style.PopupButton} onClick={actionItem.onClick}>
                  <Box className={style.PopupIcon}>{actionItem.icon}</Box>
                  <Text className={style.PopupButtonText}>{actionItem.label}</Text>
                </Flex>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        id={id}
        onDelete={onDelete}
        titleHeader="Xoá thương hiệu"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName="Xoá"
      />

      <ModalForm
        formBody={
          <ModalFormBrand
            brandData={brandForm}
            onClose={onCloseBrand}
            isEdit={true}
            updateBrandData={updateBrandData}
          />
        }
        isEdit={true}
        onClose={onCloseBrand}
        isOpen={isOpenBrand}
        title={t("Cập nhật thương hiệu")}
        updateBrandData={updateBrandData}
      />
    </>
  );
};

export default ActionMenuBrand;
