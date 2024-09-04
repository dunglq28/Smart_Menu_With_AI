export interface NavigationDotProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
    rowsPerPageOptions: number[];
    onRowsPerPageChange: (rowsPerPage: number) => void;
  }