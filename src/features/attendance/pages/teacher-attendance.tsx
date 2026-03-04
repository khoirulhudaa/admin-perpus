import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useEffect } from "react";
import { TeacherAttendanceTable } from "../containers";

export const TeacherAttendance = () => {

   useEffect(() => {
      localStorage.setItem("attendanceTarget", "teachers");
  }, []);

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("teacherAttendance")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("teacherAttendance"),
          url: "/teachers",
        },
      ]}
      title={lang.text("teacherAttendance")}
    >
      <TeacherAttendanceTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
