import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ExternalLink, Loader2, RotateCcw, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ADMIN_SITE_TEXTS_QUERY_KEY, SITE_TEXTS_QUERY_KEY } from "@/lib/siteText";
import {
  SITE_TEXTS,
  SITE_TEXT_PAGES,
  missingSiteTextPlaceholders,
  siteTextMaxLength,
  siteTextPlaceholders,
  type SiteTextDef,
  type SiteTextPage,
} from "@shared/site-text-registry";

type AdminSiteText = {
  key: string;
  valueId: string;
  valueEn: string;
  updatedAt: string;
};

type AdminSiteTextsResponse = { success: boolean; texts: AdminSiteText[] };
type Draft = { valueId: string; valueEn: string };

const normalizeText = (value: string) => value.replace(/\r\n?/g, "\n").trim();

function savedValue(def: SiteTextDef, override?: AdminSiteText): Draft {
  return override
    ? { valueId: override.valueId, valueEn: override.valueEn }
    : { valueId: def.id, valueEn: def.en };
}

function isDirty(def: SiteTextDef, draft: Draft | undefined, override?: AdminSiteText) {
  if (!draft) return false;
  const saved = savedValue(def, override);
  return (
    normalizeText(draft.valueId) !== normalizeText(saved.valueId) ||
    normalizeText(draft.valueEn) !== normalizeText(saved.valueEn)
  );
}

function validateValue(def: SiteTextDef, lang: "ID" | "EN", value: string): string | null {
  const maxLength = siteTextMaxLength(def);
  if (!value.trim()) return "Wajib diisi";
  if (value.length > maxLength) return `Maksimal ${maxLength} karakter`;
  if (!def.multiline && !def.list && /\n/.test(value)) return "Teks ini harus satu baris";
  const missing = missingSiteTextPlaceholders(lang === "ID" ? def.id : def.en, value);
  if (missing.length > 0) return `Kode ${missing.join(", ")} terhapus — tambahkan kembali`;
  return null;
}

function isDraftValid(def: SiteTextDef, draft: Draft) {
  return !validateValue(def, "ID", draft.valueId) && !validateValue(def, "EN", draft.valueEn);
}

function describeError(err: unknown) {
  const status = err instanceof Error ? Number(err.message.split(":")[0]) : NaN;
  if (status === 401 || status === 403) {
    return {
      title: "Sesi login berakhir",
      description: "Silakan login ulang di tab baru, lalu klik Simpan lagi. Teks yang Anda ketik masih ada di halaman ini.",
      conflict: false,
    };
  }
  if (status === 409) {
    return { title: "Teks diubah admin lain", description: parseApiError(err), conflict: true };
  }
  return { title: "Gagal menyimpan", description: parseApiError(err), conflict: false };
}

function groupBySection(defs: SiteTextDef[]) {
  const groups = new Map<string, SiteTextDef[]>();
  for (const def of defs) {
    const list = groups.get(def.section) ?? [];
    list.push(def);
    groups.set(def.section, list);
  }
  return Array.from(groups.entries());
}

function upsertCache(row: AdminSiteText) {
  queryClient.setQueryData<AdminSiteTextsResponse>(ADMIN_SITE_TEXTS_QUERY_KEY, (prev) => {
    const texts = (prev?.texts ?? []).filter((t) => t.key !== row.key);
    return { success: true, texts: [...texts, row] };
  });
}

function removeFromCache(key: string) {
  queryClient.setQueryData<AdminSiteTextsResponse>(ADMIN_SITE_TEXTS_QUERY_KEY, (prev) => ({
    success: true,
    texts: (prev?.texts ?? []).filter((t) => t.key !== key),
  }));
}

function SiteTextField({
  def,
  override,
  draft,
  saving,
  onChange,
  onSave,
  onReset,
}: {
  def: SiteTextDef;
  override?: AdminSiteText;
  draft?: Draft;
  saving: boolean;
  onChange: (draft: Draft) => void;
  onSave: () => void;
  onReset: () => void;
}) {
  const current = draft ?? savedValue(def, override);
  const dirty = isDirty(def, draft, override);
  const maxLength = siteTextMaxLength(def);
  const multiline = def.multiline || def.list;
  const fieldId = `site-text-${def.key}`;

  const renderInput = (lang: "ID" | "EN") => {
    const field = lang === "ID" ? "valueId" : "valueEn";
    const value = current[field];
    const error = dirty ? validateValue(def, lang, value) : null;
    const codes = siteTextPlaceholders(lang === "ID" ? def.id : def.en);
    const common = {
      id: `${fieldId}-${lang}`,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChange({ ...current, [field]: e.target.value }),
      className: error ? "border-destructive" : undefined,
      "aria-invalid": error ? true : undefined,
    };
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={common.id} className="text-xs font-medium text-muted-foreground">
            {lang === "ID" ? "Bahasa Indonesia" : "English"}
          </Label>
          <span className={`text-[11px] ${value.length > maxLength ? "text-destructive" : "text-muted-foreground"}`}>
            {value.length}/{maxLength}
          </span>
        </div>
        {multiline ? (
          <Textarea {...common} rows={Math.min(12, Math.max(3, value.split("\n").length + 1))} />
        ) : (
          <Input {...common} />
        )}
        {error ? (
          <p className="text-[11px] font-medium text-destructive">{error}</p>
        ) : codes.length > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            Kode {codes.join(", ")} diganti otomatis di website — jangan dihapus.
          </p>
        ) : null}
      </div>
    );
  };

  const hasInvalid = !isDraftValid(def, current);

  return (
    <div className="space-y-3 rounded-lg border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium">{def.label}</p>
          <p className="text-[11px] text-muted-foreground">
            {def.list ? "Satu item per baris · " : ""}
            {override
              ? `Terakhir diubah ${format(new Date(override.updatedAt), "d MMM yyyy, HH:mm", { locale: idLocale })}`
              : "Masih memakai teks bawaan"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dirty ? <Badge className="bg-amber-500 hover:bg-amber-500">Belum disimpan</Badge> : null}
          <Badge variant={override ? "default" : "secondary"}>{override ? "Diubah" : "Default"}</Badge>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {renderInput("ID")}
        {renderInput("EN")}
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {override ? (
          <Button variant="ghost" size="sm" onClick={onReset} disabled={saving}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Kembalikan default
          </Button>
        ) : null}
        {dirty ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(savedValue(def, override))}
            disabled={saving}
          >
            Batal
          </Button>
        ) : null}
        <Button size="sm" onClick={onSave} disabled={!dirty || hasInvalid || saving}>
          {saving ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-3.5 w-3.5" />
          )}
          Simpan
        </Button>
      </div>
    </div>
  );
}

export default function AdminSiteTexts() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState<SiteTextPage>("global");
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const [resetTarget, setResetTarget] = useState<SiteTextDef | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [savingAll, setSavingAll] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<AdminSiteTextsResponse>({
    queryKey: ADMIN_SITE_TEXTS_QUERY_KEY,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const overrides = useMemo(
    () => new Map((data?.texts ?? []).map((row) => [row.key, row])),
    [data],
  );

  const dirtyKeys = useMemo(
    () =>
      SITE_TEXTS.filter((def) => isDirty(def, drafts[def.key], overrides.get(def.key))).map(
        (def) => def.key,
      ),
    [drafts, overrides],
  );

  useEffect(() => {
    if (dirtyKeys.length === 0) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirtyKeys.length]);

  const pages = useMemo(
    () => SITE_TEXT_PAGES.filter((page) => SITE_TEXTS.some((def) => def.page === page.id)),
    [],
  );

  const query = search.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!query) return [];
    return SITE_TEXTS.filter((def) => {
      const override = overrides.get(def.key);
      const haystack = [
        def.label,
        def.section,
        def.id,
        def.en,
        override?.valueId ?? "",
        override?.valueEn ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [query, overrides]);

  const setSaving = (key: string, saving: boolean) =>
    setSavingKeys((prev) => {
      const next = new Set(prev);
      if (saving) next.add(key);
      else next.delete(key);
      return next;
    });

  const clearDraft = (key: string) =>
    setDrafts((prev) => {
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });

  const saveText = async (def: SiteTextDef, options: { silent?: boolean } = {}) => {
    const draft = drafts[def.key];
    if (!draft) return true;
    const override = overrides.get(def.key);
    const sent = { valueId: normalizeText(draft.valueId), valueEn: normalizeText(draft.valueEn) };

    setSaving(def.key, true);
    try {
      const res = await apiRequest("PUT", `/api/admin/site-texts/${encodeURIComponent(def.key)}`, {
        ...sent,
        expectedUpdatedAt: override?.updatedAt ?? null,
      });
      const body: { success: boolean; text: AdminSiteText } = await res.json();
      const stored = body.text;
      if (!stored || stored.valueId !== sent.valueId || stored.valueEn !== sent.valueEn) {
        throw new Error("Teks yang tersimpan di database tidak sama dengan yang dikirim. Coba simpan ulang.");
      }

      upsertCache(stored);
      clearDraft(def.key);
      await queryClient.invalidateQueries({ queryKey: SITE_TEXTS_QUERY_KEY });
      if (!options.silent) {
        toast({ title: "Teks tersimpan", description: `${def.label} sudah tampil di website.` });
      }
      return true;
    } catch (err) {
      const { title, description, conflict } = describeError(err);
      toast({ title, description: `${def.label}: ${description}`, variant: "destructive" });
      if (conflict) void refetch();
      return false;
    } finally {
      setSaving(def.key, false);
    }
  };

  const saveAll = async () => {
    const toSave = SITE_TEXTS.filter((d) => dirtyKeys.includes(d.key));
    const valid = toSave.filter((d) => isDraftValid(d, drafts[d.key]));
    const skipped = toSave.length - valid.length;
    setSavingAll(true);
    let saved = 0;
    for (const def of valid) {
      if (!(await saveText(def, { silent: true }))) break;
      saved += 1;
    }
    setSavingAll(false);
    if (skipped > 0) {
      toast({
        title: saved > 0 ? `${saved} teks tersimpan, ${skipped} belum` : `${skipped} teks belum disimpan`,
        description: "Perbaiki kolom yang bertanda merah, lalu simpan lagi.",
        variant: "destructive",
      });
    } else if (saved > 0) {
      toast({ title: "Teks tersimpan", description: `${saved} teks berhasil disimpan dan sudah tampil di website.` });
    }
  };

  const latestSaveAll = useRef(saveAll);
  latestSaveAll.current = saveAll;
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void latestSaveAll.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const confirmReset = async () => {
    const def = resetTarget;
    setResetOpen(false);
    if (!def) return;
    setSaving(def.key, true);
    try {
      await apiRequest("DELETE", `/api/admin/site-texts/${encodeURIComponent(def.key)}`);
      removeFromCache(def.key);
      clearDraft(def.key);
      await queryClient.invalidateQueries({ queryKey: SITE_TEXTS_QUERY_KEY });
      toast({ title: "Dikembalikan ke default", description: def.label });
    } catch (err) {
      const { title, description } = describeError(err);
      toast({ title: title === "Gagal menyimpan" ? "Gagal mengembalikan teks" : title, description, variant: "destructive" });
    } finally {
      setSaving(def.key, false);
    }
  };

  const handleBack = () => {
    if (
      dirtyKeys.length > 0 &&
      !window.confirm("Ada perubahan yang belum disimpan. Tetap keluar?")
    ) {
      return;
    }
    navigate("/admin");
  };

  const renderFields = (defs: SiteTextDef[]) =>
    groupBySection(defs).map(([section, items]) => (
      <Card key={section}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{section}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((def) => (
            <SiteTextField
              key={def.key}
              def={def}
              override={overrides.get(def.key)}
              draft={drafts[def.key]}
              saving={savingKeys.has(def.key) || savingAll}
              onChange={(draft) => setDrafts((prev) => ({ ...prev, [def.key]: draft }))}
              onSave={() => void saveText(def)}
              onReset={() => {
                setResetTarget(def);
                setResetOpen(true);
              }}
            />
          ))}
        </CardContent>
      </Card>
    ));

  const pageLabel = (id: SiteTextPage) => SITE_TEXT_PAGES.find((p) => p.id === id)?.label ?? id;

  return (
    <>
      <Helmet>
        <title>Kelola Teks Website - Admin Gadang Barubah</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Kembali">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Kelola Teks Website</h1>
                <p className="text-sm text-muted-foreground">
                  Ubah teks Bahasa Indonesia &amp; English di halaman publik
                </p>
              </div>
            </div>
            <Button onClick={() => void saveAll()} disabled={dirtyKeys.length === 0 || savingAll}>
              {savingAll ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan semua{dirtyKeys.length > 0 ? ` (${dirtyKeys.length})` : ""}
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-4 p-4">
          <p className="rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground">
            Pilih halaman, ubah teks Bahasa Indonesia dan English, lalu klik <strong>Simpan</strong>.
            Perubahan langsung tampil di website. Salah ubah? Klik <strong>Kembalikan default</strong>.
            <span className="hidden sm:inline"> Pintasan: Ctrl/⌘ + S untuk menyimpan semua.</span>
          </p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari teks di semua halaman…"
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat teks…</p>
          ) : isError ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <p className="text-muted-foreground">Gagal memuat teks dari database.</p>
                <Button variant="outline" onClick={() => void refetch()}>
                  Coba lagi
                </Button>
              </CardContent>
            </Card>
          ) : query ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {searchResults.length} teks cocok dengan &quot;{search.trim()}&quot;
              </p>
              {Array.from(new Set(searchResults.map((d) => d.page))).map((page) => (
                <div key={page} className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {pageLabel(page)}
                  </h2>
                  {renderFields(searchResults.filter((d) => d.page === page))}
                </div>
              ))}
            </div>
          ) : (
            <Tabs value={activePage} onValueChange={(v) => setActivePage(v as SiteTextPage)}>
              <TabsList className="flex h-auto flex-wrap justify-start gap-1">
                {pages.map((page) => {
                  const dirtyInPage = SITE_TEXTS.filter(
                    (d) => d.page === page.id && dirtyKeys.includes(d.key),
                  ).length;
                  return (
                    <TabsTrigger key={page.id} value={page.id}>
                      {page.label}
                      {dirtyInPage > 0 ? (
                        <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 text-[10px] text-white">
                          {dirtyInPage}
                        </span>
                      ) : null}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {pages.map((page) => (
                <TabsContent key={page.id} value={page.id} className="space-y-4">
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href={page.path} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Lihat di website
                      </a>
                    </Button>
                  </div>
                  {renderFields(SITE_TEXTS.filter((d) => d.page === page.id))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </main>
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kembalikan ke teks bawaan?</AlertDialogTitle>
            <AlertDialogDescription>
              Teks &quot;{resetTarget?.label}&quot; akan kembali ke versi awal (ID &amp; EN). Perubahan
              yang tersimpan akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmReset()}>Kembalikan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
