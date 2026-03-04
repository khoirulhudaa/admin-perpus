import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { TeacherTable } from "@/features/teacher";
import { DashboardPageLayout } from "@/features/_global";

export const TeacherLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("teacher")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("teacher"),
          url: "/teachers",
        },
      ]}
      title={lang.text("teacher")}
    >
      <TeacherTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
