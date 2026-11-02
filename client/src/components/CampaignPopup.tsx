import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Campaign } from "@shared/schema";

const SEEN_KEY = "gb-campaign-seen";

function forceShowCampaign(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("campaign") === "1";
  } catch {
    return false;
  }
}

export default function CampaignPopup() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const force = forceShowCampaign();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/campaigns/active", { credentials: "include" });
        if (!res.ok) return;
        const data: { success?: boolean; campaign: Campaign | null } = await res.json();
        if (cancelled || !data.campaign) return;
        if (!force && sessionStorage.getItem(SEEN_KEY) === data.campaign.id) return;
        setCampaign(data.campaign);
        setOpen(true);
      } catch {
        /* popup opsional — abaikan error jaringan */
      }
    }, force ? 300 : 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && campaign && !forceShowCampaign()) {
      sessionStorage.setItem(SEEN_KEY, campaign.id);
    }
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="z-[200] w-[min(90vw,600px,85svh)] max-w-[600px] border-0 bg-transparent p-0 shadow-none [&>button]:right-3 [&>button]:top-3 [&>button]:rounded-full [&>button]:bg-white [&>button]:p-1.5 [&>button]:text-black [&>button]:opacity-90"
        data-testid="campaign-popup"
      >
        <DialogTitle className="sr-only">{campaign.title}</DialogTitle>
        <img
          src={campaign.imagePath}
          alt={campaign.title}
          className="aspect-square w-full rounded-lg object-cover"
        />
      </DialogContent>
    </Dialog>
  );
}
