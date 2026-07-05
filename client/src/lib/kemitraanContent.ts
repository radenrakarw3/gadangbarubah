/** Konten halaman /kemitraan — hub kemitraan operasional B2B */

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

export const KEMITRAAN_HERO = {
  ID: {
    eyebrow: "Kemitraan B2B",
    headline: "Partner Kuliner Padang untuk Acara & Bisnis Anda",
    subheadline:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Catering event, tenant festival, sewa venue, hingga kebutuhan corporate — satu pintu kerja sama dengan Gadang Barubah.",
    cta: "Diskusikan Kebutuhan Anda",
  },
  EN: {
    eyebrow: "B2B Partnership",
    headline: "Your Padang Culinary Partner for Events & Business",
    subheadline:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Event catering, festival tenants, venue rental, and corporate needs — one partnership hub with Gadang Barubah.",
    cta: "Discuss Your Needs",
  },
} as const;

/** Portofolio acara — placeholder foto; ganti dengan aset event kemitraan nyata nanti */
export const KEMITRAAN_GALLERY = {
  ID: {
    title: "Momen Kemitraan Kami",
    subtitle: "Lorem ipsum — cuplikan kolaborasi catering, tenant event, dan corporate gathering.",
    items: [
      { id: "corp", image: eventCorporateImg, label: "Corporate Gathering", caption: "Lorem ipsum dolor sit amet consectetur." },
      { id: "wedding", image: eventWeddingImg, label: "Wedding Buffet", caption: "Sed do eiusmod tempor incididunt ut labore." },
      { id: "festival", image: eventFestivalImg, label: "Festival & Bazaar", caption: "Ut enim ad minim veniam quis nostrud." },
      { id: "gathering", image: eventGatheringImg, label: "Office Gathering", caption: "Duis aute irure dolor in reprehenderit." },
      { id: "private", image: eventPrivateImg, label: "Private Dining", caption: "Excepteur sint occaecat cupidatat non." },
      { id: "outdoor", image: eventOutdoorImg, label: "Outdoor Event", caption: "Proident sunt in culpa qui officia." },
    ],
  },
  EN: {
    title: "Partnership Highlights",
    subtitle: "Lorem ipsum — snapshots of catering, event tenants, and corporate collaborations.",
    items: [
      { id: "corp", image: eventCorporateImg, label: "Corporate Gathering", caption: "Lorem ipsum dolor sit amet consectetur." },
      { id: "wedding", image: eventWeddingImg, label: "Wedding Buffet", caption: "Sed do eiusmod tempor incididunt ut labore." },
      { id: "festival", image: eventFestivalImg, label: "Festival & Bazaar", caption: "Ut enim ad minim veniam quis nostrud." },
      { id: "gathering", image: eventGatheringImg, label: "Office Gathering", caption: "Duis aute irure dolor in reprehenderit." },
      { id: "private", image: eventPrivateImg, label: "Private Dining", caption: "Excepteur sint occaecat cupidatat non." },
      { id: "outdoor", image: eventOutdoorImg, label: "Outdoor Event", caption: "Proident sunt in culpa qui officia." },
    ],
  },
} as const;

export const KEMITRAAN_SERVICES = [
  {
    id: "buffet",
    cateringType: "buffet" as const,
    image: buffetImg,
    nameID: "Buffet Acara",
    nameEN: "Event Buffet",
    descID: "Lorem ipsum prasmanan Padang untuk pernikahan, corporate event, dan perayaan besar.",
    descEN: "Lorem ipsum Padang buffet for weddings, corporate events, and large celebrations.",
  },
  {
    id: "mealbox",
    cateringType: "saji-gadang" as const,
    image: mealboxImg,
    nameID: "Mealbox Corporate",
    nameEN: "Corporate Mealbox",
    descID: "Lorem ipsum nasi box untuk meeting, seminar, dan acara kantor.",
    descEN: "Lorem ipsum rice boxes for meetings, seminars, and office events.",
  },
  {
    id: "snackbox",
    cateringType: "snack-box" as const,
    image: snackboxImg,
    nameID: "Snackbox & Hospitality",
    nameEN: "Snackbox & Hospitality",
    descID: "Lorem ipsum camilan kemasan untuk tamu dan goodie bag acara.",
    descEN: "Lorem ipsum packaged snacks for guests and event goodie bags.",
  },
  {
    id: "stall",
    cateringType: "stall" as const,
    image: stallImg,
    nameID: "Tenant / Stall Event",
    nameEN: "Event Tenant / Stall",
    descID: "Lorem ipsum gerai live cooking di festival, bazaar, dan event outdoor.",
    descEN: "Lorem ipsum live cooking stalls at festivals, bazaars, and outdoor events.",
  },
  {
    id: "rental-room",
    cateringType: "rental-room" as const,
    image: rentalRoomImg,
    nameID: "Sewa Venue",
    nameEN: "Venue Rental",
    descID: "Lorem ipsum ruang VIP untuk private dining dan gathering intim.",
    descEN: "Lorem ipsum VIP rooms for private dining and intimate gatherings.",
  },
  {
    id: "home-delivery",
    cateringType: "home-delivery" as const,
    image: deliveryImg,
    nameID: "Corporate Delivery",
    nameEN: "Corporate Delivery",
    descID: "Lorem ipsum pesanan rutin dan bulk order untuk perusahaan.",
    descEN: "Lorem ipsum recurring and bulk orders for companies.",
  },
] as const;

export const KEMITRAAN_WHY = {
  ID: {
    title: "Mengapa Bermitra dengan Gadang Barubah",
    intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Kami hadir sebagai mitra operasional yang memahami kebutuhan acara dan bisnis — bukan sekadar penyedia makanan.",
    highlights: [
      { value: "500+", label: "Pax per acara" },
      { value: "6+", label: "Jenis layanan" },
      { value: "24j", label: "Respon inquiry" },
    ],
    bullets: [
      "Menu Padang autentik & konsisten",
      "Tim setup profesional di lokasi",
      "Invoice resmi untuk corporate",
      "Fleksibel dari intimate hingga besar",
    ],
  },
  EN: {
    title: "Why Partner with Gadang Barubah",
    intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. We are an operational partner who understands events and business needs — not just a food provider.",
    highlights: [
      { value: "500+", label: "Guests per event" },
      { value: "6+", label: "Service types" },
      { value: "24h", label: "Inquiry response" },
    ],
    bullets: [
      "Authentic & consistent Padang menus",
      "Professional on-site setup team",
      "Official invoices for corporate",
      "Flexible from intimate to large scale",
    ],
  },
} as const;

export const KEMITRAAN_PROCESS = {
  ID: {
    title: "Alur Kerja Sama",
    steps: [
      { title: "Brief", desc: "Lorem ipsum ceritakan kebutuhan acara Anda." },
      { title: "Quotation", desc: "Kami kirim penawaran menyesuaikan skala & menu." },
      { title: "Konfirmasi", desc: "Finalisasi menu, jadwal, dan detail logistik." },
      { title: "Eksekusi", desc: "Tim kami hadir — setup, saji, hingga selesai." },
    ],
  },
  EN: {
    title: "How We Work Together",
    steps: [
      { title: "Brief", desc: "Lorem ipsum tell us about your event needs." },
      { title: "Quotation", desc: "We send a tailored proposal for scale & menu." },
      { title: "Confirmation", desc: "Finalize menu, schedule, and logistics." },
      { title: "Execution", desc: "Our team delivers — setup through completion." },
    ],
  },
} as const;

export const KEMITRAAN_INQUIRY = {
  ID: {
    title: "Mulai Kemitraan Anda",
    subtitle: "Isi form berikut — tim kami akan menghubungi untuk konsultasi lebih lanjut.",
    sideTitle: "Butuh diskusi cepat?",
    sideBody: "Lorem ipsum hubungi tim kemitraan kami untuk konsultasi awal tanpa komitmen.",
    waCta: "Chat WhatsApp",
  },
  EN: {
    title: "Start Your Partnership",
    subtitle: "Fill in the form below — our team will reach out for a consultation.",
    sideTitle: "Need a quick chat?",
    sideBody: "Lorem ipsum contact our partnership team for an initial no-commitment consultation.",
    waCta: "Chat on WhatsApp",
  },
} as const;
