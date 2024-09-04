import React, { useCallback, useMemo } from "react";
import { Stack, Text, Select } from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@chakra-ui/icons";
import PaginationButton from "./PaginationButton";
import styles from "./NavigationDot.module.scss";
import { NavigationDotProps } from "../../models/NavigationProp.model";
import { themeColors } from "../../constants/GlobalStyles";

const NavigationDot: React.FC<NavigationDotProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  rowsPerPageOptions,
  onRowsPerPageChange,
}) => {
  const Colors = {
    primaryColor: themeColors.primaryButton,
    secondaryColor: themeColors.secondaryColor,
    whiteColor: "#fff",
  };

  const { primaryColor, secondaryColor, whiteColor } = Colors;

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
        onPageChange(newPage);
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      onRowsPerPageChange(newRowsPerPage);
    },
    [onRowsPerPageChange]
  );

  const buttons = useMemo(() => {
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const result: JSX.Element[] = [];

    for (let i = startPage; i <= endPage; i++) {
      result.push(
        <PaginationButton
          key={i}
          onClick={() => handlePageChange(i)}
          bgColor={currentPage === i ? primaryColor : secondaryColor}
          color={currentPage === i ? whiteColor : primaryColor}
          hoverStyles={{ bg: primaryColor, color: whiteColor }}
          text={i.toString()}
          icon={null}
          fontSize="12px"
        />
      );
    }

    return result;
  }, [currentPage, totalPages, handlePageChange, primaryColor, secondaryColor, whiteColor]);

  return (
    <Stack
      direction="row"
      spacing={2}
      justify="center"
      align="center"
      mb={20}
      mt={6}
    >
      <Stack
        direction="row"
        spacing={2}
        align="center"
        justify="center"
        flex="1"
        ml={10}
      >
        <PaginationButton
          onClick={() => handlePageChange(1)}
          isDisabled={currentPage === 1}
          bgColor={whiteColor}
          color={primaryColor}
          hoverStyles={
            currentPage === 1
              ? { bg: "inherit", color: "inherit" }
              : { bg: primaryColor, color: whiteColor }
          }
          fontSize="10px"
          icon={<ArrowLeftIcon />}
        />
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          bgColor={whiteColor}
          color={primaryColor}
          hoverStyles={
            currentPage === 1
              ? { bg: "inherit", color: "inherit" }
              : { bg: primaryColor, color: whiteColor }
          }
          text=""
          fontSize="20px"
          icon={<ChevronLeftIcon />}
        />
        {buttons}
        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          bgColor={whiteColor}
          color={primaryColor}
          hoverStyles={
            currentPage === totalPages
              ? { bg: "inherit", color: "inherit" }
              : { bg: primaryColor, color: whiteColor }
          }
          text=""
          fontSize="20px"
          icon={<ChevronRightIcon />}
        />
        <PaginationButton
          onClick={() => handlePageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          bgColor={whiteColor}
          color={primaryColor}
          hoverStyles={
            currentPage === totalPages
              ? { bg: "inherit", color: "inherit" }
              : { bg: primaryColor, color: whiteColor }
          }
          fontSize="10px"
          icon={<ArrowRightIcon />}
        />
      </Stack>

      <Stack direction="row" spacing={2} align="center" mr={10}>
        <Text className={styles.NavDotText}>Hàng trên mỗi trang</Text>
        <Select
          onChange={handleRowsPerPageChange}
          width="70px"
          className={styles.NavDotSelect}
        >
          {rowsPerPageOptions.map((row, i) => (
            <option key={i} className={styles.NavDotSelect} value={row}>
              {row}
            </option>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};

export default NavigationDot;
