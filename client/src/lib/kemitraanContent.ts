/** Konten halaman /kemitraan — hub kemitraan operasional B2B. Teks: shared/site-texts/kemitraan.ts */

import buffetImg from "@assets/catering-buffet_1781246285353.jpg";
import mealboxImg from "@assets/Nasi Box_1758628102653.jpg";
import snackboxImg from "@assets/DSC03165_1758567860370.jpg";
import stallImg from "@assets/DSC05600_1758565473997.jpg";
import rentalRoomImg from "@assets/DSC03147_1758567860387.jpg";
import deliveryImg from "@assets/DSC07153_1758564588952.jpg";
import eventCorporateImg from "@assets/DSC07220_1758565473982.jpg";
import eventWeddingImg from "@assets/DSC03081_1758567885552.jpg";
import eventFestivalImg from "@assets/DSC07140_1758564407964.jpg";
import eventGatheringImg from "@assets/DSC03388_1758567885565.jpg";
import eventPrivateImg from "@assets/DSC03165_1758566711557.jpg";
import eventOutdoorImg from "@assets/DSC07168_1758564588951.jpg";
import { FROZEN_FOOD_LINKTREE } from "@/lib/siteContent";

/** Portofolio acara — placeholder foto; ganti dengan aset event kemitraan nyata nanti */
export const KEMITRAAN_GALLERY_FEATURED = { id: "corp", image: eventCorporateImg } as const;

export const KEMITRAAN_GALLERY_ITEMS = [
  { id: "wedding", image: eventWeddingImg },
  { id: "festival", image: eventFestivalImg },
  { id: "gathering", image: eventGatheringImg },
  { id: "private", image: eventPrivateImg },
  { id: "outdoor", image: eventOutdoorImg },
] as const;

export const KEMITRAAN_SERVICES = [
  { id: "buffet", cateringType: "buffet" as const, image: buffetImg },
  { id: "mealbox", cateringType: "saji-gadang" as const, image: mealboxImg },
  { id: "snackbox", cateringType: "snack-box" as const, image: snackboxImg },
  { id: "stall", cateringType: "stall" as const, image: stallImg },
  {
    id: "rental-room",
    cateringType: "rental-room" as const,
    image: rentalRoomImg,
    externalHref: FROZEN_FOOD_LINKTREE,
  },
  { id: "home-delivery", cateringType: "home-delivery" as const, image: deliveryImg },
] as const;

export const KEMITRAAN_WHY_HIGHLIGHTS = [1, 2, 3] as const;

export const KEMITRAAN_PROCESS_STEPS = [1, 2, 3, 4] as const;
