import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { GraduationLandingTables } from "../containers";

export const GraduationLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("graduation")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text("graduation"), url: "/graduation" }]}
      title={lang.text("graduation")}
    >
     <GraduationLandingTables /> 
    </DashboardPageLayout>
  );
};