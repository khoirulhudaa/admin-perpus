import { lang } from "@/core/libs";
import { BaseDataTable } from "@/features/_global";
import { useSchool } from "../hooks";
import { schoolColumns, schoolDataFallback } from "../utils";

export const SchoolTable = () => {
  const school = useSchool();
  console.log('sekolah alL:', school?.data)
  return (
    <BaseDataTable
      columns={schoolColumns}
      data={school.data}
      dataFallback={schoolDataFallback}
      globalSearch
      searchPlaceholder={lang.text("searchSchool")}
      isLoading={school.query.isLoading} 
      searchParamPagination
    />
  );
};
