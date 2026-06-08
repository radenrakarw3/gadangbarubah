import { AlertTriangle, Loader2, MessageCircle, Users, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReservationTimeline from "./ReservationTimeline";
import {
  RESERVATION_STATUS_LABELS,
  STATUS_BADGE_CLASS,
  formatOutletLabel,
  formatReservationDate,
  hasCustomerNotifyFailure,
  hasStaffNotifyFailure,
  isSoonReservation,
  waLink,
  type ReservationRow,
} from "@/lib/reservation-admin";
import {
  getPrimaryAction,
  type ReservationStatus,
} from "@shared/reservation-status";

interface ReservationCardProps {
  reservation: ReservationRow;
  updating: boolean;
  onStatusChange: (id: string, status: ReservationStatus) => void;
  onOpenDetail: (res: ReservationRow) => void;
}

export default function ReservationCard({
  reservation,
  updating,
  onStatusChange,
  onOpenDetail,
}: ReservationCardProps) {
  const status = reservation.status as ReservationStatus;
  const primary = getPrimaryAction(status);
  const soon =
    reservation.status !== "cancelled" &&
    reservation.status !== "completed" &&
    isSoonReservation(String(reservation.tanggalReservasi), reservation.waktuReservasi);

  return (
    <Card
      className="border-border/60 hover:border-gold/30 transition-colors cursor-pointer"
      onClick={() => onOpenDetail(reservation)}
    >
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{reservation.namaLengkap}</h3>
              {reservation.tipeMeja === "vip" && (
                <Badge variant="outline" className="text-gold border-gold/40 gap-1">
                  <Crown className="h-3 w-3" /> VIP
                </Badge>
              )}
              {soon && (
                <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px]">
                  Segera
                </Badge>
              )}
              {(hasCustomerNotifyFailure(reservation) || hasStaffNotifyFailure(reservation)) && (
                <Badge
                  variant="outline"
                  className="gap-1 border-amber-500/60 text-amber-800 text-[10px]"
                  title={
                    hasCustomerNotifyFailure(reservation)
                      ? reservation.customerNotifyError ?? "Notifikasi WA pelanggan gagal"
                      : reservation.staffNotifyError ?? "Notifikasi WA staff gagal"
                  }
                >
                  <AlertTriangle className="h-3 w-3" />
                  WA gagal
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatReservationDate(String(reservation.tanggalReservasi))} ·{" "}
              {reservation.waktuReservasi} WIB
            </p>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 ${STATUS_BADGE_CLASS[status] ?? ""}`}
          >
            {RESERVATION_STATUS_LABELS[status]}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {reservation.jumlahTamu} tamu
          </span>
          <span>{formatOutletLabel(reservation.outlet)}</span>
        </div>

        <ReservationTimeline reservation={reservation} compact />

        <div
          className="flex flex-wrap gap-2 pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <a
              href={waLink(reservation.noWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>

          {primary && (
            <Button
              size="sm"
              className="btn-reserve flex-1 sm:flex-none"
              disabled={updating}
              onClick={() => onStatusChange(reservation.id, primary.status)}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                primary.label
              )}
            </Button>
          )}

          {(status === "pending" || status === "confirmed" || status === "arrived") && (
            <Button
              variant="destructive"
              size="sm"
              disabled={updating}
              onClick={() => onStatusChange(reservation.id, "cancelled")}
            >
              Batalkan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
