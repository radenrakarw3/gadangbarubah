import type { ReservationRow } from "@/lib/reservation-admin";
import { formatTimeShort, PIPELINE_STATUSES } from "@shared/reservation-status";
import { Check } from "lucide-react";

const STEP_LABELS: Record<string, string> = {
  pending: "Dibuat",
  confirmed: "Dikonfirmasi",
  arrived: "Datang",
  dining: "Makan",
  completed: "Pulang",
};

function stepTime(res: ReservationRow, step: string): string | null {
  switch (step) {
    case "pending":
      return formatTimeShort(res.createdAt);
    case "confirmed":
      return res.status !== "pending" && res.status !== "cancelled"
        ? formatTimeShort(res.updatedAt)
        : null;
    case "arrived":
      return formatTimeShort(res.arrivedAt);
    case "dining":
      return formatTimeShort(res.diningAt);
    case "completed":
      return formatTimeShort(res.completedAt);
    default:
      return null;
  }
}

function stepIndex(status: string): number {
  if (status === "cancelled") return -1;
  return PIPELINE_STATUSES.indexOf(status as (typeof PIPELINE_STATUSES)[number]);
}

interface ReservationTimelineProps {
  reservation: ReservationRow;
  compact?: boolean;
}

export default function ReservationTimeline({
  reservation,
  compact = false,
}: ReservationTimelineProps) {
  const currentIdx = stepIndex(reservation.status);
  const isCancelled = reservation.status === "cancelled";

  if (isCancelled) {
    return (
      <p className="text-xs text-red-600 font-medium">Reservasi dibatalkan</p>
    );
  }

  return (
    <div className={`flex ${compact ? "gap-1" : "gap-2"} items-start w-full overflow-x-auto`}>
      {PIPELINE_STATUSES.map((step, idx) => {
        const done = currentIdx >= idx;
        const active = currentIdx === idx;
        const time = stepTime(reservation, step);

        return (
          <div
            key={step}
            className={`flex flex-col items-center flex-1 min-w-[52px] ${compact ? "text-[9px]" : "text-[10px]"}`}
          >
            <div
              className={`rounded-full flex items-center justify-center border ${
                compact ? "w-5 h-5" : "w-6 h-6"
              } ${
                done
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted border-border text-muted-foreground"
              } ${active ? "ring-2 ring-gold ring-offset-1" : ""}`}
            >
              {done ? <Check className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} /> : idx + 1}
            </div>
            <span
              className={`mt-1 text-center leading-tight ${
                active ? "font-semibold text-foreground" : "text-muted-foreground"
              }`}
            >
              {STEP_LABELS[step]}
            </span>
            {time && (
              <span className="text-muted-foreground/80 tabular-nums">{time}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
