import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { MemberPramukaMain } from "../containers";

export const ScoutLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("pramuka")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("pramuka"),
          url: "/scout",
        },
      ]}
      title={lang.text("pramuka")}
    >
      <MemberPramukaMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
