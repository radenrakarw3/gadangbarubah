import fs from "fs";
import path from "path";
import { storage } from "./storage";

const ASSETS_DIR = path.join(process.cwd(), "attached_assets");
const MENU_UPLOADS_DIR = path.join(process.cwd(), "uploads", "menu");

function copyAssetToMenuUploads(filename: string): string {
  if (!fs.existsSync(MENU_UPLOADS_DIR)) {
    fs.mkdirSync(MENU_UPLOADS_DIR, { recursive: true });
  }

  const source = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(source)) {
    throw new Error(`Asset tidak ditemukan: ${filename}`);
  }

  const destName = `seed-${filename}`;
  const dest = path.join(MENU_UPLOADS_DIR, destName);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(source, dest);
  }

  return `/uploads/menu/${destName}`;
}

export async function seedMenuIfEmpty(): Promise<void> {
  try {
    const existing = await storage.getMenuCategories();
    if (existing.length > 0) return;

    const rendangImg = copyAssetToMenuUploads("DSC02799_1758628102653.jpg");
    const dendengImg = copyAssetToMenuUploads("DSC07168_1758564588951.jpg");
    const gulaiImg = copyAssetToMenuUploads("DSC02371_1758564588950.jpg");
    const minumanImg = copyAssetToMenuUploads("DSC02436_1758564588903.jpg");

    const andalan = await storage.createMenuCategory({
      nameId: "Menu Andalan",
      nameEn: "Signature Dishes",
      slug: "menu-andalan",
      sortOrder: 0,
      isActive: true,
    });

    const minuman = await storage.createMenuCategory({
      nameId: "Minuman",
      nameEn: "Beverages",
      slug: "minuman",
      sortOrder: 1,
      isActive: true,
    });

    const paket = await storage.createMenuCategory({
      nameId: "Paket",
      nameEn: "Packages",
      slug: "paket",
      sortOrder: 2,
      isActive: true,
    });

    const items = [
      {
        categoryId: andalan.id,
        nameId: "Tunjang Hotplate",
        nameEn: "Tunjang Hotplate",
        descriptionId: "Tunjang sapi empuk disajikan di hotplate dengan bumbu khas Minang.",
        descriptionEn: "Tender beef shank served on a hotplate with signature Minang spices.",
        imagePath: gulaiImg,
        tag: "Andalan",
        isFeatured: true,
        sortOrder: 0,
      },
      {
        categoryId: andalan.id,
        nameId: "Dendeng Bakar",
        nameEn: "Grilled Dendeng",
        descriptionId: "Dendeng sapi bakar renyah dengan cita rasa gurih khas Padang.",
        descriptionEn: "Crispy grilled beef dendeng with classic Padang flavor.",
        imagePath: dendengImg,
        tag: "Andalan",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        categoryId: andalan.id,
        nameId: "Rendang Daging",
        nameEn: "Beef Rendang",
        descriptionId: "Daging empuk dengan bumbu rempah khas Minang, dimasak hingga meresap sempurna.",
        descriptionEn: "Tender beef slow-cooked in rich Minang spices until perfectly absorbed.",
        imagePath: rendangImg,
        tag: "Terlaris",
        isFeatured: true,
        sortOrder: 2,
      },
      {
        categoryId: andalan.id,
        nameId: "Ayam Pop",
        nameEn: "Ayam Pop",
        descriptionId: "Ayam kampung lembut dengan kuah kaldu bening khas Padang.",
        descriptionEn: "Soft free-range chicken with clear Padang-style broth.",
        imagePath: rendangImg,
        tag: "Andalan",
        isFeatured: false,
        sortOrder: 3,
      },
      {
        categoryId: andalan.id,
        nameId: "Gulai Kambing",
        nameEn: "Goat Gulai",
        descriptionId: "Gulai kambing beraroma rempah, cocok untuk pecinta cita rasa kuat.",
        descriptionEn: "Aromatic goat gulai for lovers of bold Minang flavors.",
        imagePath: gulaiImg,
        tag: "Favorit",
        isFeatured: false,
        sortOrder: 4,
      },
      {
        categoryId: andalan.id,
        nameId: "Dendeng Balado",
        nameEn: "Dendeng Balado",
        descriptionId: "Dendeng renyah dengan sambal balado pedas gurih.",
        descriptionEn: "Crispy dendeng with spicy and savory balado sambal.",
        imagePath: dendengImg,
        tag: "Andalan",
        isFeatured: false,
        sortOrder: 5,
      },
      {
        categoryId: minuman.id,
        nameId: "Es Tebak",
        nameEn: "Es Tebak",
        descriptionId: "Minuman segar khas dengan sensasi tebak rasa yang menyegarkan.",
        descriptionEn: "A refreshing signature drink with a playful guessing twist.",
        imagePath: minumanImg,
        tag: "Favorit",
        isFeatured: true,
        sortOrder: 0,
      },
      {
        categoryId: paket.id,
        nameId: "Nasi Tumpeng",
        nameEn: "Nasi Tumpeng",
        descriptionId: "Paket lengkap 10–15 porsi untuk acara spesial keluarga dan kantor.",
        descriptionEn: "Complete package for 10–15 servings, ideal for family and office events.",
        imagePath: gulaiImg,
        tag: "Katering",
        isFeatured: false,
        sortOrder: 0,
      },
      {
        categoryId: paket.id,
        nameId: "Menu Saji Gadang",
        nameEn: "Saji Gadang Menu",
        descriptionId: "Paket praktis siap saji untuk dibawa pulang atau acara kecil.",
        descriptionEn: "Ready-to-serve package for takeaway or small gatherings.",
        imagePath: rendangImg,
        tag: "Bawa Pulang",
        isFeatured: false,
        sortOrder: 1,
      },
    ];

    for (const item of items) {
      await storage.createMenuItem(
        {
          categoryId: item.categoryId,
          nameId: item.nameId,
          nameEn: item.nameEn,
          descriptionId: item.descriptionId,
          descriptionEn: item.descriptionEn,
          tag: item.tag,
          isFeatured: item.isFeatured,
          isActive: true,
          sortOrder: item.sortOrder,
        },
        item.imagePath,
      );
    }

    console.log("Menu seed: data awal berhasil ditambahkan");
  } catch (error) {
    console.error("Menu seed error:", error);
  }
}
