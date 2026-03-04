import { lang } from "@/core/libs";
import { BaseDataTable } from "@/features/_global";
import { studentColumnWithFilterForDetailParent } from "@/features/student";
import { useBiodata, useUserDetail } from "@/features/user/hooks";
import { useMemo } from "react";

export interface ParentStudentTableProps {
  id?: number;
}

export function ParentStudentTable(props: ParentStudentTableProps) {
  const parent = useUserDetail(Number(props.id));
  const biodata = useBiodata();

  const columns = useMemo(
    () =>
      studentColumnWithFilterForDetailParent({
        schoolOptions: [],
      }),
    [],
  );

  const datas = useMemo(() => {
    return biodata.data?.filter((d) =>
      Boolean(d.orangTua?.find((e) => e.user?.nik === parent.data?.nik)),
    );
  }, [biodata.data, parent.data?.nik]);

  return (
    <BaseDataTable
      columns={columns}
      data={datas || []}
      dataFallback={[]}
      globalSearch={false}
      searchPlaceholder={lang.text("search")}
      isLoading={biodata.query.isLoading || parent?.query?.isLoading}
    />
  );
}
