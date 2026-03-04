import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { CourseCreationForm } from "@/features/course";
import { DashboardPageLayout } from "@/features/_global";

export const CourseCreate = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("addCourse")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("course"),
          url: "/courses",
        },
        {
          label: lang.text("addCourse"),
          url: `/courses/create`,
        },
      ]}
      title={lang.text("addCourse")}
    >
      <CourseCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
