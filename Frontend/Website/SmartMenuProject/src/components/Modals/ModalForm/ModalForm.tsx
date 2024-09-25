import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Button,
  useDisclosure,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  Box,
  StepTitle,
  StepSeparator,
} from "@chakra-ui/react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import styles from "./ModalForm.module.scss";
import { themeColors } from "../../../constants/GlobalStyles";
import { BrandForm } from "../../../models/BrandForm.model";
import { BranchForm } from "../../../models/BranchForm.model";
import { UserForm } from "../../../models/UserForm.model";
import {
  getInitialBranchForm,
  getInitialBrandForm,
  getInitialUserForm,
} from "../../../utils/initialData";
import { CurrentForm } from "../../../constants/Enum";

interface ModalFormProps {
  isEdit?: boolean;
  stepperName?: CurrentForm;
  stepperIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  formBody: React.ReactNode;
  title: string;
  updateBrandData?: (data: BrandForm, isSave: boolean) => void;
  updateBranchData?: (data: BranchForm, isSave: boolean) => void;
  updateUserData?: (data: UserForm, isSave: boolean) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isEdit,
  stepperName,
  stepperIndex,
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
      updateBrandData(getInitialBrandForm(), false);
    }

    if (updateBranchData) {
      updateBranchData(getInitialBranchForm(), false);
    }

    if (updateUserData) {
      updateUserData(getInitialUserForm(), false);
    }

    onClose();
  }

  const steps = [
    {
      title:
        stepperName === CurrentForm.BRAND
          ? "Tạo thương hiệu mới"
          : "Tạo chi nhánh mới",
    },
    { title: "Tạo người dùng mới" },
  ];
  const index = stepperIndex ?? 0;

  const { activeStep, setActiveStep } = useSteps({
    index: index,
    count: steps.length,
  });

  useEffect(() => {
    setActiveStep(index);
  }, [index, setActiveStep]);

  const getSeparatorStyle = (status: string) => {
    switch (status) {
      case "complete":
        return { backgroundColor: themeColors.revenueDarkenColor };
      case "active":
        return { backgroundColor: "whiteAlpha.600" };
      case "incomplete":
        return { backgroundColor: "whiteAlpha.600" };
      default:
        return {};
    }
  };

  const isValidStep =
    (stepperIndex === 0 || stepperIndex === 1) &&
    (stepperName === CurrentForm.BRAND || stepperName === CurrentForm.BRANCH);

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
            backgroundColor={themeColors.darken50}
          >
            {!isEdit && isValidStep ? (
              <Box className={styles["wrapper-stepper"]}>
                <Stepper index={activeStep} w="90%">
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator
                        sx={{
                          "[data-status=complete] &": {
                            background: themeColors.revenueDarkenColor,
                            borderColor: themeColors.lighten20,
                            color: "white",
                          },
                          "[data-status=active] &": {
                            background: "white",
                            borderColor: themeColors.primaryButton,
                            color: themeColors.primaryButton,
                          },
                          "[data-status=incomplete] &": {
                            background: "gray.300",
                            borderColor: "gray.400",
                            color: "rgb(118 113 113)",
                          },
                        }}
                      >
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>

                      <StepStatus
                        complete={
                          <Box flexShrink="0" ml={2} maxW="180px">
                            <StepTitle className={styles["text-stepper"]}>{step.title}</StepTitle>
                          </Box>
                        }
                        active={
                          <Box flexShrink="0" ml={2} maxW="180px" fontSize="18px">
                            <StepTitle className={styles["text-stepper"]}>{step.title}</StepTitle>
                          </Box>
                        }
                        incomplete={
                          <Box flexShrink="0" ml={2} maxW="180px">
                            <StepTitle className={styles["text-stepper"]}>{step.title}</StepTitle>
                          </Box>
                        }
                      />

                      {index < steps.length - 1 && (
                        <StepSeparator
                          style={getSeparatorStyle(
                            index === activeStep
                              ? "active"
                              : index < activeStep
                              ? "complete"
                              : "incomplete",
                          )}
                        />
                      )}
                    </Step>
                  ))}
                </Stepper>
              </Box>
            ) : (
              <>
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
              </>
            )}
          </ModalHeader>

          {formBody}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalForm;
