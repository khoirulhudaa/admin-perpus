import React from "react";
import { useParamDecode } from "@/features/_global";
import { SchoolTeacherTable } from "../containers";

export const SchoolTeacher = React.memo(() => {
  const { decodeParams } = useParamDecode();

  return (
    <div>
      <SchoolTeacherTable id={Number(decodeParams?.id)} />
    </div>
  );
});
