import { BaseDataTable } from '@/features/_global';
import { columns } from '../utils';

interface StudentAttendanceTableProps {
  data: [];
}

export function MatpelAttendanceTable({ data }: StudentAttendanceTableProps) {
  return (
    <BaseDataTable
      columns={columns}
      data={data} 
      dataFallback={[]}
      globalSearch={false}
      searchParamPagination
      showFilterButton={false}
    />
  )
}