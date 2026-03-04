import { APP_CONFIG } from "@/core/configs";
import {
  lang
} from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { TeacherLandingTablesManual } from "../containers/teacher-tables-manual";

export const TeacherLandingManual = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("manualAttendanceTeacher")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text("manualAttendanceTeacher"), url: "/student-absence-manual" }]}
      title={lang.text("manualAttendanceTeacher")}
    >
      <TeacherLandingTablesManual />
    </DashboardPageLayout>
  );
};