import {
    Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  lang,
} from "@/core/libs";
import { useClassroom } from "@/features/classroom";
import { GraduationDialog, GraduationFilterDialog } from "@/features/graduation/components";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks";
import { BaseTablePagination } from "./table";

export interface BaseDataTableProps {
  columns: ColumnDef<any, any>[];
  data: unknown[];
  dataFallback: unknown[];
  initialState?: any;
  globalSearch?: boolean;
  isLoading?: boolean;
  totalItems: number;
  graduation?: boolean;
  pageIndex: number;
  schoolOptions?: { label: string; value: any }[];
  classroomOptions?: { label: string; value: any }[];
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  pageSize?: number;
}

export const BaseDataTablesGraduation = ({
  columns,
  data,
  dataFallback,
  graduation = false,
  initialState,
  globalSearch = true,
  isLoading,
  totalItems,
  pageIndex,
  onPageChange,
  onSizeChange,
  pageSize = 50, // Default ke 50
  schoolOptions = [],
  classroomOptions = [],
}: BaseDataTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>(initialState?.sorting || []);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [selectSchool, setSelectSchool] = useState<number | "">("");
  const [selectClass, setSelectClass] = useState<number | "">("");
  const [globalFilter, setGlobalFilter] = useState(searchParams.get("keyword") || "");
  const [nameFilter, setNameFilter] = useState("");
  const debouncedNameFilter = useDebounce(nameFilter, 300);
  const classRoom = useClassroom();

  // Map selectClass ke nama kelas
  const className = useMemo(() => {
    if (selectClass) {
      const option = classroomOptions.find((opt) => opt.value === selectClass);
      if (option) return option.label;
      const cls = classRoom?.data?.find((c: any) => c.id === selectClass);
      return cls?.namaKelas || "Unknown Class";
    }
    return "";
  }, [selectClass, classroomOptions, classRoom?.data]);

  // Filter data
  const filteredData = useMemo(() => {
    let result = data || dataFallback;
    if (debouncedNameFilter) {
      result = result.filter((item: any) =>
        (item.name || item.user?.name || "").toLowerCase().includes(debouncedNameFilter.toLowerCase())
      );
    }
    if (selectSchool) {
      result = result.filter((item: any) => (item.sekolahId || item.user?.sekolahId || 0) === selectSchool);
    }
    if (selectClass) {
      result = result.filter((item: any) => (item.kelas?.id || item.idKelas || 0) === selectClass);
    }
    return result;
  }, [data, dataFallback, debouncedNameFilter, selectSchool, selectClass]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pageIndex, pageSize]);

  // Setup tabel dengan pagination
  const table = useReactTable({
    data: paginatedData,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(filteredData.length / pageSize), // Gunakan filteredData.length
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    setSearchParams({ keyword: debouncedNameFilter, pageIndex: "0" });
  }, [debouncedNameFilter]);

  return (
    <div className="w-full">
      {globalSearch && (
        <div className="flex justify-between items-baseline gap-4 mb-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder={lang.text("searchStudentByName") || "Filter by name..."}
                className="w-[300px]"
              />
              <Button onClick={() => setShowFilter(true)} size="icon">
                <Filter size={16} />
              </Button>
            </div>
            {selectClass && <Badge className="w-max px-4">{className}</Badge>}
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {lang.text("loadData")}
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {lang.text("emptyResult") || "Belum ada data"}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BaseTablePagination
        table={table}
        totalItems={filteredData.length} // Gunakan filteredData.length
        pageSize={pageSize}
        pageIndex={pageIndex}
        onPageChange={onPageChange}
      />

      <GraduationFilterDialog
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onReset={() => {
          setSelectClass("");
          setSelectSchool("");
          setShowFilter(false);
        }}
        onApply={(schoolId, classId) => {
          setSelectSchool(schoolId);
          setSelectClass(classId);
        }}
        selectSchool={selectSchool}
        selectClass={selectClass}
      />
    </div>
  );
};