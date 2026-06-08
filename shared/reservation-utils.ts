/** Slot jam reservasi meja — dipakai client & server */
export const RESERVATION_TIME_SLOTS = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
] as const;

export type ReservationTimeSlot = (typeof RESERVATION_TIME_SLOTS)[number];

const WIB = "Asia/Jakarta";

/** Tanggal hari ini format YYYY-MM-DD (WIB) */
export function todayISOInWIB(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: WIB,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Jam sekarang format HH:mm (WIB) */
export function currentTimeInWIB(): string {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: WIB,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  return formatted.replace(/^24:/, "00:");
}

/** Normalisasi input ke format 08xxxxxxxxxx */
export function normalizeWhatsAppInput(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    digits = `0${digits.slice(2)}`;
  } else if (digits.startsWith("8")) {
    digits = `0${digits}`;
  }
  return digits;
}

export function isValidWhatsApp(phone: string): boolean {
  const normalized = normalizeWhatsAppInput(phone);
  return /^08\d{8,11}$/.test(normalized);
}

export function isReservationTimeSlot(value: string): value is ReservationTimeSlot {
  return (RESERVATION_TIME_SLOTS as readonly string[]).includes(value);
}

/** Slot yang masih bisa dipilih untuk tanggal tertentu */
export function availableTimeSlotsForDate(date: string): ReservationTimeSlot[] {
  const today = todayISOInWIB();
  if (date > today) return [...RESERVATION_TIME_SLOTS];
  if (date < today) return [];
  const now = currentTimeInWIB();
  return RESERVATION_TIME_SLOTS.filter((slot) => slot > now);
}

export function validateReservationDateTime(date: string, time: string): string | null {
  const today = todayISOInWIB();
  if (!date || date < today) {
    return "Tanggal reservasi tidak boleh di masa lalu";
  }
  if (!isReservationTimeSlot(time)) {
    return "Pilih jam reservasi yang tersedia";
  }
  if (date === today && time <= currentTimeInWIB()) {
    return "Jam reservasi harus setelah waktu sekarang (WIB)";
  }
  if (availableTimeSlotsForDate(date).length === 0) {
    return "Tidak ada slot tersedia untuk tanggal ini. Pilih tanggal lain.";
  }
  return null;
}
