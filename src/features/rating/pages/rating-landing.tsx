import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { RatingMain } from "../containers";

export const RatingLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("rating")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("rating"),
          url: "/rating & saran",
        },
      ]}
      title={lang.text("rating")}
    >
      <RatingMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
