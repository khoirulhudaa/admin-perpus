import { PropsWithChildren } from "react";
import { vokadashQueryClient } from "./client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const VokadashQueryProvider = React.memo(
  ({ children }: PropsWithChildren) => {
    return (
      <QueryClientProvider client={vokadashQueryClient}>
        {children}
      </QueryClientProvider>
    );
  },
);
