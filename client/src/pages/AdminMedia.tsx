import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminImagePreview from "@/components/admin/AdminImagePreview";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { siteMediaQueryKey } from "@/lib/site-media";
import { isEphemeralDiskImagePath } from "@/lib/media-path";
import { useSiteLanguage } from "@/lib/language";
import type { SiteMediaKey } from "@shared/site-media";

type AdminMediaRow = {
  key: SiteMediaKey;
  labelID: string;
  labelEN: string;
  hintID: string;
  hintEN: string;
  imagePath: string | null;
  updatedAt: string | null;
};

export default function AdminMedia() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { lang } = useSiteLanguage();

  const { data, isLoading } = useQuery<{ success: boolean; data: AdminMediaRow[] }>({
    queryKey: ["/api/admin/site-media"],
    queryFn: async () => {
      const res = await apiFetch("/api/admin/site-media");
      if (!res.ok) throw new Error("Gagal memuat aset");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ key, file }: { key: SiteMediaKey; file: File }) => {
      const body = new FormData();
      body.append("image", file);
      const res = await apiFetch(`/api/admin/site-media/${key}`, {
        method: "POST",
        body,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload gagal");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: lang === "ID" ? "Foto diperbarui" : "Photo updated",
        description:
          lang === "ID"
            ? "Perubahan akan muncul di beranda setelah refresh."
            : "Changes appear on the homepage after refresh.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-media"] });
      queryClient.invalidateQueries({ queryKey: siteMediaQueryKey() });
    },
    onError: (error: Error) => {
      toast({
        title: lang === "ID" ? "Upload gagal" : "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rows = data?.data ?? [];

  return (
    <>
      <Helmet>
        <title>Kelola Foto Situs - Admin Gadang Barubah</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl">
          <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 p-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-semibold">
                  {lang === "ID" ? "Ganti Foto Situs" : "Site Photos"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {lang === "ID"
                    ? "Upload foto hero dan cover outlet tanpa mengubah kode"
                    : "Upload hero and outlet covers without code changes"}
                </p>
              </div>
              <AdminLogoutButton />
            </div>
          </div>

          <div className="space-y-4 p-4">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              rows.map((row) => (
                <Card key={row.key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {lang === "ID" ? row.labelID : row.labelEN}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {lang === "ID" ? row.hintID : row.hintEN}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <AdminImagePreview
                      src={row.imagePath}
                      alt={row.labelID}
                      className="aspect-video w-full border sm:max-w-xs"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {isEphemeralDiskImagePath(row.imagePath)
                          ? lang === "ID"
                            ? "Foto lama hilang — upload ulang agar permanen"
                            : "Old photo lost — re-upload to persist"
                          : row.imagePath
                            ? lang === "ID"
                              ? "Sedang memakai foto upload admin"
                              : "Using admin-uploaded photo"
                            : lang === "ID"
                              ? "Belum diganti — memakai foto default di kode"
                              : "Not replaced — using default asset"}
                      </p>
                      <input
                        id={`media-${row.key}`}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadMutation.mutate({ key: row.key, file });
                          e.currentTarget.value = "";
                        }}
                      />
                      <Button
                        type="button"
                        disabled={uploadMutation.isPending}
                        onClick={() => document.getElementById(`media-${row.key}`)?.click()}
                      >
                        {uploadMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        {lang === "ID" ? "Upload foto baru" : "Upload new photo"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
