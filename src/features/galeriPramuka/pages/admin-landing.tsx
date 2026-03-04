import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { GalleryPramukaMain } from "../containers";

export const GalleryPramukaLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("galeriPramuka")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("galeriPramuka"),
          url: "/scout/gallery",
        },
      ]}
      title={lang.text("galeriPramuka")}
    >
      <GalleryPramukaMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
