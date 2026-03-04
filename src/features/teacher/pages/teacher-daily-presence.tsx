import React from "react";
import { TeacherDailyPresenceTable } from "../containers";
import { useParamDecode } from "@/features/_global";

export const TeacherDailyPresence = React.memo(() => {
  const { decodeParams } = useParamDecode();
  return (
    <div>
      <TeacherDailyPresenceTable id={Number(decodeParams?.id)} />
    </div>
  );
});
