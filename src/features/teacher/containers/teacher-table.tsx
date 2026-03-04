import { useBiodataGuru } from "@/features/user/hooks";
import { BaseDataTable } from "@/features/_global";
import { distinctObjectsByProperty, lang } from "@/core/libs";
import { useSchool } from "@/features/schools";
import { useMemo } from "react";
import { teacherColumnWithFilter } from "../utils";

export function TeacherTable() {
  const biodata = useBiodataGuru();
  const school = useSchool();

  console.log('biodata guru', biodata?.data)

  const columns = useMemo(
    () =>
      teacherColumnWithFilter({
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
      }),
    [school.data],
  );

  return (
    <BaseDataTable
      columns={columns}
      data={biodata.data}
      dataFallback={columns}
      globalSearch
      searchParamPagination
      showFilterButton
      initialState={{
        sorting: [
          {
            id: "user_name",
            desc: false,
          },
        ],
      }}
      searchPlaceholder={lang.text("search")}
      isLoading={biodata.query.isLoading}
    />
  );
}
