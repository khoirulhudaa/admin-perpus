import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { CourseTable } from "@/features/course";
import { DashboardPageLayout } from "@/features/_global";

export const CourseLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("course")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("course"),
          url: "/courses",
        },
      ]}
      title={lang.text("course")}
    >
      <CourseTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
