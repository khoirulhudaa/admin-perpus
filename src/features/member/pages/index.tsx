import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import MemberMain from "../containers/member-main";

export const MemberLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("member")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("member"),
          url: "/member",
        },
      ]}
      title={lang.text("member")}
    >
    <MemberMain />
    </DashboardPageLayout>
  );
};
