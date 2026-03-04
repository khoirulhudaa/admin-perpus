import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { DashboardPageLayout } from "@/features/_global";
import { ArchiveMain } from "../containers";

export const AcrhiveLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("archive")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("archive"),
          url: "/archive",
        },
      ]}
      title={lang.text("archive")}
    >
      <ArchiveMain />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
