import { extendTheme } from "@chakra-ui/react";
import { tableTheme } from "./tableTheme";
import { themeColors } from "@/constants";

const commonCheckboxStyles = {
  bg: "brand.500",
  borderColor: "brand.500",
  color: "white",
  _hover: {
    bg: "brand.500",
    borderColor: "brand.500",
    color: "white",
    opacity: 0.8,
  },
};

const theme = extendTheme({
  components: {
    Table: tableTheme,
    Checkbox: {
      baseStyle: {
        control: {
          _checked: commonCheckboxStyles,
          _indeterminate: commonCheckboxStyles,
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
  },
  colors: {
    brand: {
      500: themeColors.sidebarBgColor,
    },
  },
});

export default theme;
