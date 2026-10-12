import React from "react";
import { MotionConfig } from "framer-motion";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import { ErrorBoundary } from "./components/error-boundary";
import { ThemeProvider } from "./components/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary><BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <MotionConfig reducedMotion="user"><App /></MotionConfig>
      </ThemeProvider>
    </BrowserRouter></ErrorBoundary>
  </React.StrictMode>
);
