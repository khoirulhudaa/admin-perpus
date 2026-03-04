import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import KunjunganReportMain from "../containers/report-main";

export const ReportLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("report")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("report"),
          url: "/laporan-kunjungan",
        },
      ]}
      title={lang.text("report")}
    >
    <KunjunganReportMain />
    </DashboardPageLayout>
  );
};
