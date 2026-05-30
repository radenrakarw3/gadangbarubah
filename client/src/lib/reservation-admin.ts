import type { Reservation } from "@shared/schema";
import {
  RESERVATION_STATUS_LABELS,
  type ReservationStatus,
} from "@shared/reservation-status";
import { OUTLETS } from "@/lib/siteContent";

export { RESERVATION_STATUS_LABELS, type ReservationStatus };

export type ReservationRow = Reservation;

export const STATUS_BADGE_CLASS: Record<ReservationStatus, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  confirmed: "bg-blue-100 text-blue-900 border-blue-200",
  arrived: "bg-emerald-100 text-emerald-900 border-emerald-200",
  dining: "bg-violet-100 text-violet-900 border-violet-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-red-100 text-red-900 border-red-200",
};

export function formatOutletLabel(outletId: string | null | undefined): string {
  if (!outletId) return "—";
  return OUTLETS.find((o) => o.id === outletId)?.label ?? outletId;
}

export function formatReservationDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isSoonReservation(tanggal: string, waktu: string): boolean {
  const now = new Date();
  const slot = new Date(`${tanggal}T${waktu}:00`);
  const diffMs = slot.getTime() - now.getTime();
  return diffMs >= 0 && diffMs <= 30 * 60 * 1000;
}

export function waLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  const base = `https://wa.me/${normalized}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function waConfirmTemplate(res: ReservationRow): string {
  return `Halo ${res.namaLengkap}, reservasi Anda di Gadang Barubah pada ${formatReservationDate(String(res.tanggalReservasi))} pukul ${res.waktuReservasi} WIB (${res.jumlahTamu} tamu) telah kami konfirmasi. Sampai jumpa!`;
}
