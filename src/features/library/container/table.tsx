import { BaseDataTables } from "@/features/_global/components/base-data-tables";
import { useMemo } from "react";
// import { useClassroomOptions, useSchoolOptions } from "../hooks/use-format-school-class";
import { LibraryColumnWithFilter } from "../utils";

interface StudentTableProps {
  data: any[];
  isLoading: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (newPage: number) => void;
    onSizeChange: (newSize: number) => void;
  };
  sorting: any[];
  onSortingChange: (sort: any[]) => void;
}


export function LibraryTable({
  data,
  isLoading,
  pagination,
  sorting,
  onSortingChange,
}: StudentTableProps) {
  const columns = useMemo(() => LibraryColumnWithFilter(), []);
  
  return (
    <>
      <BaseDataTables
        columns={columns}
        data={data}
        globalSearch={false}
        searchParamPagination
        showFilterButton={false}
        isLoading={isLoading}
        initialState={{ sorting }}
        onSortingChange={onSortingChange}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={pagination.onPageChange}
        onSizeChange={pagination.onSizeChange}
      />
    </>

  );
}

