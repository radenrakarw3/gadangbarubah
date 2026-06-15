/** Tipe layanan catering — dipakai form, API, dan notifikasi */
export const CATERING_INQUIRY_TYPES = [
  "saji-gadang",
  "snack-box",
  "buffet",
  "stall",
  "rental-room",
  "home-delivery",
  "tumpeng",
] as const;

export type CateringInquiryType = (typeof CATERING_INQUIRY_TYPES)[number];

export const CATERING_INQUIRY_TYPE_LABELS: Record<CateringInquiryType, string> = {
  "saji-gadang": "Saji Gadang / Nasi Box",
  "snack-box": "Snack Box",
  buffet: "Buffet",
  stall: "Stall",
  "rental-room": "Rental Room / Sewa Ruang",
  "home-delivery": "Home Delivery Service",
  tumpeng: "Nasi Tumpeng",
};

export const CATERING_INQUIRY_STATUSES = ["pending", "contacted", "closed"] as const;
export type CateringInquiryStatus = (typeof CATERING_INQUIRY_STATUSES)[number];

export type CateringInquiryMessageInput = {
  nama: string;
  noWhatsApp: string;
  tanggalEvent: string;
  eventDetail: string;
  lokasiEvent: string;
  tipeLayanan: CateringInquiryType;
  pax: number;
};

export function cateringTypeLabel(tipe: CateringInquiryType | string): string {
  return CATERING_INQUIRY_TYPE_LABELS[tipe as CateringInquiryType] ?? tipe;
}

export function buildStaffNewCateringMessage(inquiry: CateringInquiryMessageInput): string {
  const tipe = cateringTypeLabel(inquiry.tipeLayanan);

  return (
    `🔔 *Inquiry Catering Baru*\n\n` +
    `👤 Nama PIC: ${inquiry.nama}\n` +
    `📱 No.hp PIC: ${inquiry.noWhatsApp}\n` +
    `📅 Tanggal Event: ${inquiry.tanggalEvent}\n` +
    `📋 Event Detail: ${inquiry.eventDetail}\n` +
    `📍 Lokasi Event: ${inquiry.lokasiEvent}\n` +
    `🍽️ Layanan: ${tipe}\n` +
    `👥 Jumlah Pax: ${inquiry.pax}\n\n` +
    `Silakan follow-up via WhatsApp.`
  );
}
