import { Helmet } from "react-helmet-async";
import { ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminShell from "@/components/admin/AdminShell";
const INBOX_LINKS = [
  {
    id: "info",
    label: "Email resmi",
    address: "info@gadangbarubahindonesia.id",
    description: "Kotak utama perusahaan — buka di klien email default.",
  },
] as const;

export default function AdminEmails() {
  return (
    <>
      <Helmet>
        <title>Portal Email Admin - Gadang Barubah</title>
      </Helmet>

      <AdminShell
        title="Portal Email"
        subtitle="Buka & kelola email operasional"
        backHref="/admin"
        showLogout
        maxWidth="lg"
      >
        <div className="space-y-4 p-4 lg:p-6">
          <p className="text-sm text-muted-foreground">
            Portal untuk akses cepat ke email Gadang Barubah. Integrasi inbox terpusat dapat
            ditambahkan pada fase berikutnya.
          </p>

          {INBOX_LINKS.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-mono text-sm">{item.address}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <Button className="gap-2" asChild>
                  <a href={`mailto:${item.address}`}>
                    Buka Email
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminShell>
    </>
  );
}
