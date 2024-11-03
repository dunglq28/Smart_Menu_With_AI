import { ApiResponse } from "@/payloads";
import { useCallback } from "react";
import { toast } from "react-toastify";

interface UpdateParams<T> {
  updateFunction: (id: number, data: T, ...args: any[]) => Promise<ApiResponse<Object>>;
  fetchData: () => void;
  onClose?: () => void;
}

export default function useUpdate<T>({ updateFunction, fetchData }: UpdateParams<T>) {
  const handleEdit = useCallback(
    async (id: number, data: T, onClose?: () => void, ...args: any[]) => {
      try {
        const result = await updateFunction(id, data, ...args);
        if (result.statusCode === 200) {
          fetchData();
          toast.success("Cập nhật thành công");
          if (onClose) onClose();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Cập nhật thất bại");
      }
    },
    [updateFunction, fetchData],
  );

  return {
    handleEdit,
  };
}
