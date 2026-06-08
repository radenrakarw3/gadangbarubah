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
  email?: string | null;
  tipeLayanan: CateringInquiryType;
  pax: number;
};

export function cateringTypeLabel(tipe: CateringInquiryType | string): string {
  return CATERING_INQUIRY_TYPE_LABELS[tipe as CateringInquiryType] ?? tipe;
}

export function buildStaffNewCateringMessage(inquiry: CateringInquiryMessageInput): string {
  const tipe = cateringTypeLabel(inquiry.tipeLayanan);
  const emailLine = inquiry.email?.trim() ? `📧 ${inquiry.email.trim()}\n` : "";

  return (
    `🔔 *Inquiry Catering Baru*\n\n` +
    `👤 ${inquiry.nama}\n` +
    `📱 ${inquiry.noWhatsApp}\n` +
    emailLine +
    `🍽️ ${tipe}\n` +
    `👥 ${inquiry.pax} pax\n\n` +
    `Silakan follow-up via WhatsApp.`
  );
}
