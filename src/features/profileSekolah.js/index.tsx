import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { ProfileSekolahMain } from "./containers/admin-landing";

export const ProfileSekolahLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("profileSchool")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("profileSchool"),
          url: "/visiMission",
        },
      ]}
      title={lang.text("profileSchool")}
    >
      <ProfileSekolahMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
