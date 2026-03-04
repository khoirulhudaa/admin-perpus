import React from "react";
import { StudentCoursePresenceTable } from "../containers";
import { useParamDecode } from "@/features/_global";

export const StudentCoursePresence = React.memo(() => {
  const { decodeParams } = useParamDecode();
  return (
    <div>
      <StudentCoursePresenceTable id={Number(decodeParams?.id)} />
    </div>
  );
});
