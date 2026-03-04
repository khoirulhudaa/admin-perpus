import { useEffect } from "react";
import { SchoolRegisterForm } from "../containers";

export const SchoolRegister = () => {
  useEffect(() => {
    document.body.setAttribute("style", "overflow:auto;");
    return () => {
      document.body.removeAttribute("style");
    };
  }, []);
  return (
    <div className="py-10">
      <SchoolRegisterForm />
    </div>
  );
};
