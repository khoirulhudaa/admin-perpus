import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { AttendanceCreationForm } from "../containers";

export const AttendanceCreate = () => {

  const target = localStorage.getItem("attendanceTarget") || "students"; // default: students

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("addAttendance")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("attendance"),
          url: `/attendance/${target}`,
        },
        {
          label: lang.text("addAttendance"),
          url: `/attedance/create`,
        },
      ]}
      title={lang.text("addAttendance")}
    >
      <AttendanceCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
