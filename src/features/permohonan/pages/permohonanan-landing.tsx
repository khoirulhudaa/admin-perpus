import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { PermohonanMain } from "../containers";

export const PermohonanLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("permohonan")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("permohonan"),
          url: "/permohonan",
        },
      ]}
      title={lang.text("permohonan")}
    >
      <PermohonanMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
