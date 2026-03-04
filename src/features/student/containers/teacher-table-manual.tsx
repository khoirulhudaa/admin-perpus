import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { teacherColumnWithFilter2 } from "@/features/teacher";
import { useBiodataGuru } from "@/features/user/hooks";
import { useMemo } from "react";
import { useAttendanceActions } from "../hooks";


export function TeacherTableManual() {
  const biodata = useBiodataGuru();
  const school = useSchool();
  const { handleAttend, handleAttendGoHome } = useAttendanceActions();

  console.log('biodata guru', biodata?.data)

  const columns = useMemo(
    () =>
      teacherColumnWithFilter2({
        schoolOptions: distinctObjectsByProperty(
          school.data?.map((d) => ({
            label: d.namaSekolah,
            value: d.namaSekolah,
          })) || [],
          "value",
        ),
        handleAttend,
        handleAttendGoHome
      }),
    [school.data, handleAttend, handleAttendGoHome],
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
