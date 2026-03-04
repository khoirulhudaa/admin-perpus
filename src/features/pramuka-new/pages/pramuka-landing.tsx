import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { Pramuka } from "../containers";

export const PramukaLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('pramuka')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("pramuka"),
          url: "/pramuka-sekolah",
        },
      ]}
      title={lang.text("pramuka")}
    >
      <Pramuka />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
