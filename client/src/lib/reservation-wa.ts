import { OUTLETS, whatsappForOutlet } from "@/lib/siteContent";

export function reservationStatusUrl(reservationId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/cek-reservasi/${reservationId}`;
}

export function buildReservationWhatsAppUrl(opts: {
  reservationId: string;
  outletId: string;
  namaLengkap?: string;
}): string {
  const contact = whatsappForOutlet(opts.outletId);
  const outletLabel =
    OUTLETS.find((o) => o.id === opts.outletId)?.label ?? opts.outletId;
  const statusUrl = reservationStatusUrl(opts.reservationId);
  const shortId = opts.reservationId.slice(0, 8);
  const nama = opts.namaLengkap?.trim();
  const intro = nama
    ? `Halo Admin ${outletLabel}, saya ${nama}.`
    : `Halo Admin ${outletLabel}.`;
  const text =
    `${intro} Saya sudah mengisi form reservasi (ID: ${shortId}).\n` +
    `Mohon dicek statusnya di sini: ${statusUrl}`;
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
}
