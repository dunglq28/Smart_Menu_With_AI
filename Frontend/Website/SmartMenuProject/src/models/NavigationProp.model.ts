export interface NavigationDotProps {
  totalPages: number;
  currentPage: number;
  rowsPerPage?: number;
  rowsPerPageOptions: number[];
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}
