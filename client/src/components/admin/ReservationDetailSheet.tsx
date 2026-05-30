import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReservationTimeline from "./ReservationTimeline";
import {
  RESERVATION_STATUS_LABELS,
  STATUS_BADGE_CLASS,
  formatOutletLabel,
  formatReservationDate,
  waConfirmTemplate,
  waLink,
  type ReservationRow,
} from "@/lib/reservation-admin";
import { formatTimeShort } from "@shared/reservation-status";

interface ReservationDetailSheetProps {
  reservation: ReservationRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReservationDetailSheet({
  reservation,
  open,
  onOpenChange,
}: ReservationDetailSheetProps) {
  if (!reservation) return null;

  const status = reservation.status as keyof typeof RESERVATION_STATUS_LABELS;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">{reservation.namaLengkap}</SheetTitle>
          <Badge variant="outline" className={`w-fit ${STATUS_BADGE_CLASS[status]}`}>
            {RESERVATION_STATUS_LABELS[status]}
          </Badge>
        </SheetHeader>

        <div className="mt-6 space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Tanggal</p>
              <p className="font-medium">{formatReservationDate(String(reservation.tanggalReservasi))}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Waktu</p>
              <p className="font-medium">{reservation.waktuReservasi} WIB</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Tamu</p>
              <p className="font-medium">{reservation.jumlahTamu} orang</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Meja</p>
              <p className="font-medium">
                {reservation.tipeMeja === "vip" ? "VIP Room" : "Reguler"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Outlet</p>
              <p className="font-medium">{formatOutletLabel(reservation.outlet)}</p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">WhatsApp</p>
            <a
              href={waLink(reservation.noWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {reservation.noWhatsApp}
            </a>
          </div>

          {reservation.email && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Email</p>
              <p>{reservation.email}</p>
            </div>
          )}

          {reservation.catatan && (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Catatan</p>
              <p className="bg-muted/50 rounded p-3 text-muted-foreground">{reservation.catatan}</p>
            </div>
          )}

          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-3">
              Riwayat Kunjungan
            </p>
            <ReservationTimeline reservation={reservation} />
            <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
              <li>Dibuat: {formatTimeShort(reservation.createdAt) ?? "—"}</li>
              {reservation.arrivedAt && (
                <li>Datang: {formatTimeShort(reservation.arrivedAt)}</li>
              )}
              {reservation.diningAt && (
                <li>Mulai makan: {formatTimeShort(reservation.diningAt)}</li>
              )}
              {reservation.completedAt && (
                <li>Pulang: {formatTimeShort(reservation.completedAt)}</li>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <a
                href={waLink(reservation.noWhatsApp, waConfirmTemplate(reservation))}
                target="_blank"
                rel="noopener noreferrer"
              >
                Kirim Konfirmasi WA
              </a>
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              ID: {reservation.id.slice(0, 8)}…
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
