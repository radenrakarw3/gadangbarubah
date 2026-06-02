/** Pemulihan saat chunk JS gagal (deploy baru / cache lama). */
export function registerBootRecovery(): void {
  window.addEventListener("vite:preloadError", () => {
    window.location.reload();
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const msg =
      reason instanceof Error
        ? reason.message
        : typeof reason === "string"
          ? reason
          : "";
    if (
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Importing a module script failed") ||
      msg.includes("error loading dynamically imported module")
    ) {
      window.location.reload();
    }
  });
}

export function renderBootError(root: HTMLElement, message: string): void {
  root.innerHTML = `
    <div style="min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:1.5rem;text-align:center;background:#300505;color:#F0E6E6;font-family:system-ui,sans-serif">
      <p style="margin:0;font-size:1rem">${message}</p>
      <button type="button" onclick="location.reload()" style="padding:0.65rem 1.25rem;border-radius:0.5rem;border:none;background:#6a0000;color:#F0E6E6;font-size:0.875rem;cursor:pointer">
        Muat ulang
      </button>
    </div>
  `;
}
