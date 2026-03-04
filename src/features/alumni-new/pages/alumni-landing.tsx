import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import AlumniManager from "../containers/alumni-main";

export const AlumniLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('alumni')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('alumni'),
          url: "/pegawai",
        },
      ]}
      title={lang.text('alumni')}
    >
      <AlumniManager />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
