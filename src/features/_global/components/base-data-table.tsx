/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import {
  Badge,
  Button,
  ButtonProps,
  buttonVariants,
  cn,
  FormItem,
  Input,
  jsonHelper,
  Label,
  lang,
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
} from "@/core/libs";
import { searchParamsToObject } from "@itokun99/http";
import {
  ColumnDef,
  ColumnFilter,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  PaginationState,
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, Filter } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Link, URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useVokadialog } from "../hooks/use-vokadialog";
import { Vokadialog } from "./dialog";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "select" | "number";
    filterOptions?: {
      label: string;
      value: string | number;
    }[];
    filterLabel?: string;
    filterColumnVisible?: boolean;
    filterPlaceholder?: string;
  }
}

export interface BaseDataTableFilterValueItem {
  label: string;
  value: string | number;
}

interface ColFilter extends ColumnFilter {
  label: string;
}

type ColFilterState = ColFilter[];

export interface BaseDataTableProps {
  columns: ColumnDef<any, any>[];
  data: unknown[];
  dataFallback: unknown[];
  initialState?: InitialTableState;
  globalSearch?: boolean;
  searchPlaceholder?: string;
  isLoading?: boolean;
  renderAction?: React.ReactNode;
  searchParamPagination?: boolean;
  showFilterButton?: boolean;
  pageSize?: number;
  className?: string; // Styling tambahan untuk tabel
  rowClassName?: string; // Styling tambahan untuk setiap row
  cellClassName?: string;

  actions?: {
    title?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    url?: string;
    variant?: ButtonProps["variant"];
  }[];
  onRowClick?: (rowData: any) => void; // Tambahkan properti ini
}

export const BaseDataTable = ({
  searchPlaceholder = "Search something...",
  columns,
  data,
  dataFallback,
  globalSearch = true,
  initialState,
  isLoading = false,
  renderAction,
  searchParamPagination,
  showFilterButton,
  actions,
  pageSize,
}: BaseDataTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterSearchParams = useMemo(
    () => searchParams.get("filter"),
    [searchParams]
  );

  const filterDialog = useVokadialog();

  const columnFilters: ColFilterState = useMemo(
    () => (filterSearchParams ? jsonHelper.parse(filterSearchParams) : []),
    [filterSearchParams]
  );

  const [globalFilter, setGlobalFilter] = React.useState("");

  const paginationSearchParams = useMemo(
    () => ({
      pageIndex: !Number.isNaN(Number(searchParams.get("pageIndex")))
        ? Number(searchParams.get("pageIndex"))
        : 0,
      pageSize: !Number.isNaN(Number(searchParams.get("pageSize")))
        ? (Number(searchParams.get("pageSize")) || pageSize) || 20
        : 20,
    }),
    [searchParams]
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: searchParamPagination ? paginationSearchParams.pageIndex : 0,
    pageSize: searchParamPagination
      ? paginationSearchParams.pageSize
      : pageSize || 20,
  });

  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting || []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const _data = useMemo(() => data || dataFallback, [data, dataFallback]);

  const table = useReactTable({
    data: _data,
    columns: columns as ColumnDef<RowData, any>[],
    onSortingChange: setSorting,
    globalFilterFn: "auto",
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: searchParamPagination ? () => {} : setPagination,
    enableGlobalFilter: globalSearch,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: () => {},
    // debugAll: true,
    enableHiding: true,
    enableColumnFilters: true,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      pagination: searchParamPagination ? paginationSearchParams : pagination,
      ...(globalSearch && { globalFilter }),
    },
    initialState,
  });

  const handleNextPage = useCallback(() => {
    if (searchParamPagination && table.getCanNextPage()) {
      setSearchParams({
        ...searchParamsToObject(searchParams.toString()),
        pageIndex: String(table.getState().pagination.pageIndex + 1),
      } as URLSearchParamsInit);
      return;
    }

    table.nextPage();
  }, [table, searchParams, setSearchParams, searchParamPagination]);

  const handlePrevPage = useCallback(() => {
    if (searchParamPagination && table.getCanPreviousPage()) {
      setSearchParams({
        ...searchParamsToObject(searchParams.toString()),
        pageIndex: String(table.getState().pagination.pageIndex - 1),
      } as URLSearchParamsInit);
      return;
    }

    table.previousPage();
  }, [table, searchParamPagination, setSearchParams, searchParams]);

  const handleFirstPage = useCallback(() => {
    if (searchParamPagination && table.getCanPreviousPage()) {
      setSearchParams({
        ...searchParamsToObject(searchParams.toString()),
        pageIndex: String(0),
      } as URLSearchParamsInit);
      return;
    }

    table.firstPage();
  }, [table, searchParams, searchParamPagination, setSearchParams]);

  const handleLastPage = useCallback(() => {
    if (searchParamPagination && table.getCanNextPage()) {
      setSearchParams({
        ...searchParamsToObject(searchParams.toString()),
        pageIndex: String(table.getPageCount() - 1),
      } as URLSearchParamsInit);
      return;
    }

    table.lastPage();
  }, [table, searchParamPagination, searchParams, setSearchParams]);

  // useEffect(() => {
   
  // }, [searchParams, setSearchParams, searchParamPagination]);

  const renderTableHeader = () => {
    return (
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const { filterColumnVisible } =
                header.column.columnDef.meta || {};
              if (filterColumnVisible === false) {
                return null;
              }

              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
    );
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {lang.text("loadData")}
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (!table.getRowModel().rows?.length) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {lang.text("emptyResult")}
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => {
              const { filterColumnVisible } = cell.column.columnDef.meta || {};

              if (filterColumnVisible === false) {
                return null;
              }

              return (
                <TableCell key={cell.id} className="border-t border-white/30">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </>
    );
  };

  const renderContentFilterDialog = useCallback(() => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
        {table.getHeaderGroups().map((headerGroup) => (
          <React.Fragment key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const columnFilterValue = header.column.getFilterValue();

              const {
                filterLabel,
                filterOptions,
                filterVariant,
                filterPlaceholder,
              } = header.column.columnDef.meta ?? {};

              const isCanFilter =
                !header.isPlaceholder &&
                header.column.getCanFilter() &&
                Boolean(filterVariant);

              return !isCanFilter ? null : (
                <FormItem key={header.id}>
                  {filterVariant === "text" && (
                    <>
                      <Label>{filterLabel}</Label>
                      <Input
                        value={String(columnFilterValue || "")}
                        type="text"
                        placeholder={filterPlaceholder}
                      />
                    </>
                  )}

                  {filterVariant === "select" && (
                    <>
                      <Label>{filterLabel}</Label>
                      <Select
                        value={
                          columnFilterValue
                            ? String(columnFilterValue)
                            : undefined
                        }
                        onValueChange={(v) => {
                          const k = header.column.id;
                          const _v = !Number.isNaN(Number(v)) ? Number(v) : v;
                          let newFilter = [...columnFilters];

                          if (newFilter.find((d) => d.id === k)) {
                            newFilter = newFilter.filter((d) => d.id !== k);
                            newFilter = [
                              ...newFilter,
                              { id: k, value: _v, label: filterLabel || "" },
                            ];
                          } else {
                            newFilter = [
                              ...newFilter,
                              { id: k, value: _v, label: filterLabel || "" },
                            ];
                          }

                          setSearchParams({
                            ...searchParamsToObject(searchParams.toString()),
                            filter: jsonHelper.string(newFilter),
                          } as URLSearchParamsInit);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={filterPlaceholder} />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {filterOptions?.map((option, i) => {
                            return (
                              <SelectItem key={i} value={String(option.value)}>
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </FormItem>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  }, [columnFilters, setSearchParams, table, searchParams]);

  return (
    <>
      <div className="w-full">
        {globalSearch && (
          <>
            <div className="flex flex-col sm:flex-row mb-4 gap-2 sm:items-center sm:justify-between">
              <div className="flex-1 order-1 sm:order-none">
                <div className="flex flex-row gap-2">
                  <Input
                    placeholder={searchPlaceholder}
                    value={globalFilter || ""}
                    onChange={(e) => {
                      setGlobalFilter(String(e.target?.value));
                    }}
                    className="sm:max-w-[300px] flex-1"
                  />
                  {showFilterButton && (
                    <Button onClick={filterDialog.open} size="icon">
                      <Filter size={16} />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                {renderAction ||
                  actions?.map((action, i) => {
                    return action.url ? (
                      <Link
                        key={i}
                        className={cn(
                          buttonVariants({
                            variant: action?.variant || "default",
                          }),
                          "w-full sm:w-auto"
                        )}
                        to={action.url}
                      >
                        {action.icon ? (
                          <>
                            {action.icon}
                            <span className="ml-2">{action.title}</span>
                          </>
                        ) : (
                          action.title
                        )}
                      </Link>
                    ) : (
                      <Button
                        key={i}
                        onClick={action.onClick}
                        variant={action.variant || "default"}
                      >
                        {action.icon ? (
                          <>
                            {action.icon}
                            <span className="ml-2">{action.title}</span>
                          </>
                        ) : (
                          action.title
                        )}
                      </Button>
                    );
                  })}
              </div>
            </div>
            {columnFilters?.length > 0 ? (
              <div className="flex flex-row gap-2 mb-2">
                {columnFilters.map((c, i) => {
                  return <Badge key={i}>{`${c.label}: ${c.value}`}</Badge>;
                })}
              </div>
            ) : null}
          </>
        )}

        <div className="rounded-md border border-white/30">
          <Table>
            {renderTableHeader()}
            {renderTableBody()}
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {`${table.getFilteredRowModel().rows.length} / ${
              data.length
            } ${lang.text("data")}`}
          </div>
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFirstPage}
              disabled={!table.getCanPreviousPage()}
            >
              {lang.text("first")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLastPage}
              disabled={!table.getCanNextPage()}
            >
              {lang.text("last")}
            </Button>
          </div>
        </div>
      </div>
      <Vokadialog
        title="Filter"
        visible={filterDialog.visible}
        onOpenChange={filterDialog.setVisible}
        content={renderContentFilterDialog()}
        footer={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={filterDialog.close} className="w-full">
              {lang.text("apply")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchParams({
                  ...searchParamsToObject(searchParams.toString()),
                  filter: jsonHelper.string([]),
                } as URLSearchParamsInit);
                filterDialog.close();
              }}
              className="w-full"
            >
              {lang.text("reset")}
            </Button>
          </div>
        }
      />
    </>
  );
};