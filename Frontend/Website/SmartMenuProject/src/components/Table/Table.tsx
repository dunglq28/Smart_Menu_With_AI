import {
  Box,
  Checkbox,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";

import style from "./Table.module.scss";
import { useEffect, useState } from "react";
import { Icons } from "@/assets";
import { TableColumn } from "./TableColumn";
import { Loading } from "@/components";
import { ActionBar } from "../ActionBar/ActionBar";

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: Extract<keyof T, string>;
  handleSortClick: (field: string) => void;
  selectedColumn: string;
  rotation: number;
  isLoading: boolean;
  isInitialLoad: boolean;
  currentPage: number;
  rowsPerPage: number;
  caption: string;
  notifyNoData: string;
  renderAction?: (item: T) => React.ReactNode;
  isView?: boolean;
}

const TableComponent = <T extends {}>({
  columns,
  rows,
  rowKey,
  handleSortClick,
  selectedColumn,
  rotation,
  isInitialLoad,
  isLoading,
  currentPage,
  rowsPerPage,
  caption,
  notifyNoData,
  renderAction,
  isView = false,
}: TableProps<T>) => {
  const [selection, setSelection] = useState<string[]>([]);

  const hasSelection = selection.length > 0;
  const allSelected = hasSelection && selection.length === rows.length;
  const indeterminate = hasSelection && !allSelected;

  const toggleAllSelection = (isChecked: boolean) => {
    setSelection(isChecked ? rows.map((row) => row[rowKey] as string) : []);
  };

  const toggleRowSelection = (rowId: string) => {
    setSelection((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId],
    );
  };

  useEffect(() => {
    setSelection([]);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    console.log("Updated selection:", selection);
  }, [selection]);

  return (
    <>
      <TableContainer className={style.Tbl}>
        <Table>
          <TableCaption>{caption}</TableCaption>
          <Thead >
            <Tr>
              {!isView && (
                <Th className={style.HeaderTbl}>
                  <Checkbox
                    className={style.CheckboxTbl}
                    isChecked={allSelected}
                    isIndeterminate={indeterminate}
                    onChange={(e) => toggleAllSelection(e.target.checked)}
                  />
                </Th>
              )}

              <Th className={style.HeaderTbl}>Id</Th>
              {columns.map((col, index) => {
                const isSortable = col.isSort === undefined || col.isSort;
                return (
                  <Th
                    key={index}
                    className={`${style.HeaderTbl} ${isSortable && style.pointer}`}
                    onClick={isSortable ? () => handleSortClick(col.field.toString()) : undefined}
                  >
                    <Tooltip
                      hasArrow
                      label="Click để sắp xếp"
                      isDisabled={!isSortable}
                      placement="top"
                      bg="green.500"
                    >
                      <Flex className={style.HeaderCol}>
                        {col.header}
                        {isSortable && (
                          <Box
                            className={style.IconSort}
                            style={{
                              opacity: selectedColumn === col.field ? 1 : undefined,
                              transform: `rotate(${
                                selectedColumn === col.field ? rotation : 360
                              }deg)`,
                              transition: "transform 0.3s ease-in-out",
                            }}
                          >
                            <Icons.sort />
                          </Box>
                        )}
                      </Flex>
                    </Tooltip>
                  </Th>
                );
              })}
              {renderAction && <Th className={`${style.HeaderTbl} ${style.sticky}`}>Cài đặt</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {isInitialLoad && isLoading ? (
              <Tr>
                <Td colSpan={10} className={style.LoadingCell}>
                  <Loading />
                </Td>
              </Tr>
            ) : rows.length === 0 ? (
              <Tr>
                <Td colSpan={10}>{notifyNoData}</Td>
              </Tr>
            ) : (
              rows.map((row, index) => {
                const rowId = row[rowKey] as string;
                const isSelected = selection.includes(rowId);

                return (
                  <Tr
                    key={rowId}
                    className={`${style.Item} ${isSelected ? style.SelectedRow : ""}`}
                  >
                    {!isView && (
                      <Td>
                        <Checkbox
                          className={style.CheckboxTbl}
                          isChecked={isSelected}
                          onChange={() => toggleRowSelection(rowId)}
                        />
                      </Td>
                    )}

                    <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td>
                    {columns.map((col, colIndex) => (
                      <Td
                        key={`${colIndex}-${rowId}`}
                        className={col.className || style.DefaultCell}
                      >
                        {col.accessor(row) ?? "N/A"}
                      </Td>
                    ))}
                    {renderAction && <Td className={style.sticky}>{renderAction(row)}</Td>}
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <ActionBar selectedCount={selection.length} />
    </>
  );
};

export default TableComponent;
