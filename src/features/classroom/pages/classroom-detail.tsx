import { lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { Navigate, useParams } from "react-router-dom";
import { ClassroomInformation, ClassroomStudentTable } from "../containers";
import { DashboardPageLayout } from "@/features/_global";

export const ClassroomDetail = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("classroomDetail")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("classroom"),
          url: "/classrooms",
        },
        {
          label: decodeParams?.text,
          url: `/classrooms/${params.id}`,
        },
      ]}
      title={lang.text("classroomDetail")}
    >
      <div className="pb-4" />
      <ClassroomInformation id={Number(decodeParams?.id)} />
      <div className="py-4" />
      <ClassroomStudentTable id={Number(decodeParams?.id)} />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
