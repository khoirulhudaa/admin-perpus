import React from "react";
import { useParamDecode } from "@/features/_global";
import { SchoolStudentTable } from "../containers";

export const SchoolStudent = React.memo(() => {
  const { decodeParams } = useParamDecode();

  return (
    <div>
      <SchoolStudentTable id={Number(decodeParams?.id)} />
    </div>
  );
});
