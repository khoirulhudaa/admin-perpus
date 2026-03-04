import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { useEffect } from "react";

export const Logout = () => {
  const auth = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    auth.logout();
    // localStorage.removeItem('token');
    localStorage.removeItem('hasShownSchoolDialog');
    navigate("/auth/login", { replace: true });
  }, [auth, navigate]);

  return null;
};
