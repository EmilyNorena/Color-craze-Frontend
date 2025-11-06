import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import App from "./App.tsx";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>
);
