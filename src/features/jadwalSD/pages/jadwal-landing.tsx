import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import {JadwalSD} from "../containers/jadwal-main";

export const JadwalSDLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("jadwalsd")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("jadwalsd"),
          url: "/jadwal-sd",
        },
      ]}
      title={lang.text("jadwalsd")}
    >
      <JadwalSD />
    </DashboardPageLayout>
  );
};
