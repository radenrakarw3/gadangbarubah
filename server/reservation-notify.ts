import type { Reservation } from "@shared/schema";
import type { ReservationStatus } from "@shared/reservation-status";
import {
  buildReservationNotificationMessage,
  shouldNotifyReservationStatus,
} from "@shared/reservation-notifications";
import { sendStarsenderMessage } from "./starsender";

/** Kirim notifikasi WA ke pelanggan — non-blocking, error hanya di-log */
export async function notifyReservationCustomer(
  reservation: Reservation,
  status: ReservationStatus,
): Promise<void> {
  if (!shouldNotifyReservationStatus(status)) return;

  const message = buildReservationNotificationMessage(reservation, status);
  if (!message) return;

  const result = await sendStarsenderMessage(reservation.noWhatsApp, message);
  if (!result.ok) {
    console.error(
      `[ReservationNotify] gagal kirim WA status=${status} res=${reservation.id}:`,
      result.error,
    );
  }
}

/** Fire-and-forget — tidak menunda response API admin/publik */
export function notifyReservationCustomerAsync(
  reservation: Reservation,
  status: ReservationStatus,
): void {
  void notifyReservationCustomer(reservation, status).catch((err) => {
    console.error("[ReservationNotify] unexpected error:", err);
  });
}
