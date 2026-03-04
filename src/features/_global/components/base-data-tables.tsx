import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  jsonHelper,
  lang,
} from "@/core/libs";
import { useClassroom } from "@/features/classroom";
import { GraduationDialog, GraduationFilterDialog } from "@/features/graduation/components";
import { searchParamsToObject } from "@itokun99/http";
import {
  ColumnDef,
  ColumnFilter,
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
import { useDebounce, useVokadialog } from "../hooks";
import { Vokadialog } from "./dialog";
import {
  BaseFilterBadges,
  BaseFilterDialogContent,
  BaseFilterDialogFooter,
  BaseGlobalSearch,
  BaseTablePagination,
} from "./table";

export interface BaseDataTableFilterValueItem {
  label: string;
  value: string | number;
}

interface ColFilter extends ColumnFilter {
  label: string;
}

export interface BaseDataTableProps {
  columns: ColumnDef<any, any>[];
  data: unknown[];
  dataFallback: unknown[];
  initialState?: any;
  globalSearch?: boolean;
  searchPlaceholder?: string;
  isLoading?: boolean;
  totalItems: number;
  graduation?: boolean;
  pageIndex: number;
  schoolOptions?: { label: string; value: any }[];
  classroomOptions?: { label: string; value: any }[];
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  pageSize?: number;
  showFilterButton?: boolean;
  showLengthData?: boolean;
}

export const BaseDataTables = ({
  columns,
  data,
  dataFallback,
  graduation = false,
  initialState,
  globalSearch = true,
  searchPlaceholder = "Search...",
  isLoading,
  totalItems,
  pageIndex,
  onPageChange,
  onSizeChange,
  pageSize = 50,
  schoolOptions = [],
  classroomOptions = [],
  showFilterButton = true,
  showLengthData
}: BaseDataTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openGraduation, setOpenGraduation] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [selectSchool, setSelectSchool] = useState<number | "">("");
  const [selectClass, setSelectClass] = useState<number | "">("");
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const filterDialog = useVokadialog();
  const classRoom = useClassroom();

  const keywordFromParams = searchParams.get("keyword") || "";
  const [globalFilter, setGlobalFilter] = useState(keywordFromParams);
  const [nisFilter, setNisFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const debouncedKeyword = useDebounce(globalFilter, 300);
  const debouncedNameFilter = useDebounce(nameFilter, 300);

  // Map selectClass to class name
  const className = useMemo(() => {
    if (selectClass !== "" && selectClass !== undefined && selectClass !== null) {
      // Try classroomOptions first
      const option = classroomOptions.find((opt) => opt.value === selectClass);
      if (option) {
        return option.label;
      }
      // Fallback to useClassroom
      const cls = classRoom?.data?.find((c: any) => c.id === selectClass);
      return cls?.namaKelas || "Unknown Class";
    }
    return "";
  }, [selectClass, classroomOptions, classRoom?.data]);

  const handleOpenGraduationDialog = () => {
    setOpenGraduation(!openGraduation);
  };

  const handleCloseFilter = () => {
    setShowFilter(false);
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  };

  const handleReset = () => {
    setSelectClass("");
    setSelectSchool("");
    setShowFilter(false);
  };

  const handleApplyFilter = (schoolId: number, classId: number) => {
    setSelectSchool(schoolId);
    setSelectClass(classId);
  };

  const handleShowFilter = () => {
    setScrollPosition(window.scrollY);
    setShowFilter(true);
  };

  useEffect(() => {
    setSearchParams({
      ...searchParamsToObject(searchParams.toString()),
      keyword: debouncedKeyword,
      pageIndex: "0",
    });
  }, [debouncedKeyword]);

  // Fungsi untuk mengecek apakah string bisa dianggap sebagai angka
  const isNumericString = (value: string): boolean => {
    return /^\d+$/.test(value); // Cek apakah string hanya berisi angka
  };

  // Filter and sort data based on nisFilter, nameFilter, ratingFilter, selectSchool, and selectClass
  const filteredData = useMemo(() => {
    let result = data || dataFallback;

    // Only filter by surveiApps if ratingFilter is "highest" or "lowest"
    if (ratingFilter === "highest" || ratingFilter === "lowest") {
      result = result.filter((item: any) => {
        const surveiApps = item.surveiApps || item.user?.surveiApps;
        return surveiApps !== null && surveiApps !== undefined;
      });
    }

    if (nisFilter && isNumericString(nisFilter)) {
      result = result.filter((item: any) => {
        const nis = (item.nis?.toString() || item.user?.nis?.toString()) || "";
        const nisn = (item.nisn?.toString() || item.user?.nisn?.toString()) || "";
        return nis.includes(nisFilter) || nisn.includes(nisFilter);
      });
    }

    if (debouncedNameFilter) {
      result = result.filter((item: any) => {
        const name = (item.name || item.user?.name || "").toLowerCase();
        console.log('nameee', name)
        return name.includes(debouncedNameFilter.toLowerCase());
      });
    }

    if (selectSchool !== "" && selectSchool !== undefined && selectSchool !== null) {
      result = result.filter((item: any) => {
        const schoolId = item.sekolahId || item.user?.sekolahId || 0;
        return schoolId === selectSchool;
      });
    }

    if (selectClass !== "" && selectClass !== undefined && selectClass !== null) {
      result = result.filter((item: any) => {
        const classId = item.kelas?.id || item.idKelas || 0;
        return classId === selectClass;
      });
    }

    if (ratingFilter === "highest") {
      result = result.sort((a: any, b: any) => {
        const aRating = a.surveiApps || a.user?.surveiApps || 0;
        const bRating = b.surveiApps || b.user?.surveiApps || 0;
        return bRating - aRating;
      });
    } else if (ratingFilter === "lowest") {
      result = result.sort((a: any, b: any) => {
        const aRating = a.surveiApps || a.user?.surveiApps || 0;
        const bRating = b.surveiApps || b.user?.surveiApps || 0;
        return aRating - bRating;
      });
    }

    return result;
  }, [data, dataFallback, nisFilter, debouncedNameFilter, ratingFilter, selectSchool, selectClass]);

  const _data = useMemo(() => filteredData, [filteredData]);
  const pagination = { pageIndex, pageSize };

  const table = useReactTable({
    data: _data,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "auto",
  });

  const columnFilters: ColFilter[] = useMemo(() => {
    const filterParam = searchParams.get("filter");
    return filterParam ? jsonHelper.parse(filterParam) : [];
  }, [searchParams]);

  const renderTableHeader = () => (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );

  const renderTableBody = () => (
    <TableBody>
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center">
            {lang.text("loadData")}
          </TableCell>
        </TableRow>
      ) : table.getRowModel().rows.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center">
            {lang.text("emptyResult") || "Belum ada rating"}
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
  );

  return (
    <div className="w-full">
      {globalSearch && (
        <div className="flex justify-between items-baseline gap-4 mb-4">
          {graduation ? (
            <div className="flex flex-col">
              <div className="flex gap-4">
                <Input
                  type="text"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder={lang.text("search") || "Filter by name..."}
                  className="w-[300px] ml-auto"
                />
                <Button onClick={handleShowFilter} size="icon">
                  <Filter size={16} />
                </Button>
              </div>
              {selectClass !== null && selectClass !== "" && selectClass !== undefined ? (
                <Badge variant="default" className="w-max mt-4 px-4">{className}</Badge>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="flex-1">
              <BaseGlobalSearch
                value={globalFilter}
                onChange={setGlobalFilter}
                showFilterButton={showFilterButton}
                onFilterClick={filterDialog.open}
                searchPlaceholder={searchPlaceholder}
              />
            </div>
          )}
          <div className="flex items-center gap-4">
            {graduation ? (
              <Button variant="outline" onClick={handleOpenGraduationDialog}>
                {lang.text("addGraduation")}
              </Button>
            ) : (
              <></>
            )}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={nisFilter}
                onChange={(e) => setNisFilter(e.target.value)}
                placeholder={lang.text("filterNISorNISN") || "Filter by NIS or NISN..."}
                className="w-[300px]"
              />
              {/* <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[190px]">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="highest">Highest Rating (5 to 1)</SelectItem>
                  <SelectItem value="lowest">Lowest Rating (1 to 5)</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </div>
      )}
      <BaseFilterBadges
        filters={columnFilters}
        schoolOptions={schoolOptions}
        classroomOptions={classroomOptions}
      />

      <div className="rounded-md border">
        <Table>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </div>

      <BaseTablePagination
        table={table}
        totalItems={totalItems}
        pageSize={pageSize}
        pageIndex={pageIndex}
        onPageChange={onPageChange}
      />

      <Vokadialog
        title="Filter"
        visible={filterDialog.visible}
        onOpenChange={filterDialog.setVisible}
        content={<BaseFilterDialogContent table={table} />}
        footer={
          <BaseFilterDialogFooter
            onClose={filterDialog.close}
            filterToQueryParam={{
              "sekolah.namaSekolah": "sekolahId",
              idKelas: "idKelas",
            }}
          />
        }
      />

      <GraduationDialog open={openGraduation} onClose={handleOpenGraduationDialog} />
      <GraduationFilterDialog
        open={showFilter}
        onClose={handleCloseFilter}
        onReset={handleReset}
        onApply={handleApplyFilter}
        selectSchool={selectSchool}
        selectClass={selectClass}
      />
    </div>
  );
};