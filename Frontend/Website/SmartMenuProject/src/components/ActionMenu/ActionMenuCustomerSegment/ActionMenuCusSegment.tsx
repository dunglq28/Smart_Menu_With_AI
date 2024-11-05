import React, { FC } from "react";
import { useDisclosure } from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import { Icons } from "@/assets";
import {
  ActionMenuComponent,
  CustomAlertDialog,
  ModalForm,
  ModalFormCustomerSegment,
} from "@/components";
import { customerSegmentUpdate } from "@/payloads";
import { CustomerSegmentForm } from "@/models";

interface ActionMenuProps {
  formData: CustomerSegmentForm;
  setFormData: React.Dispatch<React.SetStateAction<CustomerSegmentForm>>;
  id: number;
  onDelete: (id: number) => void;
  onEdit: (
    segmentId: number,
    segment: customerSegmentUpdate,
    onClose: () => void,
    brandId: number,
  ) => void;
}

const ActionMenuCustomerSegment: FC<ActionMenuProps> = ({
  formData,
  setFormData,
  id,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCustomerSegment,
    onOpen: onOpenCustomerSegment,
    onClose: onCloseCustomerSegment,
  } = useDisclosure();
  const cancelRef: React.LegacyRef<HTMLButtonElement> = React.useRef(null);

  const handleDelete = () => {
    onDelete(id);
  };

  const actionItems = [
    {
      icon: <Icons.edit />,
      label: "Cập nhật phân khúc khách hàng",
      onClick: onOpenCustomerSegment,
    },
    {
      icon: <Icons.delete />,
      label: "Xoá phân khúc khách hàng",
      onClick: onOpen,
    },
  ];

  return (
    <>
      <ActionMenuComponent title="Cài đặt phân khúc khách hàng" items={actionItems} />

      <CustomAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        onDelete={handleDelete}
        titleHeader="Xóa phân khúc khách hàng"
        titleBody="Bạn có chắc không? Bạn không thể hoàn tác hành động này sau đó."
        btnName=" Xoá"
      />

      <ModalForm
        formBody={
          <ModalFormCustomerSegment
            onClose={onCloseCustomerSegment}
            handleEdit={onEdit}
            isEdit={true}
            formData={formData}
            setFormData={setFormData}
            id={id}
          />
        }
        onClose={onCloseCustomerSegment}
        isOpen={isOpenCustomerSegment}
        title={t("Cập nhật phân khúc khách hàng")}
      />
    </>
  );
};

export default ActionMenuCustomerSegment;
