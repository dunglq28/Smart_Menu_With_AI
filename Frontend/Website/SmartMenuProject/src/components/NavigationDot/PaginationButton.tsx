import React, { memo } from "react";
import { Button } from "@chakra-ui/react";
import { PaginationButtonProps } from "../../models/PaginationButton.model";

const PaginationButton: React.FC<PaginationButtonProps> = memo(
  ({
    onClick,
    isDisabled,
    bgColor,
    color,
    hoverStyles,
    text,
    fontSize,
    icon,
  }) => {
    return (
      <Button
        onClick={onClick}
        isDisabled={isDisabled}
        bgColor={bgColor}
        color={color}
        _hover={hoverStyles}
        fontSize={fontSize}
        padding="0"
        borderRadius="full"
        mr={1}
        ml={1}
        transition="all 0.7s ease"
      >
        {icon}
        {text}
        
      </Button>
    );
  }
);

export default PaginationButton;
