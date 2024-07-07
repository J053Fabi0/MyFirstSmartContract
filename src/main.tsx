import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const manifestUrl = "https://josefabio.com/f/manifest.json";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>
);
