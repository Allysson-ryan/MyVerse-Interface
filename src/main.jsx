import "@mantine/core/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Style/index.css";
import AppRoutes from "./routes";
import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <AppRoutes />
    </MantineProvider>
  </StrictMode>
);
