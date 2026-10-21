import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Phone, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import SEOHead from '../SEOHead';
import { renderTemplate, useSiteText } from '@/lib/siteText';

const FEATURES = [
  { n: 1, icon: "⚡" },
  { n: 2, icon: "🔒" },
  { n: 3, icon: "📱" },
] as const;

/** free = label ongkir berwarna hijau */
const DELIVERY_AREAS = [
  { n: 1, free: true },
  { n: 2, free: false },
  { n: 3, free: false },
  { n: 4, free: false },
] as const;

const ORDER_STEPS = [2, 3, 4] as const;

export default function DeliveryPage() {
  const [, navigate] = useLocation();
  const { t } = useSiteText();

  const deliveryAreas = DELIVERY_AREAS.map((area) => ({
    free: area.free,
    area: t(`delivery.areas.${area.n}.name`),
    time: t(`delivery.areas.${area.n}.time`),
    fee: t(`delivery.areas.${area.n}.fee`),
  }));

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <SEOHead pageKey="delivery" />
      
      {/* Top section with back button and logo */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="hover:bg-accent/10 text-muted-foreground hover:text-foreground"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1 text-sm">{t("delivery.back")}</span>
          </Button>
          
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
          
          <div className="w-20"></div>
        </div>
      </div>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
              {t("delivery.hero.title")}
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="whitespace-pre-line text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("delivery.hero.subtitle")}
            </p>
          </div>

          {/* Service Info */}
          <Card className="mb-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                {FEATURES.map((feature) => (
                  <div key={feature.n}>
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold text-foreground mb-1">{t(`delivery.features.${feature.n}.title`)}</h3>
                    <p className="text-sm text-muted-foreground">{t(`delivery.features.${feature.n}.desc`)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Areas */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">{t("delivery.areas.title")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {deliveryAreas.map((area, index) => (
                <Card key={index} className="hover-elevate transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{area.area}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        area.free
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}>
                        {area.fee}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{area.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>{t("delivery.order.title")}</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-sm text-muted-foreground">
                      {renderTemplate(t("delivery.order.1"), {
                        phone: <strong>{t("delivery.order.phone")}</strong>,
                      })}
                    </p>
                  </div>
                  {ORDER_STEPS.map((n) => (
                    <div key={n} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{n}</div>
                      <p className="text-sm text-muted-foreground">{t(`delivery.order.${n}`)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center">
                  <Button size="lg" className="w-full hover-elevate" data-testid="button-order-now">
                    <Phone className="mr-2 h-4 w-4" />
                    {t("delivery.order.button")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
