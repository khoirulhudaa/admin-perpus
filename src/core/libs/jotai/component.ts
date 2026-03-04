import React from "react";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { vokadashQueryClient } from "../query";

export const HydrateAtoms = ({ children }: React.PropsWithChildren) => {
  useHydrateAtoms([[queryClientAtom, vokadashQueryClient]]);
  return children;
};
