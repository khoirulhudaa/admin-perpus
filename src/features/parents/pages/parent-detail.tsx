import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { Navigate } from "react-router-dom";
import { ParentInformation, ParentStudentTable } from "../containers";
import { DashboardPageLayout, useParamDecode } from "@/features/_global";

export const ParentDetail = () => {
  const { decodeParams, params } = useParamDecode();

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("parentDetail")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("parent"),
          url: "/parents",
        },
        {
          label: decodeParams?.text,
          url: `/parents/${params.id}`,
        },
      ]}
      title={lang.text("parentDetail")}
      backButton
    >
      <div className="pb-4" />
      <ParentInformation id={Number(decodeParams?.id)} />
      <div className="py-4">
        <ParentStudentTable id={Number(decodeParams?.id)} />
      </div>
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
