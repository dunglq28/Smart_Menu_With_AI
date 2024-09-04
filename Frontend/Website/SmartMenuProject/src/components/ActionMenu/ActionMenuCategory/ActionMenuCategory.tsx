import React, { FC, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiSettings3Line } from "react-icons/ri";

import style from "./ActionMenuCategory.module.scss";
import { useTranslation } from "react-i18next";
import CustomAlertDialog from "../../AlertDialog";
import ModalForm from "../../Modals/ModalForm/ModalForm";
import ModalFormCategory from "../../Modals/ModalFormCategory/ModalFormCategory";

interface ActionMenuProps {
  id: number;
  onDelete: (id: number) => void;
  onEdit: (cateId: number, brandId: number, categoryName: string, onClose: () => void) => void;
}

const ActionMenuCategory: FC<ActionMenuProps> = ({ id, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCategory,
    onOpen: onOpenCategory,
    onClose: onCloseCategory,
  } = useDisclosure();
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);

  return (
    <>
      <Flex className={style.SettingCategory}>
        <Popover>
          <PopoverTrigger>
            <Button className={style.SettingsIconBtn}>
              <Flex>
                <RiSettings3Line className={style.SettingsIcon} />
              </Flex>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={style.PopoverContent}>
            <PopoverArrow />
            <PopoverBody>
              <Divider />
              <Flex
                className={style.PopupButton}
                onClick={() => onOpenCategory()}
              >
                <Text className={style.PopupButtonText}>Cập nhật danh mục</Text>
              </Flex>
              <Divider />
              <Flex className={style.PopupButton} onClick={onOpen}>
                <Text className={style.PopupButtonText}>Xóa danh mục</Text>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        id={id}
        onDelete={onDelete}
        titleHeader="Xóa danh mục"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName="Xoá"
      />

      <ModalForm
        formBody={
          <ModalFormCategory
            onClose={onCloseCategory}
            handleEdit={onEdit}
            isEdit={true}
            id={id}
          />
        }
        onClose={onCloseCategory}
        isOpen={isOpenCategory}
        title={t("Cập nhật danh mục")}
      />
    </>
  );
};

export default ActionMenuCategory;
