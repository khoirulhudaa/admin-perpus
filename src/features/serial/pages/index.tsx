import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import SerialControlMain from "../containers/serial-main";

export const SerialLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("serial")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("serial"),
          url: "/serial",
        },
      ]}
      title={lang.text("serial")}
    >
    <SerialControlMain />
    </DashboardPageLayout>
  );
};
