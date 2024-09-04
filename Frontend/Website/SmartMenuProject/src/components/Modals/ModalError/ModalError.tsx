import React, { useEffect, useState } from "react";
import { Button, Flex, ModalBody, ModalFooter, Text } from "@chakra-ui/react";
import style from "./ModalError.module.scss";
import { CustomerSegmentForm } from "../../../models/SegmentForm.model";

interface ModalErrorProps {
  errorMessage: string;
  onClose: () => void;
  onOpenPrev: () => void;
  form?: CustomerSegmentForm;
}

const ModalError: React.FC<ModalErrorProps> = ({
  errorMessage,
  onClose,
  onOpenPrev,
  form
}) => {
  const formattedErrorMessage = errorMessage.split("/n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const openFormPreviousHandler = () => {
    onClose();
    setTimeout(() => {
      onOpenPrev();
    }, 350);
  };

  return (
    <>
      <ModalBody>
        <Flex className={style.ModalBody}>
          <Text className={style.ErrorText}>{formattedErrorMessage}</Text>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Flex className={style.Footer}>
          <Button
            variant="ghost"
            backgroundColor="#ccc"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            className={style.AddSegmentBtn}
            onClick={openFormPreviousHandler}
          >
            Back
          </Button>
        </Flex>
      </ModalFooter>
    </>
  );
};

export default ModalError;
