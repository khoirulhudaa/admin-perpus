export interface GlobalMutationVars {
  type: "live" | "manual" | "approval" | "delete" | "create" | "update";
  value?: unknown;
  id?: number;
}

export interface GlobalQueryProps {
  indexQuery?: boolean;
}

export interface GlobalApprovalMutationVars {
  id: number;
}
