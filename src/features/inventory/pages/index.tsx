import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import StockOpnameMain from "../containers/invetory-main";

export const InventoryLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("invetory")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("invetory"),
          url: "/invetory",
        },
      ]}
      title={lang.text("invetory")}
    >
    <StockOpnameMain />
    </DashboardPageLayout>
  );
};
