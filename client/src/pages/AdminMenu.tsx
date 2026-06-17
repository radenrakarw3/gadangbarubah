import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Upload,
  ImageIcon,
  Star,
  Power,
  PowerOff,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest, parseApiError } from "@/lib/queryClient";
import { apiFetch } from "@/lib/api";
import {
  menuFeaturedQueryKey,
  menuListQueryKey,
  validateCategoryForm,
  validateItemForm,
} from "@/lib/menu";
import type { MenuCategory, MenuItem } from "@shared/schema";

type MenuItemRow = MenuItem & { categoryNameId: string; categoryNameEn: string };

const emptyCategoryForm = {
  nameId: "",
  nameEn: "",
  slug: "",
  sortOrder: "0",
  isActive: true,
};

const emptyItemForm = {
  categoryId: "",
  nameId: "",
  nameEn: "",
  descriptionId: "",
  descriptionEn: "",
  tag: "",
  isFeatured: false,
  isActive: true,
  sortOrder: "0",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminMenu() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: categoriesData } = useQuery<{ success: boolean; categories: MenuCategory[] }>({
    queryKey: ["/api/admin/menu/categories"],
  });
  const categories = categoriesData?.categories ?? [];

  const { data: itemsData } = useQuery<{ success: boolean; items: MenuItemRow[] }>({
    queryKey: ["/api/admin/menu/items"],
  });
  const items = itemsData?.items ?? [];

  const filteredItems =
    categoryFilter === "all"
      ? items
      : items.filter((item) => item.categoryId === categoryFilter);

  const invalidateMenu = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/menu/categories"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/menu/items"] });
    queryClient.invalidateQueries({ queryKey: menuListQueryKey() });
    queryClient.invalidateQueries({ queryKey: menuFeaturedQueryKey() });
  };

  const handleSaveCategory = () => {
    const error = validateCategoryForm(categoryForm);
    if (error) {
      toast({ title: "Form belum lengkap", description: error, variant: "destructive" });
      return;
    }
    categoryMutation.mutate();
  };

  const handleSaveItem = () => {
    const error = validateItemForm(itemForm, {
      requireImage: !editingItemId,
      hasImage: Boolean(selectedFile),
    });
    if (error) {
      toast({ title: "Form belum lengkap", description: error, variant: "destructive" });
      return;
    }
    itemMutation.mutate();
  };

  const categoryMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        nameId: categoryForm.nameId,
        nameEn: categoryForm.nameEn,
        slug: categoryForm.slug,
        sortOrder: Number(categoryForm.sortOrder),
        isActive: categoryForm.isActive,
      };
      const res = editingCategoryId
        ? await apiRequest("PATCH", `/api/admin/menu/categories/${editingCategoryId}`, payload)
        : await apiRequest("POST", "/api/admin/menu/categories", payload);
      return res.json() as Promise<{ message?: string }>;
    },
    onSuccess: (data: { message?: string }) => {
      toast({ title: data.message || "Kategori berhasil disimpan" });
      invalidateMenu();
      closeCategoryDialog();
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal menyimpan kategori",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const categoryStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest("PATCH", `/api/admin/menu/categories/${id}`, { isActive }),
    onSuccess: (_data, { isActive }) => {
      toast({
        title: isActive ? "Kategori diaktifkan" : "Kategori disembunyikan",
        description: isActive
          ? "Kategori dan item aktifnya tampil di halaman menu."
          : "Kategori tidak lagi tampil di halaman menu publik.",
      });
      invalidateMenu();
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal mengubah status kategori",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/menu/categories/${id}`),
    onSuccess: () => {
      toast({ title: "Kategori berhasil dihapus" });
      invalidateMenu();
      setDeleteCategoryId(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal menghapus kategori",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const itemMutation = useMutation({
    mutationFn: async () => {
      if (editingItemId) {
        return apiRequest("PATCH", `/api/admin/menu/items/${editingItemId}`, {
          categoryId: itemForm.categoryId,
          nameId: itemForm.nameId,
          nameEn: itemForm.nameEn,
          descriptionId: itemForm.descriptionId,
          descriptionEn: itemForm.descriptionEn,
          tag: itemForm.tag || undefined,
          isFeatured: itemForm.isFeatured,
          isActive: itemForm.isActive,
          sortOrder: Number(itemForm.sortOrder),
        });
      }

      if (!selectedFile) throw new Error("Foto menu wajib diupload");

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("categoryId", itemForm.categoryId);
      formData.append("nameId", itemForm.nameId);
      formData.append("nameEn", itemForm.nameEn);
      formData.append("descriptionId", itemForm.descriptionId);
      formData.append("descriptionEn", itemForm.descriptionEn);
      if (itemForm.tag) formData.append("tag", itemForm.tag);
      formData.append("isFeatured", String(itemForm.isFeatured));
      formData.append("isActive", String(itemForm.isActive));
      formData.append("sortOrder", itemForm.sortOrder);

      const res = await apiFetch("/api/admin/menu/items", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menambah item");
      }
      return res.json();
    },
    onSuccess: (data: { message?: string }) => {
      toast({ title: data.message || "Item menu berhasil disimpan" });
      invalidateMenu();
      closeItemDialog();
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal menyimpan item",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const itemImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await apiFetch(`/api/admin/menu/items/${id}/image`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal mengganti foto");
      }
      return res.json();
    },
    onSuccess: (data: { item?: MenuItem }) => {
      toast({ title: "Foto menu berhasil diperbarui" });
      if (data.item?.imagePath) setPreviewUrl(data.item.imagePath);
      invalidateMenu();
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal mengganti foto",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const itemStatusMutation = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: { isActive?: boolean; isFeatured?: boolean };
    }) => apiRequest("PATCH", `/api/admin/menu/items/${id}/status`, patch),
    onSuccess: (_data, { patch }) => {
      if (patch.isActive === false) {
        toast({
          title: "Item disembunyikan",
          description: "Item tidak lagi tampil di halaman menu publik.",
        });
      } else if (patch.isActive === true) {
        toast({
          title: "Item diaktifkan",
          description: "Item tampil kembali di halaman menu publik.",
        });
      } else if (patch.isFeatured === true) {
        toast({ title: "Item ditandai unggulan", description: "Item tampil di homepage." });
      } else if (patch.isFeatured === false) {
        toast({ title: "Unggulan dicabut", description: "Item tidak lagi tampil di homepage." });
      } else {
        toast({ title: "Status berhasil diperbarui" });
      }
      invalidateMenu();
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal memperbarui status",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/menu/items/${id}`),
    onSuccess: () => {
      toast({ title: "Item menu berhasil dihapus", description: "Item dihapus permanen dari sistem." });
      invalidateMenu();
      setDeleteItemId(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal menghapus item",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  function closeCategoryDialog() {
    setCategoryDialogOpen(false);
    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
  }

  function openEditCategory(category: MenuCategory) {
    setEditingCategoryId(category.id);
    setCategoryForm({
      nameId: category.nameId,
      nameEn: category.nameEn,
      slug: category.slug,
      sortOrder: String(category.sortOrder),
      isActive: category.isActive,
    });
    setCategoryDialogOpen(true);
  }

  function closeItemDialog() {
    setItemDialogOpen(false);
    setEditingItemId(null);
    setItemForm(emptyItemForm);
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  function openEditItem(item: MenuItemRow) {
    setEditingItemId(item.id);
    setItemForm({
      categoryId: item.categoryId,
      nameId: item.nameId,
      nameEn: item.nameEn,
      descriptionId: item.descriptionId,
      descriptionEn: item.descriptionEn,
      tag: item.tag ?? "",
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      sortOrder: String(item.sortOrder),
    });
    setPreviewUrl(item.imagePath);
    setItemDialogOpen(true);
  }

  function handleFileSelect(file: File | null) {
    setSelectedFile(file);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  return (
    <>
      <Helmet>
        <title>Kelola Menu - Admin Gadang Barubah</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Kelola Menu</h1>
              <p className="text-sm text-muted-foreground">
                Atur kategori, foto, dan deskripsi menu untuk halaman publik
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          <Tabs defaultValue="items">
            <TabsList className="mb-6">
              <TabsTrigger value="items">Item Menu</TabsTrigger>
              <TabsTrigger value="categories">Kategori</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Kelompokkan menu ke dalam kategori (contoh: Menu Andalan, Minuman)
                </p>
                <Button
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryForm(emptyCategoryForm);
                    setCategoryDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kategori
                </Button>
              </div>

              <div className="grid gap-3">
                {categories.map((cat) => (
                  <Card key={cat.id}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{cat.nameId}</span>
                          <Badge variant={cat.isActive ? "default" : "secondary"}>
                            {cat.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          EN: {cat.nameEn} · Slug: {cat.slug} · Urutan: {cat.sortOrder}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            categoryStatusMutation.isPending &&
                            categoryStatusMutation.variables?.id === cat.id
                          }
                          onClick={() =>
                            categoryStatusMutation.mutate({
                              id: cat.id,
                              isActive: !cat.isActive,
                            })
                          }
                        >
                          {cat.isActive ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditCategory(cat)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteCategoryId(cat.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {categories.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Belum ada kategori. Tambahkan kategori terlebih dahulu.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-56">
                    <SelectValue placeholder="Filter kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nameId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    setEditingItemId(null);
                    setItemForm({
                      ...emptyItemForm,
                      categoryId: categories[0]?.id ?? "",
                    });
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setItemDialogOpen(true);
                  }}
                  disabled={categories.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-[8/5] bg-muted relative">
                      <img
                        src={item.imagePath}
                        alt={item.nameId}
                        className="w-full h-full object-cover"
                      />
                      {item.isFeatured && (
                        <Badge className="absolute top-2 left-2 gap-1">
                          <Star className="h-3 w-3" />
                          Unggulan
                        </Badge>
                      )}
                      {!item.isActive && (
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          Nonaktif
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{item.nameId}</CardTitle>
                        {item.tag && <Badge variant="outline">{item.tag}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.categoryNameId}</p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.descriptionId}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditItem(item)}>
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            itemStatusMutation.isPending &&
                            itemStatusMutation.variables?.id === item.id
                          }
                          onClick={() =>
                            itemStatusMutation.mutate({
                              id: item.id,
                              patch: { isFeatured: !item.isFeatured },
                            })
                          }
                        >
                          <Star className="h-3 w-3 mr-1" />
                          {item.isFeatured ? "Batal Unggulan" : "Unggulan"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            itemStatusMutation.isPending &&
                            itemStatusMutation.variables?.id === item.id
                          }
                          onClick={() =>
                            itemStatusMutation.mutate({
                              id: item.id,
                              patch: { isActive: !item.isActive },
                            })
                          }
                        >
                          {item.isActive ? (
                            <PowerOff className="h-3 w-3 mr-1" />
                          ) : (
                            <Power className="h-3 w-3 mr-1" />
                          )}
                          {item.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleteItemMutation.isPending}
                          onClick={() => setDeleteItemId(item.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1 text-destructive" />
                          Hapus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {categories.length === 0
                    ? "Buat kategori terlebih dahulu sebelum menambah item menu."
                    : "Belum ada item menu."}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={categoryDialogOpen} onOpenChange={(open) => !open && closeCategoryDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategoryId ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama (Bahasa Indonesia)</Label>
              <Input
                value={categoryForm.nameId}
                onChange={(e) => {
                  const nameId = e.target.value;
                  setCategoryForm((prev) => ({
                    ...prev,
                    nameId,
                    slug: editingCategoryId ? prev.slug : slugify(nameId),
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Nama (English)</Label>
              <Input
                value={categoryForm.nameEn}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, nameEn: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={categoryForm.slug}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Urutan tampil</Label>
              <Input
                type="number"
                min={0}
                value={categoryForm.sortOrder}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, sortOrder: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cat-active"
                checked={categoryForm.isActive}
                onCheckedChange={(checked) =>
                  setCategoryForm((prev) => ({ ...prev, isActive: checked === true }))
                }
              />
              <Label htmlFor="cat-active">Kategori aktif</Label>
            </div>
            <Button
              className="w-full"
              onClick={handleSaveCategory}
              disabled={categoryMutation.isPending}
            >
              {categoryMutation.isPending ? "Menyimpan..." : "Simpan Kategori"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={itemDialogOpen} onOpenChange={(open) => !open && closeItemDialog()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItemId ? "Edit Item Menu" : "Tambah Item Menu"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={itemForm.categoryId}
                onValueChange={(value) => setItemForm((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nameId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!editingItemId && (
              <div className="space-y-2">
                <Label>Foto Menu</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById("menu-file-input")?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded" />
                  ) : (
                    <div className="text-muted-foreground">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Klik untuk pilih foto (JPEG, PNG, WebP, max 2MB)</p>
                    </div>
                  )}
                </div>
                <input
                  id="menu-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                />
              </div>
            )}

            {editingItemId && (
              <div className="space-y-2">
                <Label>Ganti Foto</Label>
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="max-h-32 rounded mb-2" />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("menu-replace-input")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Foto Baru
                </Button>
                <input
                  id="menu-replace-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && editingItemId) {
                      itemImageMutation.mutate({ id: editingItemId, file });
                    }
                  }}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Nama (ID)</Label>
              <Input
                value={itemForm.nameId}
                onChange={(e) => setItemForm((prev) => ({ ...prev, nameId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nama (EN)</Label>
              <Input
                value={itemForm.nameEn}
                onChange={(e) => setItemForm((prev) => ({ ...prev, nameEn: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi (ID)</Label>
              <Textarea
                value={itemForm.descriptionId}
                onChange={(e) =>
                  setItemForm((prev) => ({ ...prev, descriptionId: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi (EN)</Label>
              <Textarea
                value={itemForm.descriptionEn}
                onChange={(e) =>
                  setItemForm((prev) => ({ ...prev, descriptionEn: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Badge / Tag (opsional)</Label>
              <Input
                placeholder="Contoh: Terlaris, Andalan, Favorit"
                value={itemForm.tag}
                onChange={(e) => setItemForm((prev) => ({ ...prev, tag: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Urutan tampil</Label>
              <Input
                type="number"
                min={0}
                value={itemForm.sortOrder}
                onChange={(e) => setItemForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="item-featured"
                checked={itemForm.isFeatured}
                onCheckedChange={(checked) =>
                  setItemForm((prev) => ({ ...prev, isFeatured: checked === true }))
                }
              />
              <Label htmlFor="item-featured">Tampilkan di homepage (Unggulan)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="item-active"
                checked={itemForm.isActive}
                onCheckedChange={(checked) =>
                  setItemForm((prev) => ({ ...prev, isActive: checked === true }))
                }
              />
              <Label htmlFor="item-active">Item aktif</Label>
            </div>
            <Button
              className="w-full"
              onClick={handleSaveItem}
              disabled={itemMutation.isPending || itemImageMutation.isPending}
            >
              {itemMutation.isPending ? "Menyimpan..." : "Simpan Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori hanya bisa dihapus jika tidak memiliki item menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteCategoryMutation.isPending}
              onClick={() => deleteCategoryId && deleteCategoryMutation.mutate(deleteCategoryId)}
            >
              {deleteCategoryMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus item menu?</AlertDialogTitle>
            <AlertDialogDescription>
              Item dan foto akan dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteItemMutation.isPending}
              onClick={() => deleteItemId && deleteItemMutation.mutate(deleteItemId)}
            >
              {deleteItemMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
