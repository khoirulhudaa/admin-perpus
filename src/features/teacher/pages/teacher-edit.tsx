import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { Navigate } from "react-router-dom";
import { DashboardPageLayout, useParamDecode } from "@/features/_global";
import { TeacherCreationForm } from "../containers";

export const TeacherEdit = () => {
  const { decodeParams, params } = useParamDecode();

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("editTeacher")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("teacher"),
          url: "/teachers",
        },
        {
          label: lang.text("editTeacher"),
          url: `/teachers/edit/${params.id}`,
        },
        {
          label: String(decodeParams?.text),
          url: `/teachers/edit/${params.id}`,
        },
      ]}
      title={lang.text("editTeacher")}
    >
      <div className="pb-4" />
      <TeacherCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
