/** Query publik selalu ambil data terbaru dari database saat halaman dibuka. */
export const menuPublicQueryOptions = {
  staleTime: 30_000,
  refetchOnMount: true as const,
};

export function menuListQueryKey() {
  return ["/api/menu"] as const;
}

export function menuFeaturedQueryKey() {
  return ["/api/menu/featured"] as const;
}

export function normalizeMenuSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export function validateCategoryForm(form: {
  nameId: string;
  nameEn: string;
  slug: string;
}): string | null {
  if (!form.nameId.trim()) return "Nama kategori (ID) wajib diisi";
  if (!form.nameEn.trim()) return "Nama kategori (EN) wajib diisi";
  if (!form.slug.trim()) return "Slug wajib diisi";
  if (!/^[a-z0-9-]+$/.test(form.slug)) {
    return "Slug hanya huruf kecil, angka, dan strip";
  }
  return null;
}

export function validateItemForm(
  form: {
    categoryId: string;
    nameId: string;
    nameEn: string;
    descriptionId: string;
    descriptionEn: string;
  },
  options: { requireImage: boolean; hasImage: boolean },
): string | null {
  if (!form.categoryId) return "Kategori wajib dipilih";
  if (!form.nameId.trim()) return "Nama (ID) wajib diisi";
  if (!form.nameEn.trim()) return "Nama (EN) wajib diisi";
  if (!form.descriptionId.trim()) return "Deskripsi (ID) wajib diisi";
  if (!form.descriptionEn.trim()) return "Deskripsi (EN) wajib diisi";
  if (options.requireImage && !options.hasImage) return "Foto menu wajib diupload";
  return null;
}
