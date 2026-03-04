import React from "react";
import { useParamDecode } from "@/features/_global";
import { SchoolClassroomTable } from "../containers";

export const SchoolClassroom = React.memo(() => {
  const { decodeParams } = useParamDecode();

  return (
    <div>
      <SchoolClassroomTable id={Number(decodeParams?.id)} />
    </div>
  );
});
