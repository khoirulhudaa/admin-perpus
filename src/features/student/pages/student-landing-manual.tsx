import { APP_CONFIG } from "@/core/configs";
import {
    lang
} from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { StudentLandingTablesManual } from "@/features/student";

export const StudentLandingManual = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("manualAttendance")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text("manualAttendance"), url: "/student-absence-manual" }]}
      title={lang.text("manualAttendance")}
    >
      <StudentLandingTablesManual />
    </DashboardPageLayout>
  );
};