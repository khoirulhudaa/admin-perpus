import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Input, lang } from '@/core/libs';
import { FaSpinner } from 'react-icons/fa';

interface BaseDataTableProps<T> {
  students?: any[];
  columns: ColumnDef<T>[];
  data: T[];
  dataFallback: T[];
  globalSearch?: boolean;
  pageSize?: number;
  searchPlaceholder?: string;
  isLoading?: boolean;
  searchParamPagination?: boolean;
}

export const BaseDataTableProvince = <T,>({
  students = [],
  columns = [],
  data,
  dataFallback,
  globalSearch = false,
  pageSize = 10,
  searchPlaceholder = lang.text('search'),
  isLoading = false,
  searchParamPagination = false,
}: BaseDataTableProps<T>) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const tableData = useMemo(() => {
    if (isLoading) return []; // Kembalikan array kosong saat loading
    return data && data.length > 0 ? data : dataFallback;
  }, [data, dataFallback, isLoading]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize },
    },
  });

  return (
    <div className="w-full">
      {globalSearch && (
        <div className="mb-4">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm border-gray/20 bg-transparent text-gray-100 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          />
        </div>
      )}
      <div className="overflow-x-auto shadow-lg">
        <table className="w-full border-collapse bg-transparent text-gray-100">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-transparent">
                {headerGroup.headers.map((header, headerIndex) => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 border-t text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray/20 ${
                      headerIndex === 0 ? 'border-l' : ''
                    } ${
                      headerIndex === headerGroup.headers.length - 1
                        ? 'border-r'
                        : ''
                    } border-gray/20`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="text-center py-4 border-b text-gray-400 border-l border-r border-gray/20"
                >
                  <div className="flex justify-center items-center">
                    <FaSpinner className="animate-spin mr-2 text-blue-400" />
                    {lang.text('loading')}
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="text-center border-b py-4 text-gray-400 border-l border-r border-gray/20"
                >
                  {lang.text('noData')}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray/20 bg-transparent hover:bg-gray-800/20`}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-100 ${
                        cellIndex === 0 ? 'border-l' : ''
                      } ${
                        cellIndex === row.getVisibleCells().length - 1
                          ? 'border-r'
                          : ''
                      } border-gray/20`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* {searchParamPagination && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 bg-blue-600 text-gray-100 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {lang.text('previous')}
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-gray-100 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {lang.text('next')}
            </button>
          </div>
          <div className="text-sm text-gray-400">
            <span>
              {lang.text('page')}{' '}
              {table.getState().pagination.pageIndex + 1}{' '}
              {lang.text('of')}{' '}
              {table.getPageCount()}
            </span>
          </div>
          <div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="p-2 border border-gray/20 bg-transparent text-gray-100 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {[8, 10, 20, 30, 50].map((size) => (
                <option
                  key={size}
                  value={size}
                  className="bg-gray-800 text-gray-100"
                >
                  {lang.text('show')} {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )} */}
    </div>
  );
};