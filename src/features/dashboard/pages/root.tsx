import { DashboardLayout, useVokadashContext } from "@/features/_global";
import { useAuth } from "@/features/auth/hooks";
import { useProfile } from "@/features/profile/hooks";
import { Navigate, Outlet } from "react-router-dom";

export const RootPage = () => {
  const appContext = useVokadashContext();
  const auth = useAuth();
  const profile = useProfile();

  if (!auth.isAuthenticated() && !profile.query.data?.data?.user?.id) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <DashboardLayout menus={appContext.menus} usermenus={appContext.usermenus}>
      <Outlet />
    </DashboardLayout>
  );
};
