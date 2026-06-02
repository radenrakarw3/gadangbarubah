import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Use createRoot for client-side rendering (no SSR body)
createRoot(document.getElementById("root")!).render(<App />);
