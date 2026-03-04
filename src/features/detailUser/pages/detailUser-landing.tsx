import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import DetailUser from "../containers/detailUser-main";

export const DetailUserLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("detail")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("detail"),
          url: "/detail/:id",
        },
      ]}
      title={lang.text("detail")}
    >
      <DetailUser />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
