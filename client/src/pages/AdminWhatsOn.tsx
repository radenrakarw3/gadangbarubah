import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Upload,
  ImageIcon,
  Power,
  PowerOff,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest, parseApiError } from "@/lib/queryClient";
import { whatsOnListQueryKey } from "@/lib/whats-on";
import { apiFetch } from "@/lib/api";
import type { WhatsOnArticle } from "@shared/schema";

const emptyForm = {
  slug: "",
  titleId: "",
  titleEn: "",
  excerptId: "",
  excerptEn: "",
  contentId: "",
  contentEn: "",
  categoryId: "",
  categoryEn: "",
  publishedAt: format(new Date(), "yyyy-MM-dd"),
  isPublished: true,
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

function validateForm(form: typeof emptyForm): string | null {
  if (!form.titleId.trim()) return "Judul (ID) wajib diisi";
  if (!form.titleEn.trim()) return "Judul (EN) wajib diisi";
  if (!form.slug.trim()) return "Slug URL wajib diisi";
  if (!/^[a-z0-9-]+$/.test(form.slug)) {
    return "Slug hanya huruf kecil, angka, dan strip";
  }
  if (!form.categoryId.trim()) return "Kategori (ID) wajib diisi";
  if (!form.categoryEn.trim()) return "Kategori (EN) wajib diisi";
  if (!form.excerptId.trim()) return "Ringkasan (ID) wajib diisi";
  if (!form.excerptEn.trim()) return "Ringkasan (EN) wajib diisi";
  if (!form.contentId.trim()) return "Konten (ID) wajib diisi";
  if (!form.contentEn.trim()) return "Konten (EN) wajib diisi";
  if (!form.publishedAt) return "Tanggal publikasi wajib diisi";
  return null;
}

function articleToForm(article: WhatsOnArticle) {
  return {
    slug: article.slug,
    titleId: article.titleId,
    titleEn: article.titleEn,
    excerptId: article.excerptId,
    excerptEn: article.excerptEn,
    contentId: article.contentId,
    contentEn: article.contentEn,
    categoryId: article.categoryId,
    categoryEn: article.categoryEn,
    publishedAt: article.publishedAt,
    isPublished: article.isPublished,
    sortOrder: String(article.sortOrder),
  };
}

export default function AdminWhatsOn() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WhatsOnArticle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WhatsOnArticle | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const { data, isLoading } = useQuery<{ success: boolean; articles: WhatsOnArticle[] }>({
    queryKey: ["/api/admin/whats-on/articles"],
  });

  const articles = data?.articles ?? [];

  const sortedArticles = useMemo(
    () =>
      [...articles].sort((a, b) => {
        if (a.publishedAt === b.publishedAt) return a.sortOrder - b.sortOrder;
        return a.publishedAt < b.publishedAt ? 1 : -1;
      }),
    [articles],
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/whats-on/articles"] });
    queryClient.invalidateQueries({ queryKey: whatsOnListQueryKey() });
    queryClient.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) &&
        String(query.queryKey[0]).startsWith("/api/whats-on/articles/"),
    });
  };

  const handleSave = () => {
    const error = validateForm(form);
    if (error) {
      toast({ title: "Form belum lengkap", description: error, variant: "destructive" });
      return;
    }
    saveMutation.mutate();
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setSlugTouched(false);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        await apiRequest("PATCH", `/api/admin/whats-on/articles/${editing.id}`, {
          ...form,
          sortOrder: Number(form.sortOrder) || 0,
        });
        if (imageFile) {
          const fd = new FormData();
          fd.append("image", imageFile);
          const res = await apiFetch(`/api/admin/whats-on/articles/${editing.id}/image`, {
            method: "PATCH",
            body: fd,
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Gagal upload foto");
          }
        }
        return;
      }

      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "isPublished") {
          fd.append(key, String(value));
        } else {
          fd.append(key, String(value));
        }
      });
      if (imageFile) fd.append("image", imageFile);

      const res = await apiFetch("/api/admin/whats-on/articles", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menyimpan artikel");
      }
    },
    onSuccess: () => {
      toast({
        title: editing ? "Artikel diperbarui" : "Artikel ditambahkan",
        description: "Perubahan sudah tersimpan.",
      });
      closeDialog();
      invalidate();
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal menyimpan artikel",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      apiRequest("PATCH", `/api/admin/whats-on/articles/${id}/publish`, { isPublished }),
    onSuccess: (_data, { isPublished }) => {
      toast({
        title: isPublished ? "Artikel dipublikasikan" : "Artikel disembunyikan",
        description: isPublished
          ? "Artikel sekarang tampil di halaman What's On."
          : "Artikel tidak lagi tampil untuk pengunjung.",
      });
      invalidate();
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal mengubah status",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/whats-on/articles/${id}`),
    onSuccess: () => {
      toast({ title: "Artikel dihapus", description: "Artikel telah dihapus permanen." });
      setDeleteTarget(null);
      invalidate();
    },
    onError: (error: unknown) => {
      toast({
        title: "Gagal menghapus artikel",
        description: parseApiError(error),
        variant: "destructive",
      });
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setSlugTouched(false);
    setDialogOpen(true);
  };

  const openEdit = (article: WhatsOnArticle) => {
    setEditing(article);
    setForm(articleToForm(article));
    setImageFile(null);
    setSlugTouched(true);
    setDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Kelola What's On - Admin Gadang Barubah</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-background">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Kelola What's On</h1>
                <p className="text-sm text-muted-foreground">
                  Tambah, edit, dan hapus artikel Kabar Terkini
                </p>
              </div>
            </div>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Artikel Baru
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-4 p-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat artikel...</p>
          ) : sortedArticles.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Belum ada artikel. Klik &quot;Artikel Baru&quot; untuk mulai.
              </CardContent>
            </Card>
          ) : (
            sortedArticles.map((article) => (
              <Card key={article.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant={article.isPublished ? "default" : "secondary"}>
                        {article.isPublished ? "Publik" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{article.categoryId}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(`${article.publishedAt}T00:00:00`), "d MMMM yyyy", {
                          locale: idLocale,
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{article.titleId}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {article.excerptId}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">/{article.slug}</p>
                  </div>
                  {article.imagePath ? (
                    <img
                      src={article.imagePath}
                      alt=""
                      className="h-20 w-28 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-28 items-center justify-center rounded-md bg-muted">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(article)}>
                    <Pencil className="mr-1.5 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      publishMutation.isPending &&
                      publishMutation.variables?.id === article.id
                    }
                    onClick={() =>
                      publishMutation.mutate({
                        id: article.id,
                        isPublished: !article.isPublished,
                      })
                    }
                  >
                    {article.isPublished ? (
                      <>
                        <PowerOff className="mr-1.5 h-4 w-4" />
                        Sembunyikan
                      </>
                    ) : (
                      <>
                        <Power className="mr-1.5 h-4 w-4" />
                        Publikasikan
                      </>
                    )}
                  </Button>
                  {article.isPublished ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/whats-on/${article.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-1.5 h-4 w-4" />
                        Lihat
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      title="Publikasikan dulu untuk melihat di halaman publik"
                    >
                      <ExternalLink className="mr-1.5 h-4 w-4" />
                      Lihat
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => setDeleteTarget(article)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Hapus
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </main>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
          else setDialogOpen(true);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Artikel" : "Artikel Baru"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="titleId">Judul (ID)</Label>
                <Input
                  id="titleId"
                  value={form.titleId}
                  onChange={(e) => {
                    const titleId = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      titleId,
                      slug: slugTouched ? prev.slug : slugify(titleId),
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEn">Judul (EN)</Label>
                <Input
                  id="titleEn"
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug URL</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: slugify(e.target.value) });
                }}
                placeholder="contoh: promo-natal-2026"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori (ID)</Label>
                <Input
                  id="categoryId"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryEn">Kategori (EN)</Label>
                <Input
                  id="categoryEn"
                  value={form.categoryEn}
                  onChange={(e) => setForm({ ...form, categoryEn: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="excerptId">Ringkasan (ID)</Label>
                <Textarea
                  id="excerptId"
                  rows={3}
                  value={form.excerptId}
                  onChange={(e) => setForm({ ...form, excerptId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerptEn">Ringkasan (EN)</Label>
                <Textarea
                  id="excerptEn"
                  rows={3}
                  value={form.excerptEn}
                  onChange={(e) => setForm({ ...form, excerptEn: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contentId">Konten (ID)</Label>
                <Textarea
                  id="contentId"
                  rows={8}
                  value={form.contentId}
                  onChange={(e) => setForm({ ...form, contentId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contentEn">Konten (EN)</Label>
                <Textarea
                  id="contentEn"
                  rows={8}
                  value={form.contentEn}
                  onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Tanggal Publikasi</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Urutan</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.isPublished}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, isPublished: checked === true })
                    }
                  />
                  Publikasikan
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Foto Artikel (opsional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              {editing?.imagePath && !imageFile ? (
                <img
                  src={editing.imagePath}
                  alt=""
                  className="mt-2 h-32 w-full max-w-xs rounded-md object-cover"
                />
              ) : null}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDialog} disabled={saveMutation.isPending}>
                Batal
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                <Upload className="mr-2 h-4 w-4" />
                {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus artikel?</AlertDialogTitle>
            <AlertDialogDescription>
              Artikel &quot;{deleteTarget?.titleId}&quot; akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
