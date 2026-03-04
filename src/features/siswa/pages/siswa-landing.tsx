import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import StudentManager from "../containers/siswa-main";

export const SiswaLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('student')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('student'),
          url: "/data-siswa",
        },
      ]}
      title={lang.text('student')}
    >
      <StudentManager />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
