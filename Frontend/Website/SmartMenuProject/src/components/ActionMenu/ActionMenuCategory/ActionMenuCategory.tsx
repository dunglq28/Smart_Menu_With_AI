import React, { FC } from "react";
import { useDisclosure } from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import { ActionMenuComponent, CustomAlertDialog, ModalForm, ModalFormCategory } from "@/components";
import { Icons } from "@/assets";

interface ActionMenuProps {
  id: number;
  onDelete: (id: number) => void;
  onEdit: (cateId: number, categoryName: string, onClose: () => void, brandId: number) => void;
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

  const actionItems = [
    {
      icon: <Icons.edit />,
      label: "Cập nhật danh mục",
      onClick: onOpenCategory,
    },
    {
      icon: <Icons.delete />,
      label: "Xoá danh mục",
      onClick: onOpen,
    },
  ];

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <>
      <ActionMenuComponent title="Cài đặt danh mục" items={actionItems} />

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        onDelete={handleDelete}
        titleHeader="Xóa danh mục"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName="Xoá"
      />

      <ModalForm
        formBody={
          <ModalFormCategory onClose={onCloseCategory} handleEdit={onEdit} isEdit={true} id={id} />
        }
        onClose={onCloseCategory}
        isOpen={isOpenCategory}
        title={t("Cập nhật danh mục")}
      />
    </>
  );
};

export default ActionMenuCategory;
