import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout, useParamDecode } from "@/features/_global";
import { Navigate } from "react-router-dom";
import { ParentCreationForm } from "../containers";

export const ParentEdit = () => {
  const { decodeParams, params } = useParamDecode();

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("editParent")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("parent"),
          url: "/parents",
        },
        {
          label: lang.text("editParent"),
          url: `/parents/edit/${params.id}`,
        },
        {
          label: String(decodeParams?.text),
          url: `/parents/edit/${params.id}`,
        },
      ]}
      title={lang.text("editParent")}
    >
      <div className="pb-4" />
      <ParentCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
