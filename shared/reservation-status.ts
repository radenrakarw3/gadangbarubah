export const RESERVATION_STATUSES = [
  "pending",
  "confirmed",
  "arrived",
  "dining",
  "completed",
  "cancelled",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  arrived: "Sudah Datang",
  dining: "Sedang Makan",
  completed: "Pulang",
  cancelled: "Dibatalkan",
};

/** Urutan pipeline operasional (tanpa cancelled) */
export const PIPELINE_STATUSES: ReservationStatus[] = [
  "pending",
  "confirmed",
  "arrived",
  "dining",
  "completed",
];

export const ALLOWED_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["arrived", "cancelled"],
  arrived: ["dining", "cancelled"],
  dining: ["completed"],
  completed: [],
  cancelled: [],
};

export function canTransition(from: ReservationStatus, to: ReservationStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getNextStatus(current: ReservationStatus): ReservationStatus | null {
  const idx = PIPELINE_STATUSES.indexOf(current);
  if (idx === -1 || idx >= PIPELINE_STATUSES.length - 1) return null;
  return PIPELINE_STATUSES[idx + 1];
}

export function getPrimaryAction(current: ReservationStatus): {
  status: ReservationStatus;
  label: string;
} | null {
  switch (current) {
    case "pending":
      return { status: "confirmed", label: "Konfirmasi" };
    case "confirmed":
      return { status: "arrived", label: "Tamu Datang" };
    case "arrived":
      return { status: "dining", label: "Sedang Makan" };
    case "dining":
      return { status: "completed", label: "Pulang" };
    default:
      return null;
  }
}

export function formatTimeShort(iso: string | Date | null | undefined): string | null {
  if (!iso) return null;
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function isReservationStatus(value: string): value is ReservationStatus {
  return (RESERVATION_STATUSES as readonly string[]).includes(value);
}
