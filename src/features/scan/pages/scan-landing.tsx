import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import StudentScanner from "../containers/scan-main";

export const ScanLanding = () => {
  return (
    <>
    <StudentScanner />
    </>
    // <DashboardPageLayout
    //   siteTitle={`${lang.text('scan')} | ${APP_CONFIG.appName}`}
    //   breadcrumbs={[
    //     {
    //       label: lang.text('scan'),
    //       url: "/scan-qrcode",
    //     },
    //   ]}
    //   title={lang.text('scan')}
    // >
    //   {/* <div className="pb-16 sm:pb-0" /> */}
    // </DashboardPageLayout>
  );
};
