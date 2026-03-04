import { BaseDataTablesGraduation } from "@/features/_global/components/base-table-graduation";
import { useMemo } from "react";
import { useClassroomOptions, useSchoolOptions } from "../hooks/use-format-graduation-class";
import { graduationColumnWithFilter } from "../utils";
interface GraduationTableProps {
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

export function GraduationTable({
  data,
  isLoading,
  pagination,
  sorting,
  onSortingChange,
  onDownloadPDF
}: GraduationTableProps) {
  const schoolOptions = useSchoolOptions();
  const classroomOptions = useClassroomOptions();

  const columns = useMemo(() => graduationColumnWithFilter({
    schoolOptions,
    classroomOptions,
    onDownloadPDF
  }), [schoolOptions, classroomOptions]);
  return (
    <>
      <BaseDataTablesGraduation
        columns={columns}
        data={data}
        globalSearch
        graduation={true}
        searchParamPagination
        showFilterButton
        isLoading={isLoading}
        initialState={{ sorting }}
        onSortingChange={onSortingChange}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={pagination.onPageChange}
        onSizeChange={pagination.onSizeChange}

        schoolOptions={schoolOptions}           // ⬅️ Tambah props ini
        classroomOptions={classroomOptions}
      />
    </>

  );
}

