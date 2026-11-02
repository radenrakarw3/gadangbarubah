import type { CateringInquiry } from "./schema";
import {
  CATERING_INQUIRY_STATUSES,
  cateringTypeLabel,
  type CateringInquiryStatus,
} from "./catering";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const STATUS_LABELS: Record<CateringInquiryStatus, string> = {
  pending: "Menunggu",
  contacted: "Dihubungi",
  closed: "Selesai",
};

export function isCateringPublicId(id: string): boolean {
  return UUID_RE.test(id);
}

export type PublicCateringStatusPayload = {
  id: string;
  shortId: string;
  status: CateringInquiryStatus;
  statusLabel: string;
  nama: string;
  tanggalEvent: string;
  lokasiEvent: string;
  tipeLayanan: string;
  tipeLabel: string;
  pax: number;
  source: string;
  createdAt: string;
};

export function toPublicCateringStatus(
  inquiry: CateringInquiry,
): PublicCateringStatusPayload | null {
  if (!CATERING_INQUIRY_STATUSES.includes(inquiry.status as CateringInquiryStatus)) {
    return null;
  }
  const status = inquiry.status as CateringInquiryStatus;
  const created =
    inquiry.createdAt instanceof Date
      ? inquiry.createdAt.toISOString()
      : new Date(inquiry.createdAt).toISOString();

  return {
    id: inquiry.id,
    shortId: inquiry.id.slice(0, 8),
    status,
    statusLabel: STATUS_LABELS[status],
    nama: inquiry.nama,
    tanggalEvent: inquiry.tanggalEvent,
    lokasiEvent: inquiry.lokasiEvent,
    tipeLayanan: inquiry.tipeLayanan,
    tipeLabel: cateringTypeLabel(inquiry.tipeLayanan),
    pax: inquiry.pax,
    source: inquiry.source,
    createdAt: created,
  };
}
