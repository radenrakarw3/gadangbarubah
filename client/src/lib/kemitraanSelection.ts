/** State ringan untuk pre-select layanan antar section kemitraan (tanpa context) */

let pendingCateringType: string | null = null;

export function setPendingKemitraanService(cateringType: string) {
  pendingCateringType = cateringType;
  window.dispatchEvent(
    new CustomEvent("kemitraan-select-service", { detail: { cateringType } }),
  );
}

export function takePendingKemitraanService(): string | null {
  const value = pendingCateringType;
  pendingCateringType = null;
  return value;
}

export function scrollToKemitraanInquiry(focusServiceSelect = false) {
  document.getElementById("kemitraan-inquiry-section")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  if (focusServiceSelect) {
    window.setTimeout(() => {
      document.getElementById("kemitraan-service-select")?.focus();
    }, 400);
  }
}
