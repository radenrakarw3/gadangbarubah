import type { Reservation } from "@shared/schema";
import type { ReservationStatus } from "@shared/reservation-status";
import type { ReservationOutletId } from "@shared/reservation-utils";
import { isReservationOutletId } from "@shared/reservation-utils";
import {
  buildReservationNotificationMessage,
  buildStaffNewReservationMessage,
  shouldNotifyReservationStatus,
} from "@shared/reservation-notifications";
import { sendStarsenderMessage, type StarsenderSendResult } from "./starsender";
import { storage } from "./storage";

const STAFF_WHATSAPP_ENV: Record<ReservationOutletId, string> = {
  "pollux-cikarang": "STAFF_WHATSAPP_CIKARANG",
  bintaro: "STAFF_WHATSAPP_BINTARO",
};

function staffPhonesForNewReservation(outlet: string | null | undefined): string[] {
  const phones = new Set<string>();

  if (outlet && isReservationOutletId(outlet)) {
    const envKey = STAFF_WHATSAPP_ENV[outlet];
    const outletPhone = process.env[envKey]?.trim();
    if (outletPhone) phones.add(outletPhone);
  }

  const mainPhone = process.env.STAFF_WHATSAPP_MAIN?.trim();
  if (mainPhone) phones.add(mainPhone);

  return Array.from(phones);
}

function isStarsenderSkipped(result: StarsenderSendResult): boolean {
  return result.ok && "skipped" in result && Boolean(result.skipped);
}

function notifyOkFromResult(result: StarsenderSendResult): boolean | null {
  if (isStarsenderSkipped(result)) return null;
  return result.ok;
}

async function persistCustomerNotify(
  reservationId: string,
  result: StarsenderSendResult,
): Promise<void> {
  await storage.updateReservationNotification(reservationId, {
    customerNotifyOk: notifyOkFromResult(result),
    customerNotifyError: result.ok ? null : result.error,
    customerNotifyAt: new Date(),
  });
}

async function persistStaffNotify(
  reservationId: string,
  results: StarsenderSendResult[],
): Promise<void> {
  if (results.length === 0) return;

  const attempted = results.filter((r) => !isStarsenderSkipped(r));
  if (attempted.length === 0) {
    await storage.updateReservationNotification(reservationId, {
      staffNotifyOk: null,
      staffNotifyError: null,
      staffNotifyAt: new Date(),
    });
    return;
  }

  const failed = attempted.filter((r) => !r.ok);
  await storage.updateReservationNotification(reservationId, {
    staffNotifyOk: failed.length === 0,
    staffNotifyError: failed.length ? failed.map((r) => r.error).join("; ") : null,
    staffNotifyAt: new Date(),
  });
}

/** Kirim notifikasi WA ke pelanggan — non-blocking, error dicatat di DB */
export async function notifyReservationCustomer(
  reservation: Reservation,
  status: ReservationStatus,
): Promise<void> {
  if (!shouldNotifyReservationStatus(status)) return;

  const message = buildReservationNotificationMessage(reservation, status);
  if (!message) return;

  const result = await sendStarsenderMessage(reservation.noWhatsApp, message);
  await persistCustomerNotify(reservation.id, result);

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

/** WA ke staff operasional outlet (+ opsional admin utama) saat reservasi baru */
export async function notifyStaffNewReservation(reservation: Reservation): Promise<void> {
  const phones = staffPhonesForNewReservation(reservation.outlet);
  if (phones.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[ReservationNotify] skip staff — set STAFF_WHATSAPP_CIKARANG / STAFF_WHATSAPP_BINTARO / STAFF_WHATSAPP_MAIN",
      );
    }
    return;
  }

  const message = buildStaffNewReservationMessage(reservation);

  const results = await Promise.all(
    phones.map((phone) => sendStarsenderMessage(phone, message)),
  );

  await persistStaffNotify(reservation.id, results);

  results.forEach((result, index) => {
    if (!result.ok) {
      console.error(
        `[ReservationNotify] gagal kirim WA staff res=${reservation.id} → ${phones[index]}:`,
        result.error,
      );
    }
  });
}

export function notifyStaffNewReservationAsync(reservation: Reservation): void {
  void notifyStaffNewReservation(reservation).catch((err) => {
    console.error("[ReservationNotify] staff notify unexpected error:", err);
  });
}
