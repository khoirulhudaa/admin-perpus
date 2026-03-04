// import { useSearchParams } from "react-router-dom";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { jsonHelper, searchParamsToObject } from "@/core/libs";

// interface UseDataTableControllerProps {
//   defaultPageSize?: number;
// }

// export function useDataTableController({ defaultPageSize = 20 }: UseDataTableControllerProps) {
//   const [searchParams, setSearchParams] = useSearchParams();

//   // ✅ Global Search
//   const global = searchParams.get("keyword") ?? "";

//   // ✅ Filter
//   const filterParam = searchParams.get("filter");
//   const parsedFilter = useMemo(() => {
//     return filterParam ? jsonHelper.parse(filterParam) : [];
//   }, [filterParam]);

//   // ✅ Sorting
//   const sortParam = searchParams.get("sort");
//   const sorting = useMemo(() => {
//     return sortParam
//       ? [{
//           id: sortParam.split(".")[0],
//           desc: sortParam.split(".")[1] === "desc",
//         }]
//       : [];
//   }, [sortParam]);

//   // ✅ Pagination from URL
//   const paginationSearchParams = useMemo(() => ({
//     pageIndex: !Number.isNaN(Number(searchParams.get("pageIndex")))
//       ? Number(searchParams.get("pageIndex"))
//       : 0,
//     pageSize: !Number.isNaN(Number(searchParams.get("pageSize")))
//       ? Number(searchParams.get("pageSize")) || defaultPageSize
//       : defaultPageSize,
//   }), [searchParams, defaultPageSize]);

//   const [pagination, setPagination] = useState({
//     pageIndex: paginationSearchParams.pageIndex,
//     pageSize: paginationSearchParams.pageSize,
//   });

//   // ✅ Sync state with URL
//   useEffect(() => {
//     setPagination({
//       pageIndex: paginationSearchParams.pageIndex,
//       pageSize: paginationSearchParams.pageSize,
//     });
//   }, [paginationSearchParams.pageIndex, paginationSearchParams.pageSize]);

//   // ✅ Update helpers
//   const updateSearchParams = useCallback(
//     (next: Record<string, string | undefined>) => {
//       setSearchParams({
//         ...searchParamsToObject(searchParams.toString()),
//         ...next,
//       });
//     },
//     [searchParams, setSearchParams]
//   );

//   const onSortingChange = useCallback(
//     (updater: any) => {
//       const nextSort = typeof updater === "function" ? updater(sorting) : updater;
//       const next = nextSort?.[0];
//       updateSearchParams({
//         sort: next ? `${next.id}.${next.desc ? "desc" : "asc"}` : undefined,
//       });
//     },
//     [sorting, updateSearchParams]
//   );

//   const onPaginationChange = useCallback(
//     (updater: any) => {
//       const next = typeof updater === "function" ? updater(pagination) : updater;
//       setPagination(next);
//       updateSearchParams({
//         pageIndex: String(next.pageIndex),
//         pageSize: String(next.pageSize),
//       });
//     },
//     [pagination, updateSearchParams]
//   );

//   return {
//     global,
//     sorting,
//     filter: parsedFilter,
//     pagination,
//     onSortingChange,
//     onPaginationChange,
//     pageSize: pagination.pageSize,
//     pageIndex: pagination.pageIndex,
//     updateSearchParams,
//     searchParams,
//     setSearchParams
//   };
// }



import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { jsonHelper, searchParamsToObject } from "@/core/libs";

interface UseDataTableControllerProps {
  defaultPageSize?: number;
}

export function useDataTableController({ defaultPageSize = 20 }: UseDataTableControllerProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Global Search
  const global = searchParams.get("keyword") ?? "";

  // ✅ Filter
  const filterParam = searchParams.get("filter");
  const parsedFilter = useMemo(() => {
    return filterParam ? jsonHelper.parse(filterParam) : [];
  }, [filterParam]);

  // ✅ Sorting
  const sortParam = searchParams.get("sort");
  const sorting = useMemo(() => {
    return sortParam
      ? [{
          id: sortParam.split(".")[0],
          desc: sortParam.split(".")[1] === "desc",
        }]
      : [];
  }, [sortParam]);

  // ✅ Pagination from URL
  const paginationSearchParams = useMemo(() => ({
    pageIndex: !Number.isNaN(Number(searchParams.get("pageIndex")))
      ? Number(searchParams.get("pageIndex"))
      : 0,
    pageSize: !Number.isNaN(Number(searchParams.get("pageSize")))
      ? Number(searchParams.get("pageSize")) || defaultPageSize
      : defaultPageSize,
  }), [searchParams, defaultPageSize]);

  const [pagination, setPagination] = useState({
    pageIndex: paginationSearchParams.pageIndex,
    pageSize: paginationSearchParams.pageSize,
  });

  // ✅ Sync state with URL
  useEffect(() => {
    setPagination({
      pageIndex: paginationSearchParams.pageIndex,
      pageSize: paginationSearchParams.pageSize,
    });
  }, [paginationSearchParams.pageIndex, paginationSearchParams.pageSize]);

  // ✅ Update helpers
  const updateSearchParams = useCallback(
    (next: Record<string, string | undefined>) => {
      setSearchParams({
        ...searchParamsToObject(searchParams.toString()),
        ...next,
      });
    },
    [searchParams, setSearchParams]
  );

  const onSortingChange = useCallback(
    (updater: any) => {
      const nextSort = typeof updater === "function" ? updater(sorting) : updater;
      const next = nextSort?.[0];
      updateSearchParams({
        sort: next ? `${next.id}.${next.desc ? "desc" : "asc"}` : undefined,
      });
    },
    [sorting, updateSearchParams]
  );

  const onPaginationChange = useCallback(
    (updater: any) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      setPagination(next);
      updateSearchParams({
        pageIndex: String(next.pageIndex),
        pageSize: String(next.pageSize),
      });
    },
    [pagination, updateSearchParams]
  );

  const onFilterChange = useCallback(
    (updater: any) => {
      const nextFilter = typeof updater === "function" ? updater(parsedFilter) : updater;
      console.log('ok', nextFilter)
      console.log('ok2', parsedFilter)
      updateSearchParams({
        filter: nextFilter?.length > 0 ? jsonHelper.string(nextFilter) : undefined,
      });
    },
    [parsedFilter, updateSearchParams]
  );

  return {
    global,
    sorting,
    filter: parsedFilter,
    pagination,
    onSortingChange,
    onPaginationChange,
    onFilterChange,
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
    updateSearchParams,
    searchParams,
    setSearchParams,
  };
}