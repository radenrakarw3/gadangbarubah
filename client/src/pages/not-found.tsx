import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { pageSEOConfigs } from "@/lib/seo";
import { useSiteLanguage } from "@/lib/language";

export default function NotFound() {
  const { lang } = useSiteLanguage();
  const seoConfig = pageSEOConfigs.notFound;
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        <link rel="canonical" href={seoConfig.canonical} />
        <meta name="robots" content="noindex, nofollow" />
        
        <meta property="og:title" content={seoConfig.ogTitle} />
        <meta property="og:description" content={seoConfig.ogDescription} />
        <meta property="og:url" content={seoConfig.ogUrl} />
        <meta property="og:type" content={seoConfig.ogType} />
        <meta property="og:site_name" content={seoConfig.ogSiteName} />
        <meta property="og:image" content="https://gadangbarubahindonesia.id/og-image.jpg" />
        <meta property="og:locale" content="id_ID" />
      </Helmet>
      
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              {lang === "ID" ? "404 Halaman Tidak Ditemukan" : "404 Page Not Found"}
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {lang === "ID"
              ? "Halaman yang Anda cari tidak tersedia atau sudah dipindahkan."
              : "The page you are looking for is unavailable or has been moved."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
