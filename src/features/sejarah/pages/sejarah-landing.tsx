import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import Sejarah from "../containers/sejarah-main";

export const SejarahLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("sejarah")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("sejarah"),
          url: "/sejarah",
        },
      ]}
      title={lang.text("sejarah")}
    >
      <Sejarah />
        {/* <div className="pb-16 sm:pb-0" /> */}
      </DashboardPageLayout>
    );
  };
