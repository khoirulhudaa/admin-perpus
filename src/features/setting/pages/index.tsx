import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import LibrarySettingsMain from "../containers/setting-main";

export const SettingMain = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("setting")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("setting"),
          url: "/setting",
        },
      ]}
      title={lang.text("setting")}
    >
    <LibrarySettingsMain />
    </DashboardPageLayout>
  );
};
