import React from "react";
import { TableDataSiswa } from "@/features/student";
import { TableDataGuru } from "@/features/teacher";

export const PresenceSection = React.memo(() => {
  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
      <div>
        <TableDataSiswa />
      </div>
      <div>
        <TableDataGuru />
      </div>
    </div>
  );
});
