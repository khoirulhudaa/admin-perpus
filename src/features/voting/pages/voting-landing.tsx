import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import VotingMain from "../containers/voting-main";

export const VotingLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("vote")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("vote"),
          url: "/voting-osis",
        },
      ]}
      title={lang.text("vote")}
    >
      <VotingMain />
        {/* <div className="pb-16 sm:pb-0" /> */}
      </DashboardPageLayout>
    );
  };
