import React from "react";
import { StudentDailyPresenceTable } from "../containers";
import { useParamDecode } from "@/features/_global";

export const StudentDailyPresence = React.memo(() => {
  const { decodeParams } = useParamDecode();
  return (
    <div>
      <StudentDailyPresenceTable id={Number(decodeParams?.biodataId)} />
    </div>
  );
});
