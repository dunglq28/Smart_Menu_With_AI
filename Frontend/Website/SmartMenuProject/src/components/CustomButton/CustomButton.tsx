import {
  Text,
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

interface CustomButtonProps {
  styleAdd?: string;
  text: string;
  icon: IconType;
  color: string;
  modalContent?: React.ReactNode;
  title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  styleAdd,
  text,
  icon,
  color,
  modalContent,
  title,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex gap={0} mr={0}>
        <Button
          bg={color}
          color="white"
          px={3}
          _hover={{
            opacity: 0.9,
          }}
          className={styleAdd}
          onClick={onOpen}
        >
          <Text as="span" fontSize="25px" me={3}>
            {React.createElement(icon)}
          </Text>
          {text}
        </Button>
      </Flex>

    </>
  );
};

export default CustomButton;
