import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CATERING_TYPES, COMPANY } from "@/lib/siteContent";
import cateringImage from "@assets/DSC07153_1758564588952.jpg";

export default function CateringInquirySection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    email: "",
    tipe: CATERING_TYPES[0].value as string,
    pax: "50",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || form.telepon.length < 10) {
      toast({
        title: "Data belum lengkap",
        description: "Isi nama dan nomor telepon.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const tipeLabel = CATERING_TYPES.find((t) => t.value === form.tipe)?.label ?? form.tipe;
    const message = encodeURIComponent(
      `Halo Gadang Barubah, saya ingin konsultasi catering:\n\nNama: ${form.nama}\nTelepon: ${form.telepon}\nEmail: ${form.email || "-"}\nTipe: ${tipeLabel}\nPax: ${form.pax}`,
    );
    window.open(`https://wa.me/${COMPANY.whatsapp}?text=${message}`, "_blank");
    toast({ title: "Membuka WhatsApp", description: "Lanjutkan pesan catering di WhatsApp." });
    setLoading(false);
  };

  return (
    <section className="py-16 sm:py-20 bg-primary text-primary-foreground scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-wide text-cream">
            Plan Your Catering With Us
          </h2>
          <div className="w-16 h-px bg-gold/60 mx-auto mt-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-maroon-deep/40 border border-gold/20 p-6 sm:p-8"
          >
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cream/70 mb-1.5 block">
                Name
              </label>
              <Input
                placeholder="Nama lengkap"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="rounded-none border-gold/20 bg-maroon-deep/30 text-cream placeholder:text-cream/40 h-11"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cream/70 mb-1.5 block">
                No. Telepon
              </label>
              <Input
                placeholder="08xxxxxxxxxx"
                value={form.telepon}
                onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                className="rounded-none border-gold/20 bg-maroon-deep/30 text-cream placeholder:text-cream/40 h-11"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cream/70 mb-1.5 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-none border-gold/20 bg-maroon-deep/30 text-cream placeholder:text-cream/40 h-11"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cream/70 mb-1.5 block">
                Tipe
              </label>
              <Select value={form.tipe} onValueChange={(v) => setForm({ ...form, tipe: v })}>
                <SelectTrigger className="rounded-none border-gold/20 bg-maroon-deep/30 text-cream h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATERING_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cream/70 mb-1.5 block">
                Pax
              </label>
              <Input
                type="number"
                min={10}
                value={form.pax}
                onChange={(e) => setForm({ ...form, pax: e.target.value })}
                className="rounded-none border-gold/20 bg-maroon-deep/30 text-cream placeholder:text-cream/40 h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-none bg-gold text-maroon-deep hover:bg-gold-light uppercase tracking-[0.12em] text-xs font-semibold h-11 mt-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reserve"}
            </Button>
          </form>

          <div className="relative home-img-wrap border border-gold/20 min-h-[320px]">
            <img
              src={cateringImage}
              alt="Layanan catering Gadang Barubah"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
