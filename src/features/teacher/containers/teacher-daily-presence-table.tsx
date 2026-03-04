import { teacherDailyPresenceColumn } from "../utils";
import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import { useMemo } from "react";
import { useTeacherDetail } from "../hooks";

export interface TeacherDailyPresenceTableProps {
  id?: number;
}

export function TeacherDailyPresenceTable(
  props: TeacherDailyPresenceTableProps,
) {
  const detail = useTeacherDetail({ id: props.id });
  const items = useMemo(
    () => detail.data?.absensis || [],
    [detail?.data?.absensis],
  );

  return (
    <BaseDataTable
      columns={teacherDailyPresenceColumn}
      data={items}
      dataFallback={[]}
      globalSearch
      initialState={{
        sorting: [
          {
            id: "createdAt",
            desc: true,
          },
        ],
      }}
      searchPlaceholder={lang.text("search")}
      isLoading={detail.isLoading}
    />
  );
}
