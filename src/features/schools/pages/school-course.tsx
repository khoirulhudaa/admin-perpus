import React from "react";
import { useParamDecode } from "@/features/_global";
import { SchoolCourseTable } from "../containers";

export const SchoolCourse = React.memo(() => {
  const { decodeParams } = useParamDecode();

  return (
    <div>
      <SchoolCourseTable id={Number(decodeParams?.id)} />
    </div>
  );
});
