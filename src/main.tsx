import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "../node_modules/leaflet/dist/leaflet.css";
import "./core/styles/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/features/_root/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
