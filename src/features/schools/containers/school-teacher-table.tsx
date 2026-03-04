import { useBiodataGuru } from "@/features/user/hooks";
import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo } from "react";
import { teacherColumnWithFilter } from "@/features/teacher";

export interface SchoolTeacherTableProps {
  id: number;
}

export function SchoolTeacherTable(props: SchoolTeacherTableProps) {
  const biodata = useBiodataGuru();
  const school = useSchool();

  const columns = useMemo(
    () =>
      teacherColumnWithFilter({
        schoolOptions:
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
      }),
    [school.data],
  );

  const datas = useMemo(
    () => biodata.data.filter((d) => Number(d.user?.sekolah?.id) === props.id),
    [props.id, biodata.data],
  );

  console.log("datas ==>", datas);

  return (
    <BaseDataTable
      columns={columns}
      data={datas}
      dataFallback={columns}
      globalSearch
      searchParamPagination
      showFilterButton={false}
      searchPlaceholder={lang.text("search")}
      isLoading={biodata.query.isLoading}
    />
  );
}
