import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { Images } from "@/core/utils";
import { Navigate, Outlet } from "react-router-dom";
import { AuthLayout } from "../components/auth-layout";
import { useAuth } from "../hooks/auth";

export const AuthPage = () => {
  const auth = useAuth();

  // if (auth.isAuthenticated()) {
  //   return <Navigate to="/" replace />;
  // }

  // useEffect(() => {
  //   localStorage.removeItem('token');
  // }, [])

  return (
    <AuthLayout
      logo={Images.logo}
      image="/login.jpg"
      title={APP_CONFIG.appName}
      description={lang.text("loginDesc")}
    >
      <Outlet />
    </AuthLayout>
  );
};
