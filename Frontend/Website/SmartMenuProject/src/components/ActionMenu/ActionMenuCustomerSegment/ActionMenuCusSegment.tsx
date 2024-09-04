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

import style from "./ActionMenuCusSegment.module.scss";
import { useTranslation } from "react-i18next";
import CustomAlertDialog from "../../AlertDialog";
import ModalForm from "../../Modals/ModalForm/ModalForm";
import { customerSegmentUpdate } from "../../../payloads/requests/updateRequests.model";
import ModalFormCustomerSegment from "../../Modals/ModalFormCustomerSegment/ModalFormCusSegment";
import { CustomerSegmentForm } from "../../../models/SegmentForm.model";

interface ActionMenuProps {
  formData: CustomerSegmentForm;
  setFormData: React.Dispatch<React.SetStateAction<CustomerSegmentForm>>;
  id: number;
  onDelete: (id: number) => void;
  onEdit: (
    brandId: number,
    segmentId: number,
    segment: customerSegmentUpdate,
    onClose: () => void
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

  return (
    <>
      <Flex className={style.SettingCustomerSegment}>
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
                onClick={() => onOpenCustomerSegment()}
              >
                <Text className={style.PopupButtonText}>
                  Cập nhật phân khúc khách hàng
                </Text>
              </Flex>
              <Divider />
              <Flex className={style.PopupButton} onClick={onOpen}>
                <Text className={style.PopupButtonText}>
                  Xoá phân khúc khách hàng
                </Text>
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
