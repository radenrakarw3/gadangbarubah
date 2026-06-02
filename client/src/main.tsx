import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerBootRecovery, renderBootError } from "./lib/bootRecovery";

registerBootRecovery();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Elemen #root tidak ditemukan");
}

try {
  createRoot(rootEl).render(<App />);
} catch (err) {
  console.error("[boot]", err);
  renderBootError(rootEl, "Gagal memuat situs. Periksa koneksi lalu muat ulang.");
}
