import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { FaqMain } from "../containers";

export const FaqLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("faq")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("faq"),
          url: "/faq",
        },
      ]}
      title={lang.text("faq")}
    >
      <FaqMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
