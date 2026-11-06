import { useState } from "react";
import { AlertTriangle, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isEphemeralDiskImagePath } from "@/lib/media-path";
import { cn } from "@/lib/utils";

type AdminImagePreviewProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imgClassName?: string;
};

/** Preview admin dengan badge jika path disk lama (/uploads) atau gagal load. */
export default function AdminImagePreview({
  src,
  alt,
  className,
  imgClassName,
}: AdminImagePreviewProps) {
  const [failed, setFailed] = useState(false);
  const ephemeral = isEphemeralDiskImagePath(src);
  const showImg = Boolean(src) && !ephemeral && !failed;
  const broken = !src || failed || ephemeral;

  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", className)}>
      {showImg ? (
        <img
          src={src!}
          alt={alt}
          className={cn("h-full w-full object-cover", imgClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full min-h-[5rem] w-full flex-col items-center justify-center gap-1 p-3 text-muted-foreground">
          <ImageOff className="h-6 w-6" />
          <span className="text-xs">Foto tidak tersedia</span>
        </div>
      )}
      {broken && (
        <Badge
          variant="destructive"
          className="absolute left-2 top-2 gap-1 text-[10px] font-normal"
        >
          <AlertTriangle className="h-3 w-3" />
          {ephemeral ? "Perlu upload ulang" : "Foto rusak"}
        </Badge>
      )}
    </div>
  );
}
