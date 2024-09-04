import { extendTheme } from "@chakra-ui/react";
import { tableTheme } from "./table";

const theme = extendTheme({
    components: { Table: tableTheme },
    colors: {
      brand: {
        100: "#b9d7d5",
        200: "#a0c4c3",
      },
    },
  });

  export default theme;