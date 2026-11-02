import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { contactByKey } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";

const OPEN_ROLES = [
  {
    id: "foh",
    titleID: "Crew Front of House",
    titleEN: "Front of House Crew",
    locID: "Cikarang / Bintaro",
    locEN: "Cikarang / Bintaro",
    descID:
      "Melayani tamu di area dining, menjaga standar keramahan Gadang Barubah, dan mendukung operasional harian outlet.",
    descEN:
      "Serve guests on the dining floor, uphold Gadang Barubah hospitality standards, and support daily outlet operations.",
  },
  {
    id: "kitchen",
    titleID: "Cook / Kitchen Staff",
    titleEN: "Cook / Kitchen Staff",
    locID: "Cikarang / Bintaro",
    locEN: "Cikarang / Bintaro",
    descID:
      "Menyiapkan hidangan Padang sesuai standar resep, menjaga kebersihan dapur, dan bekerja dalam tim produksi.",
    descEN:
      "Prepare Padang dishes to recipe standards, maintain kitchen hygiene, and collaborate with the production team.",
  },
  {
    id: "pic",
    titleID: "PIC Operasional Outlet",
    titleEN: "Outlet Operations PIC",
    locID: "Sesuai penempatan",
    locEN: "Based on placement",
    descID:
      "Mengawasi alur reservasi, koordinasi shift, dan menjaga kualitas layanan di cabang yang ditugaskan.",
    descEN:
      "Oversee reservation flow, shift coordination, and service quality at the assigned branch.",
  },
] as const;

export default function CareerPage() {
  const { lang } = useSiteLanguage();
  const pr = contactByKey("pr");
  const applyHref = `https://wa.me/${pr.whatsapp}?text=${encodeURIComponent(
    lang === "ID"
      ? "Halo Tim PR Gadang Barubah, saya ingin melamar / bertanya tentang lowongan."
      : "Hello GB PR team, I'd like to apply / ask about open roles.",
  )}`;

  return (
    <PublicPageLayout>
      <SEOHead pageKey="career" />
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-10">
          <section className="text-center">
            <h1 className="mb-4 font-serif text-3xl font-medium text-primary sm:text-4xl">
              {lang === "ID" ? "Karir" : "Careers"}
            </h1>
            <div className="mx-auto mb-6 h-px w-24 bg-primary" />
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {lang === "ID"
                ? "Bergabunglah dengan tim Gadang Barubah — membangun pengalaman kuliner Padang yang modern dan autentik di setiap outlet."
                : "Join the Gadang Barubah team — building a modern yet authentic Padang dining experience at every outlet."}
            </p>
          </section>

          <section className="space-y-4">
            {OPEN_ROLES.map((role) => (
              <article
                key={role.id}
                className="rounded-xl border border-border/40 bg-card px-5 py-5"
              >
                <h2 className="font-serif text-xl font-medium text-foreground">
                  {lang === "ID" ? role.titleID : role.titleEN}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lang === "ID" ? role.locID : role.locEN}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {lang === "ID" ? role.descID : role.descEN}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-6 text-center">
            <p className="mb-2 text-sm text-muted-foreground">
              {lang === "ID"
                ? "Kirim lamaran atau tanyakan lowongan ke Public Relation"
                : "Send applications or ask about openings via Public Relation"}
            </p>
            <p className="mb-4 font-medium">
              {pr.name} — {pr.display}
            </p>
            <Button asChild size="lg">
              <a href={applyHref} target="_blank" rel="noopener noreferrer">
                {lang === "ID" ? "Lamar via WhatsApp" : "Apply via WhatsApp"}
              </a>
            </Button>
          </section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
