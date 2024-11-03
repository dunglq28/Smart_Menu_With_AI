import React, { FC } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ActionMenuComponent, CustomAlertDialog, ModalForm, ModalFormProduct } from "@/components";
import { Icons } from "@/assets";

interface ActionMenuProps {
  id: number;
  onDelete: (id: number) => void;
  onEdit: (id: number, product: FormData) => void;
}

const ActionMenuProduct: FC<ActionMenuProps> = ({ id, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenProduct, onOpen: onOpenProduct, onClose: onCloseProduct } = useDisclosure();
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);

  const actionItems = [
    {
      icon: <Icons.edit />,
      label: "Cập nhật sản phẩm",
      onClick: onOpenProduct,
    },
    {
      icon: <Icons.delete />,
      label: "Xoá sản phẩm",
      onClick: onOpen,
    },
  ];

  return (
    <>
      <ActionMenuComponent title="Cài đặt sản phẩm" items={actionItems} />

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        id={id}
        onDelete={onDelete}
        titleHeader="Xoá sản phẩm"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName="Xoá"
      />

      <ModalForm
        formBody={
          <ModalFormProduct onClose={onCloseProduct} handleEdit={onEdit} isEdit={true} id={id} />
        }
        isEdit={true}
        onClose={onCloseProduct}
        isOpen={isOpenProduct}
        title={t("Cập nhật sản phẩm")}
      />
    </>
  );
};

export default ActionMenuProduct;
