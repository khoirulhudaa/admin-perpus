import { APP_CONFIG } from "@/core/configs";
import {
    lang
} from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { SchoolMap } from "../containers";

export const LocationLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("schoolDistribution")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text("schoolDistribution"), url: "/locations" }]}
      title={lang.text("schoolDistribution")}
    >
      <SchoolMap />
    </DashboardPageLayout>
  );
};