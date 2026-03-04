import { BaseDataTables } from "@/features/_global/components/base-data-tables";
import { useAttendanceActions } from "@/features/student/hooks"; // Impor custom hook
import { useMemo } from "react";
import { useClassroomOptions, useSchoolOptions } from "../hooks/use-format-school-class";
import { studentLibraryColumnWithFilter } from "../utils";
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


export function StudentTableLibrary({
  data,
  isLoading,
  pagination,
  sorting,
  onSortingChange,
}: StudentTableProps) {
  const schoolOptions = useSchoolOptions();
  const classroomOptions = useClassroomOptions();
  const { handleAttend } = useAttendanceActions(); // Panggil custom hook
  const columns = useMemo(() => studentLibraryColumnWithFilter({
    schoolOptions,
    classroomOptions,
    handleAttend
  }), [schoolOptions, classroomOptions]);
  
  return (
    <>
      <BaseDataTables
        columns={columns}
        data={data}
        globalSearch
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

        schoolOptions={schoolOptions}           // ⬅️ Tambah props ini
        classroomOptions={classroomOptions}
      />
    </>

  );
}

