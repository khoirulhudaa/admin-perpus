import React from "react";
import { useSearchParams } from "react-router-dom";
import { jsonHelper, Input, Label, FormItem, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/core/libs";
import { searchParamsToObject } from "@itokun99/http";
import { Table } from "@tanstack/react-table";

interface Props {
  table: Table<any>;
}

export const BaseFilterDialogContent = ({ table }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterSearchParams = searchParams.get("filter");
  const columnFilters = filterSearchParams ? jsonHelper.parse(filterSearchParams) : [];

  const updateFilter = (key: string, value: string | number, label: string) => {
    let newFilter = [...columnFilters];

    if (newFilter.find((d) => d.id === key)) {
      newFilter = newFilter.filter((d) => d.id !== key);
    }

    newFilter = [...newFilter, { id: key, value, label }];

    setSearchParams({
      ...searchParamsToObject(searchParams.toString()),
      filter: jsonHelper.string(newFilter),
      pageIndex: "0",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
      {table.getHeaderGroups().map((headerGroup) => (
        <React.Fragment key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const column = header.column;
            const meta = column.columnDef.meta;

            if (!meta?.filterVariant) return null;

            const filterValue = column.getFilterValue();

            return (
              <FormItem key={header.id}>
                <Label>{meta.filterLabel}</Label>
                {meta.filterVariant === "text" && (
                  <Input
                    type="text"
                    placeholder={meta.filterPlaceholder}
                    value={String(filterValue || "")}
                    onChange={(e) =>
                      updateFilter(column.id, e.target.value, meta.filterLabel || column.id)
                    }
                  />
                )}
                {meta.filterVariant === "select" && (
                  <Select
                    value={String(filterValue || "")}
                    onValueChange={(v) =>
                      updateFilter(
                        column.id,
                        !Number.isNaN(Number(v)) ? Number(v) : v,
                        meta.filterLabel || column.id
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={meta.filterPlaceholder} />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {meta.filterOptions?.map((opt, i) => (
                        <SelectItem key={i} value={String(opt.value)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormItem>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};