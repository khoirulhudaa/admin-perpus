import { useParamDecode } from "@/features/_global";
import React from "react";
import { StudentLibraryTable } from "../containers";

export const StudentLibrary = React.memo(() => {
  const { decodeParams } = useParamDecode();

  return (
    <div>
      <StudentLibraryTable id={Number(decodeParams?.id)} />
    </div>
  );
});
