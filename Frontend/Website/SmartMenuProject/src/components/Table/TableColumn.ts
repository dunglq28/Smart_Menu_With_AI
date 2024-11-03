export interface TableColumn<T> {
  header: string;
  field: keyof T;
  isSort?: boolean;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}
