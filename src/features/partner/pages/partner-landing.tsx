import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import PartnerMain from "../containers/partner-main";

export const PartnerLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("partner")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("partner"),
          url: "/calendar",
        },
      ]}
      title={lang.text("partner")}
    >
      <PartnerMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
