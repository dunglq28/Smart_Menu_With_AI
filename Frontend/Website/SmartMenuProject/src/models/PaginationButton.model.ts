import { ButtonProps } from "@chakra-ui/react";

export interface PaginationButtonProps extends ButtonProps {
    onClick: () => void;
    isDisabled?: boolean;
    bgColor: string;
    color: string;
    hoverStyles: { bg: string; color: string };
    text?: string;
    fontSize?: string;
    icon: React.ReactNode;
}