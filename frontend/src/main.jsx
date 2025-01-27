import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <RecoilRoot>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
