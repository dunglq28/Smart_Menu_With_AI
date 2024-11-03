import { useCallback, useEffect, useState } from "react";

interface UseSortProps {
  initialField?: string;
  initialDirection?: "asc" | "desc";
}

function useSort({ initialField = "id", initialDirection = "asc" }: UseSortProps) {
  const [sortField, setSortField] = useState<string>(initialField);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialDirection);
  const [rotation, setRotation] = useState<number>(360);

  const handleSortChange = useCallback(
    (field: string) => {
      if (sortField === field) {
        const newDirection = sortDirection === "asc" ? "desc" : "asc";
        setSortDirection(newDirection);
        setRotation((prevRotation) => (prevRotation === 180 ? 360 : 180));
      } else {
        setSortField(field);
        setSortDirection("asc");
        setRotation(360);
      }
    },
    [sortField, sortDirection],
  );

  return {
    sortField,
    sortDirection,
    rotation,
    handleSortChange,
  };
}

export default useSort;
