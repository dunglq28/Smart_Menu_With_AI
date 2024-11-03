import { useCallback, useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialRowsPerPage?: number;
  initialRowsPerPageOptions?: number[];
}

function usePagination({ initialPage = 1, initialRowsPerPage = 5 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setCurrentPage(1);
    setRowsPerPage(newRowsPerPage);
  }, []);

  return {
    currentPage,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
  };
}

export default usePagination;
