import type { Reservation } from "./schema";
import { RESERVATION_STATUS_LABELS, isReservationStatus, type ReservationStatus } from "./reservation-status";

const OUTLET_LABELS: Record<string, string> = {
  "pollux-cikarang": "Pollux Mall Cikarang",
  bintaro: "Bintaro (Jurang Mangu Barat)",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isReservationPublicId(id: string): boolean {
  return UUID_RE.test(id);
}

export type PublicReservationStatusPayload = {
  id: string;
  shortId: string;
  status: ReservationStatus;
  statusLabel: string;
  tanggalReservasi: string;
  waktuReservasi: string;
  outlet: string | null;
  outletLabel: string;
  jumlahTamu: number;
  tipeMeja: string;
  createdAt: string;
  confirmedAt: string | null;
  arrivedAt: string | null;
  diningAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
};

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function toPublicReservationStatus(reservation: Reservation): PublicReservationStatusPayload | null {
  if (!isReservationStatus(reservation.status)) return null;

  return {
    id: reservation.id,
    shortId: reservation.id.slice(0, 8),
    status: reservation.status,
    statusLabel: RESERVATION_STATUS_LABELS[reservation.status],
    tanggalReservasi: String(reservation.tanggalReservasi),
    waktuReservasi: reservation.waktuReservasi,
    outlet: reservation.outlet,
    outletLabel: reservation.outlet
      ? (OUTLET_LABELS[reservation.outlet] ?? reservation.outlet)
      : "Gadang Barubah",
    jumlahTamu: reservation.jumlahTamu,
    tipeMeja: reservation.tipeMeja,
    createdAt: toIso(reservation.createdAt) ?? new Date().toISOString(),
    confirmedAt: toIso(reservation.confirmedAt),
    arrivedAt: toIso(reservation.arrivedAt),
    diningAt: toIso(reservation.diningAt),
    completedAt: toIso(reservation.completedAt),
    cancelledAt: toIso(reservation.cancelledAt),
  };
}
