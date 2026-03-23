import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import GenrePage from "../containers/genre";

export const GenreLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("bibliografy")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("bibliografy"),
          url: "/bibliografy",
        },
      ]}
      title={lang.text("bibliografy")}
    >
    <GenrePage />
    </DashboardPageLayout>
  );
};
