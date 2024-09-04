import React, { MouseEventHandler, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import styles from "./ModalForm.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";
import { BrandForm } from "../../../models/BrandForm.model";
import { BranchForm } from "../../../models/BranchForm.model";
import { UserForm } from "../../../models/UserForm.model";
import {
  getInitialBranchData,
  getInitialBrandData,
  getInitialUserData,
} from "../../../utils/initialData";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  formBody: React.ReactNode;
  title: string;
  updateBrandData?: (data: BrandForm, isSave: boolean) => void;
  updateBranchData?: (data: BranchForm, isSave: boolean) => void;
  updateUserData?: (data: UserForm, isSave: boolean) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  formBody,
  title,
  updateBrandData,
  updateBranchData,
  updateUserData,
}) => {
  function cancelHandler() {
    if (updateBrandData) {
      updateBrandData(getInitialBrandData(), false);
    }

    if (updateBranchData) {
      updateBranchData(getInitialBranchData(), false);
    }

    if (updateUserData) {
      updateUserData(getInitialUserData(), false);
    }

    onClose();
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={cancelHandler}
        motionPreset="slideInBottom"
      >
        <ModalOverlay onClick={cancelHandler} />
        <ModalContent borderRadius="23px" maxW="40%">
          <ModalHeader
            className={styles["modal-header"]}
            backgroundColor={themeColors.primaryButton}
          >
            {title}
            <Button
              bg="none"
              p={0}
              color="white"
              fontSize="25px"
              className={styles["close-button"]}
              onClick={cancelHandler}
            >
              <IoMdCloseCircleOutline />
            </Button>
          </ModalHeader>
          {formBody}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalForm;
