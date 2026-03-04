import { distinctObjectsByProperty, lang } from "@/core/libs";
import { BaseDataTable } from "@/features/_global";
import { useSchool } from "@/features/schools";
import { useBiodata } from "@/features/user/hooks";
import { useMemo } from "react";
import { useParent } from "../hooks";
import { parentColumnWithFilter } from "../utils";

export function ParentTable() {
  const parent = useParent();
  const student = useBiodata();
  const school = useSchool();

  const columns = useMemo(() => {
    return parentColumnWithFilter({
      schoolOptions: distinctObjectsByProperty(
        school.data?.map((d) => ({
          label: d.namaSekolah,
          value: d.namaSekolah,
        })) || [],
        "value",
      ),
    });
  }, [school.data]);

  const datas = useMemo(() => {
    return parent.data?.map((d) => {
      return {
        ...d,
        student: student.data?.find((e) =>
          Boolean(e.orangTua?.find((f) => f.user?.nik === d.nik)),
        ),
        school: school?.data?.find((e) => Number(e.id) === Number(d.sekolahId)),
      };
    });
  }, [parent.data, student.data, school.data]);

  console.log('siswa nya orangtua', datas)

  return (
    <BaseDataTable
      columns={columns}
      data={datas}
      dataFallback={[]}
      globalSearch
      initialState={{
        sorting: [{ id: "name", desc: false }],
      }}
      searchParamPagination
      showFilterButton
      searchPlaceholder={lang.text("search")}
      isLoading={
        parent.query.isLoading || student.isLoading || school.isLoading
      }
    />
  );
}
