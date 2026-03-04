import React from "react";
import { StudentParentTable } from "../containers";
import { useParamDecode } from "@/features/_global";

export const StudentParent = React.memo(() => {
  const { decodeParams } = useParamDecode();

  return (
    <div>
      <StudentParentTable id={Number(decodeParams?.id)} />
    </div>
  );
});
