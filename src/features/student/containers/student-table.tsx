import { Input, lang } from "@/core/libs";
import { BaseDataTables } from "@/features/_global/components/base-data-tables";
import { useAttendanceActions } from "@/features/student/hooks";
import { useMemo, useState } from "react";
import { useClassroomOptions, useSchoolOptions } from "../hooks/use-format-school-class";
import { studentColumnWithFilter } from "../utils";

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
  onSearchChange: (value: string) => void;
  onUpdateRFID?: any; // Tambahkan prop untuk update RFID
}

export function StudentTable({
  data,
  isLoading,
  pagination,
  sorting,
  onSortingChange,
  onSearchChange,
  onUpdateRFID
}: StudentTableProps) {
  const schoolOptions = useSchoolOptions();
  const classroomOptions = useClassroomOptions();
  const { handleAttendRemove } = useAttendanceActions();
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Compute duplicate names
  const duplicateNames = useMemo(() => {
    const nameCounts = new Map<string, number>();
    const duplicates = new Set<string>();

    data.forEach((student) => {
      const name = (student.name || student.user?.name || "").toLowerCase().trim();
      if (name) {
        const count = (nameCounts.get(name) || 0) + 1;
        nameCounts.set(name, count);
        if (count > 1) {
          duplicates.add(name);
        }
      }
    });

    return duplicates;
  }, [data]);

  const columns = useMemo(
    () =>
      studentColumnWithFilter({
        schoolOptions,
        classroomOptions,
        handleAttendRemove,
        duplicateNames, // Pass duplicate names to column definition
        onUpdateRFID
      }),
    [schoolOptions, classroomOptions, handleAttendRemove, duplicateNames]
  );

  // Handle search input change
  const handleSearchInput = (value: string) => {
    setSearchFilter(value);
    onSearchChange(value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative w-[300px]">
          <Input
            type="text"
            value={searchFilter}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder={lang.text("searchByNameOrNISNISN")}
            className="pr-8"
          />
          {searchFilter && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => handleSearchInput("")}
            >
              ✕
            </button>
          )}
          {isLoading && (
            <span className="absolute right-10 top-1/2 transform -translate-y-1/2">🔄</span>
          )}
        </div>
      </div>
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
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={pagination.onPageChange}
        onSizeChange={pagination.onSizeChange}
      />
    </div>
  );
}