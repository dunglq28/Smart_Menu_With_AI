import { GetData } from "@/payloads";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

interface FetchDataParams<T> {
  fetchFunction: (
    page: number,
    limit: number,
    searchValue?: string,
    ...args: any[]
  ) => Promise<GetData<T>>;
  initialSearchValue?: string;
  isAllLoad?: boolean;
}

interface UseFetchDataResult<T> {
  data: T[];
  isLoading: boolean;
  isInitialLoad: boolean;
  setIsLoading: (value: boolean) => void;
  setIsInitialLoad: (value: boolean) => void;
  fetchData: (searchValue?: string) => void;
  totalPages: number;
  totalRecords: number;
}

export default function useFetchData<T>(
  { fetchFunction, initialSearchValue = "", isAllLoad = false }: FetchDataParams<T>,
  pagination: { currentPage: number; rowsPerPage: number },
): UseFetchDataResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchData = useCallback(
    async (searchValue = initialSearchValue, isLoad = isAllLoad, ...args: any[]) => {
      try {
        setIsLoading(true);
        const loadData = async () => {
          const result = await fetchFunction(
            pagination.currentPage,
            pagination.rowsPerPage,
            searchValue,
            ...args,
          );
          setData(result.list);
          setTotalPages(result.totalPage);
          setTotalRecords(result.totalRecord);
          setIsLoading(false);
          if (isInitialLoad) {
            setIsInitialLoad(false);
          }
        };
        if (isInitialLoad || isLoad) {
          setTimeout(async () => {
            await loadData();
          }, 500);
        } else {
          await loadData();
        }
      } catch (error) {
        toast.error("Error fetching data");
        setIsLoading(false);
      }
    },
    [pagination.currentPage, pagination.rowsPerPage, initialSearchValue, isInitialLoad],
  );

  return {
    data,
    isLoading,
    isInitialLoad,
    setIsLoading,
    setIsInitialLoad,
    fetchData,
    totalPages,
    totalRecords,
  };
}
