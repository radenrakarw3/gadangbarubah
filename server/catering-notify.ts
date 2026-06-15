import type { CateringInquiry } from "@shared/schema";
import { buildStaffNewCateringMessage } from "@shared/catering";
import { sendStarsenderMessage } from "./starsender";

function cateringStaffPhones(): string[] {
  const phones = new Set<string>();
  const dedicated = process.env.STAFF_WHATSAPP_CATERING?.trim();
  if (dedicated) {
    phones.add(dedicated);
    return Array.from(phones);
  }

  for (const key of [
    "STAFF_WHATSAPP_MAIN",
    "STAFF_WHATSAPP_CIKARANG",
    "STAFF_WHATSAPP_BINTARO",
  ]) {
    const phone = process.env[key]?.trim();
    if (phone) phones.add(phone);
  }

  return Array.from(phones);
}

export async function notifyStaffNewCatering(inquiry: CateringInquiry): Promise<void> {
  const phones = cateringStaffPhones();
  if (phones.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[CateringNotify] skip staff — set STAFF_WHATSAPP_CATERING atau STAFF_WHATSAPP_MAIN",
      );
    }
    return;
  }

  const message = buildStaffNewCateringMessage({
    nama: inquiry.nama,
    noWhatsApp: inquiry.noWhatsApp,
    tanggalEvent: inquiry.tanggalEvent,
    eventDetail: inquiry.eventDetail,
    lokasiEvent: inquiry.lokasiEvent,
    tipeLayanan: inquiry.tipeLayanan as Parameters<typeof buildStaffNewCateringMessage>[0]["tipeLayanan"],
    pax: inquiry.pax,
  });

  await Promise.all(
    phones.map(async (phone) => {
      const result = await sendStarsenderMessage(phone, message);
      if (!result.ok) {
        console.error(
          `[CateringNotify] gagal kirim WA staff inquiry=${inquiry.id} → ${phone}:`,
          result.error,
        );
      }
    }),
  );
}

export function notifyStaffNewCateringAsync(inquiry: CateringInquiry): void {
  void notifyStaffNewCatering(inquiry).catch((err) => {
    console.error("[CateringNotify] unexpected error:", err);
  });
}
