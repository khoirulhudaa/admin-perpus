import { Button } from "@/core/libs";
import { Menu } from "lucide-react";
import React from "react";

// Definisikan interface agar tidak ada error TS
interface TriggerProps {
  onClick?: () => void;
}

export const Trigger = React.memo(({ onClick }: TriggerProps) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="outline"
      size="icon"
      className="shrink-0 md:hidden h-8 w-8"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
});

Trigger.displayName = "Trigger";