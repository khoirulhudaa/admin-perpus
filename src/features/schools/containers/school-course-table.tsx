import { BaseDataTable } from "@/features/_global";
import { lang } from "@/core/libs";
import {
  courseColumns,
  courseDataFallback,
  useCourse,
} from "@/features/course";
import { useMemo } from "react";

export interface SchoolCourseTableProps {
  id: number;
}

export const SchoolCourseTable = (props: SchoolCourseTableProps) => {
  const resource = useCourse();

  
  const datas = useMemo(() => {
    return resource.data?.filter(
      (d) => Number(d.sekolahId) === Number(props.id),
    );
  }, [props.id, resource.data]);
  
  console.log('course', resource)
  return (
    <BaseDataTable
      columns={courseColumns({})}
      data={datas}
      dataFallback={courseDataFallback}
      globalSearch
      // actions={[
      //   {
      //     title: lang.text("addWithContext", { context: lang.text("course") }),
      //     url: "/courses/create",
      //   },
      // ]}
      searchParamPagination
      searchPlaceholder={lang.text("search")}
      isLoading={resource.query.isLoading}
    />
  );
};
