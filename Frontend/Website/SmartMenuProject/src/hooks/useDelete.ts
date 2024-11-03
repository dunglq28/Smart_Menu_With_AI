import { ApiResponse } from "@/payloads";
import { useCallback } from "react";
import { toast } from "react-toastify";

interface DeleteParams {
  deleteFunction: (id: number, ...args: any[]) => Promise<ApiResponse<Object>>;
  fetchData: () => void;
}

interface PaginationParams {
  currentPage: number;
  rowsPerPage: number;
  totalRecords: number;
  handlePageChange: (page: number) => void;
}

export default function useDelete<T>(
  { deleteFunction, fetchData }: DeleteParams,
  { currentPage, rowsPerPage, totalRecords, handlePageChange }: PaginationParams,
) {
  const handleDelete = useCallback(
    async (id: number, ...args: any[]) => {
      try {
        const result = await deleteFunction(id, ...args);
        if (result.statusCode === 200) {
          if ((totalRecords - 1) % rowsPerPage === 0 && currentPage > 1) {
            handlePageChange(currentPage - 1);
          } else {
            fetchData();
          }
          toast.success("Xoá thành công");
        } else {
          toast.success(result.message);
        }
      } catch (error) {
        toast.error("Xoá thất bại");
      }
    },
    [deleteFunction, fetchData],
  );

  return {
    handleDelete,
  };
}
