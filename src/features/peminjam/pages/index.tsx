import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import BibliographyMain from "../containers/peminjam";

export const PeminjamLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("peminjam")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("peminjam"),
          url: "/peminjam",
        },
      ]}
      title={lang.text("peminjam")}
    >
    <BibliographyMain />
    </DashboardPageLayout>
  );
};
