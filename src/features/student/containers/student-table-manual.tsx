import { BaseDataTables } from "@/features/_global/components/base-data-tables";
import { useAttendanceActions } from "@/features/student/hooks";
import { useMemo } from "react";
import { useClassroomOptions, useSchoolOptions } from "../hooks/use-format-school-class";
import { studentColumnWithFilterForAbsenceManual } from "../utils";

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

export function StudentTableManual({
  data,
  isLoading,
  pagination,
  sorting,
  onSortingChange,
}: StudentTableProps) {
  const schoolOptions = useSchoolOptions();
  const classroomOptions = useClassroomOptions();
  const { handleAttend, handleAttendGoHome } = useAttendanceActions();

  // Memoize columns untuk mencegah regenerasi yang tidak perlu
  const columns = useMemo(
    () =>
      studentColumnWithFilterForAbsenceManual({
        schoolOptions,
        classroomOptions,
        handleAttend,
        handleAttendGoHome
      }),
    [schoolOptions, classroomOptions, handleAttend, handleAttendGoHome]
  );

  console.log('data absen manual:', data)

  return (
    <div className="flex flex-col">
      <BaseDataTables
        columns={columns}
        data={data}
        globalSearch={false}
        showFilterButton={false}
        isLoading={isLoading}
        searchParamPagination
        initialState={{ sorting }}
        onSortingChange={onSortingChange}
        pageIndex={pagination.pageIndex}
        pageSize={data?.length}
        totalItems={pagination.totalItems}
        onPageChange={pagination.onPageChange}
        onSizeChange={pagination.onSizeChange}
      />
    </div>
  );
}
