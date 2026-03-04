// hooks/useDecodedId.ts
import { simpleDecode } from "@/core/libs";
import { useParams } from "react-router-dom";

export const useDecodedId = () => {
  const params = useParams();
  console.log("📦 RAW PARAM:", params.id);
  try {
    const decoded = simpleDecode(params.id || "");
    console.log("🧩 DECODED ID:", decoded);
    return Number(decoded);
  } catch (err) {
    console.error("❌ Failed to decode student ID param", err);
    return null;
  }
};
