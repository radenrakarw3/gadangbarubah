/**
 * Browser memblokir window.open yang dipanggil setelah await. Buka tab kosong
 * secara sinkron saat submit, lalu isi URL WhatsApp setelah request berhasil.
 */
export function openPendingWhatsAppTab(): Window | null {
  try {
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;
    return tab;
  } catch {
    return null;
  }
}

export function completeWhatsAppTab(pending: Window | null, url: string) {
  if (pending && !pending.closed) {
    pending.location.href = url;
    return;
  }
  window.location.href = url;
}

export function cancelWhatsAppTab(pending: Window | null) {
  if (pending && !pending.closed) pending.close();
}
