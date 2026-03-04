import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { ClassroomCreationForm } from "../containers";
import { DashboardPageLayout } from "@/features/_global";

export const ClassroomCreate = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("addClassroom")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("classroom"),
          url: "/classrooms",
        },
        {
          label: lang.text("addClassroom"),
          url: `/classrooms/create`,
        },
      ]}
      title={lang.text("addClassroom")}
    >
      <ClassroomCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
