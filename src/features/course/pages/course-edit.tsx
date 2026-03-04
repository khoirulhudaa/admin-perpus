import { lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { Navigate, useParams } from "react-router-dom";
import { CourseCreationForm } from "@/features/course";
import { DashboardPageLayout } from "@/features/_global";

export const CourseEdit = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("editCourse")} ${decodeParams?.text} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("course"),
          url: "/courses",
        },
        {
          label: lang.text("editCourse"),
          url: `/courses/edit/${params.id}`,
        },
        {
          label: String(decodeParams?.text),
          url: `/courses/edit/${params.id}`,
        },
      ]}
      title={lang.text("editCourse")}
    >
      <CourseCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
