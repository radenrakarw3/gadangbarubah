import type { Reservation } from "./schema";
import {
  RESERVATION_STATUS_LABELS,
  type ReservationStatus,
} from "./reservation-status";

const OUTLET_LABELS: Record<string, string> = {
  "pollux-cikarang": "Pollux Mall Cikarang",
  bintaro: "Bintaro (Jurang Mangu Barat)",
};

function formatDateId(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function outletLabel(outlet: string | null | undefined): string {
  if (!outlet) return "Gadang Barubah";
  return OUTLET_LABELS[outlet] ?? outlet;
}

function mejaLabel(tipe: string): string {
  return tipe === "vip" ? "VIP Room" : "Reguler";
}

/** Status yang memicu notifikasi WA ke pelanggan */
export const NOTIFIABLE_STATUSES: ReservationStatus[] = [
  "pending",
  "confirmed",
  "arrived",
  "dining",
  "completed",
  "cancelled",
];

export function buildReservationNotificationMessage(
  reservation: Reservation,
  status: ReservationStatus,
): string | null {
  const nama = reservation.namaLengkap;
  const tanggal = formatDateId(String(reservation.tanggalReservasi));
  const waktu = reservation.waktuReservasi;
  const tamu = reservation.jumlahTamu;
  const outlet = outletLabel(reservation.outlet);
  const meja = mejaLabel(reservation.tipeMeja);

  switch (status) {
    case "pending":
      return (
        `Halo ${nama},\n\n` +
        `Permintaan reservasi Anda di *Gadang Barubah* telah kami terima:\n\n` +
        `📅 ${tanggal}\n` +
        `🕐 ${waktu} WIB\n` +
        `👥 ${tamu} tamu\n` +
        `📍 ${outlet}\n\n` +
        `Tim kami akan segera menghubungi Anda untuk konfirmasi. Terima kasih!`
      );
    case "confirmed":
      return (
        `Halo ${nama},\n\n` +
        `Reservasi Anda telah *DIKONFIRMASI* ✅\n\n` +
        `📅 ${tanggal}\n` +
        `🕐 ${waktu} WIB\n` +
        `👥 ${tamu} tamu | Meja ${meja}\n` +
        `📍 ${outlet}\n\n` +
        `Sampai jumpa di Gadang Barubah!`
      );
    case "arrived":
      return (
        `Halo ${nama},\n\n` +
        `Selamat datang di *Gadang Barubah*! 🙏\n` +
        `Meja Anda sedang disiapkan. Selamat menikmati!`
      );
    case "dining":
      return (
        `Halo ${nama},\n\n` +
        `Selamat menikmati hidangan Padang kami! 😊\n` +
        `Jika perlu bantuan, silakan hubungi staff kami.`
      );
    case "completed":
      return (
        `Halo ${nama},\n\n` +
        `Terima kasih telah berkunjung ke *Gadang Barubah*! 🙏\n` +
        `Sampai jumpa kembali.`
      );
    case "cancelled":
      return (
        `Halo ${nama},\n\n` +
        `Reservasi Anda pada ${tanggal} pukul ${waktu} WIB telah *dibatalkan*.\n\n` +
        `Hubungi kami jika ingin menjadwalkan ulang.`
      );
    default:
      return null;
  }
}

export function shouldNotifyReservationStatus(status: ReservationStatus): boolean {
  return NOTIFIABLE_STATUSES.includes(status);
}

export function notificationStatusLabel(status: ReservationStatus): string {
  return RESERVATION_STATUS_LABELS[status];
}
