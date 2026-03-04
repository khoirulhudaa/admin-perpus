import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { AdminTable } from "@/features/user";
import { DashboardPageLayout } from "@/features/_global";

export const AdminLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("userAdmin")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("userAdmin"),
          url: "/admin/users",
        },
      ]}
      title={lang.text("userAdmin")}
    >
      <AdminTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
