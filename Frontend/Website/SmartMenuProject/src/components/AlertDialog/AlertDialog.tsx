import React, { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import style from "./AlertDialog.module.scss";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  titleHeader: string;
  titleBody: string;
  btnName: string;
}

const CustomAlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  titleHeader,
  titleBody,
  btnName,
}) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {titleHeader}
          </AlertDialogHeader>

          <AlertDialogBody>{titleBody}</AlertDialogBody>

          <AlertDialogFooter>
            <Button colorScheme="red" ref={cancelRef} onClick={onClose}>
              Huỷ
            </Button>
            <Button className={style.primaryButton} onClick={onDelete} ml={3}>
              {btnName}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
