import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Campaign } from '@shared/schema';

interface CampaignPopupProps {
  onClose?: () => void;
}

export default function CampaignPopup({ onClose }: CampaignPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [queryEnabled, setQueryEnabled] = useState(false);

  useEffect(() => {
    const enable = () => setQueryEnabled(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(enable, 1500);
    return () => clearTimeout(t);
  }, []);

  const { data, isSuccess } = useQuery<{ success: boolean; campaign: Campaign | null }>({
    queryKey: ['/api/campaigns/active'],
    enabled: queryEnabled,
  });

  const campaign = data?.campaign;

  useEffect(() => {
    // Only process when query has successfully completed
    if (!isSuccess) {
      return;
    }

    // If no campaign exists, don't render
    if (!campaign) {
      setShouldRender(false);
      return;
    }

    // Check if user has already seen this campaign
    const campaignKey = `campaign_seen_${campaign.id}`;
    const hasSeen = localStorage.getItem(campaignKey);

    if (hasSeen) {
      setShouldRender(false);
      return;
    }

    // Valid campaign that hasn't been seen - show it
    setShouldRender(true);

    // Show popup after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [campaign, isSuccess]);

  const handleClose = () => {
    if (campaign) {
      // Mark as seen in localStorage
      const campaignKey = `campaign_seen_${campaign.id}`;
      localStorage.setItem(campaignKey, 'true');
    }

    setIsVisible(false);
    
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      setShouldRender(false);
      onClose?.();
    }, 300);
  };

  if (!shouldRender || !campaign) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
      data-testid="campaign-popup-overlay"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Popup Content */}
      <div
        className={`relative max-w-[600px] w-full transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        data-testid="campaign-popup-content"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 bg-background border-2 border-foreground rounded-full p-2 hover-elevate active-elevate-2 shadow-lg"
          aria-label="Close popup"
          data-testid="button-close-campaign"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Campaign Image */}
        <img
          src={campaign.imagePath}
          alt={campaign.title}
          className="w-full rounded-lg shadow-2xl"
          data-testid="img-campaign"
        />
      </div>
    </div>
  );
}
