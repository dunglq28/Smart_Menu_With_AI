import React, { createContext, useContext, useState } from "react";

// Định nghĩa kiểu dữ liệu cho context
interface UserData {
  // Định nghĩa các trường dữ liệu của UserData ở đây
}

interface DataContextProps<T> {
  data: T[];
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOption: number[];
  totalPages: number;
  totalRecords: number;
  brandId: number;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPageOption: React.Dispatch<React.SetStateAction<number[]>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  setTotalRecords: React.Dispatch<React.SetStateAction<number>>;
  setBrandId: React.Dispatch<React.SetStateAction<number>>;
}

const DataContext = createContext<DataContextProps<any> | undefined>(undefined);

const DataProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rowsPerPageOption, setRowsPerPageOption] = useState<number[]>([5]);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [brandId, setBrandId] = useState<number>(0);

  const contextValue = {
    data,
    isLoading,
    currentPage,
    rowsPerPage,
    rowsPerPageOption,
    totalPages,
    totalRecords,
    brandId,
    setData,
    setIsLoading,
    setCurrentPage,
    setRowsPerPage,
    setRowsPerPageOption,
    setTotalPages,
    setTotalRecords,
    setBrandId,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

export { DataProvider, useDataContext };
