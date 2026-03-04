import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import EksemplarMain from "../containers/eksemplar-main";

export const EksemplarLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("eksemplar")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("eksemplar"),
          url: "/eksemplar",
        },
      ]}
      title={lang.text("eksemplar")}
    >
    <EksemplarMain />
    </DashboardPageLayout>
  );
};
