import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/core/libs";

interface BaseTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const BaseTablePagination = ({
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
}: BaseTablePaginationProps) => {
  const lastPage = Math.ceil(totalItems / pageSize) - 1;

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {`${pageIndex * pageSize + 1} - ${Math.min(
          (pageIndex + 1) * pageSize,
          totalItems
        )} dari ${totalItems} data`}
      </div>
      <div className="flex flex-row gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(0)} disabled={pageIndex === 0}>
          Pertama
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(pageIndex - 1)} disabled={pageIndex === 0}>
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= lastPage}
        >
          <ArrowRight />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(lastPage)}
          disabled={pageIndex >= lastPage}
        >
          Terakhir
        </Button>
      </div>
    </div>
  );
};