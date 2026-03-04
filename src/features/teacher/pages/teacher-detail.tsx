import { buttonVariants, cn, lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { Navigate, NavLink, Outlet, useParams } from "react-router-dom";
import { TEACHER_SUBMENU, TeacherInformation } from "@/features/teacher";
import { DashboardPageLayout } from "@/features/_global";

export const TeacherDetail = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("teacherDetail")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("teacher"),
          url: "/teachers",
        },
        {
          label: decodeParams?.text,
          url: `/teachers/${params.id}`,
        },
      ]}
      title={lang.text("teacherDetail")}
    >
      <div className="pb-4" />
      <TeacherInformation id={Number(decodeParams?.id)} />
      <div className="py-4">
        {TEACHER_SUBMENU.map((submenu) => {
          return (
            <NavLink
              to={submenu.path}
              end
              className={({ isActive }) => {
                return cn(
                  buttonVariants({ variant: isActive ? "default" : "outline" }),
                  "mr-2",
                );
              }}
            >
              {submenu.title}
            </NavLink>
          );
        })}
      </div>
      <Outlet />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
