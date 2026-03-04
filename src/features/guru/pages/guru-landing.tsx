import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import TeacherManager from "../containers/guru-main";

export const GuruLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('teacher')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('teacher'),
          url: "/data-siswa",
        },
      ]}
      title={lang.text('teacher')}
    >
      <TeacherManager />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
