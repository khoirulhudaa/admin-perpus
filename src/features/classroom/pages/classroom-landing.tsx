import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { ClassroomTable } from "@/features/classroom";
import { DashboardPageLayout } from "@/features/_global";

export const ClassroomLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("classroom")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("classroom"),
          url: "/classroom",
        },
      ]}
      title={lang.text("classroom")}
    >
      <ClassroomTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
