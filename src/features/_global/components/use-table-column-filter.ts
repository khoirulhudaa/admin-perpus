export interface FilterOption {
    label: string;
    value: string | number;
  }
  
  interface UseTableColumnFilterParams {
    key: string;
    label: string;
    placeholder?: string;
    variant?: "select" | "text" | "number";
    options?: FilterOption[];
    visible?: boolean;
  }
  
  export const useTableColumnFilter = ({
    key,
    label,
    placeholder,
    variant = "select",
    options = [],
    visible = true,
  }: UseTableColumnFilterParams) => {
    return {
      accessorKey: key,
      meta: {
        filterLabel: label,
        filterPlaceholder: placeholder ?? `Pilih ${label}`,
        filterVariant: variant,
        filterOptions: variant === "select" ? options : undefined,
        filterColumnVisible: visible,
      },
    };
  };

  export const buildSelectFilter = (key: string, label: string, options: FilterOption[]) => {
    return useTableColumnFilter({ key, label, options, variant: "select" });
  };