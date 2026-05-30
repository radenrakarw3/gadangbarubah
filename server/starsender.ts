/** Normalisasi nomor ke format 62xxxxxxxxxx untuk StarSender */
export function normalizePhoneForStarsender(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

export function isStarsenderConfigured(): boolean {
  if (process.env.STARSENDER_ENABLED === "false") return false;
  return Boolean(process.env.STARSENDER_API_KEY?.trim());
}

export type StarsenderSendResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string };

/**
 * Kirim pesan WhatsApp via StarSender.
 * Docs: POST starsender.online/api/sendText — header `apikey`, body { tujuan, message }
 */
export async function sendStarsenderMessage(
  phone: string,
  message: string,
): Promise<StarsenderSendResult> {
  const apiKey = process.env.STARSENDER_API_KEY?.trim();

  if (!isStarsenderConfigured() || !apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[StarSender:dev] skip → ${normalizePhoneForStarsender(phone)}:`,
        message.slice(0, 100) + (message.length > 100 ? "…" : ""),
      );
    }
    return { ok: true, skipped: true };
  }

  const url =
    process.env.STARSENDER_API_URL?.trim() ??
    "https://starsender.online/api/sendText";
  const tujuan = normalizePhoneForStarsender(phone);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({ tujuan, message }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      console.error("[StarSender] gagal kirim:", res.status, text);
      return { ok: false, error: text || `HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[StarSender] error:", msg);
    return { ok: false, error: msg };
  }
}
