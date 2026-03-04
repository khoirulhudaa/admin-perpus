import { lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { ClassroomCreationForm } from "../containers";
import { Navigate, useParams } from "react-router-dom";
import { DashboardPageLayout } from "@/features/_global";

export const ClassroomEdit = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("editClassroom")} ${decodeParams?.text} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("classroom"),
          url: "/classrooms",
        },
        {
          label: lang.text("editSchool"),
          url: `/classrooms/edit/${params.id}`,
        },
        {
          label: String(decodeParams?.text),
          url: `/classrooms/edit/${params.id}`,
        },
      ]}
      title={lang.text("editClassroom")}
    >
      <ClassroomCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
