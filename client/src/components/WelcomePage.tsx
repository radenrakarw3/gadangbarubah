import { Suspense, useCallback, useEffect, useState } from "react";
import SEOHead from "./SEOHead";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import HeroSection from "./home/HeroSection";
import SectionSeam from "./home/SectionSeam";
import LazyWhenVisible from "./home/LazyWhenVisible";
import HomeMicroSplash, { useMicroSplash } from "./home/HomeMicroSplash";
import { lazyRetry } from "@/lib/lazyRetry";
import { warmHomePage } from "@/lib/homePreload";

const HomeBelowFold = lazyRetry(() => import("./home/HomeBelowFold"));
const CampaignPopup = lazyRetry(() => import("./CampaignPopup"));

function BelowFoldFallback() {
  return <div className="h-20 animate-pulse bg-white/5" aria-hidden />;
}

function BelowFoldChunk() {
  return (
    <Suspense fallback={<BelowFoldFallback />}>
      <HomeBelowFold />
    </Suspense>
  );
}

export default function WelcomePage() {
  const [showCampaign, setShowCampaign] = useState(false);
  const { visible: splashVisible, exiting: splashExiting, dismiss: dismissSplash } =
    useMicroSplash();

  useEffect(() => {
    warmHomePage();
  }, []);

  useEffect(() => {
    if (splashVisible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [splashVisible]);

  const tryShowCampaign = useCallback(() => {
    setShowCampaign((v) => v || true);
  }, []);

  useEffect(() => {
    if (splashVisible) return;

    let idleTimer: number | undefined;
    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      tryShowCampaign();
    };

    const onScroll = () => {
      if (window.scrollY > 100) {
        show();
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    idleTimer = window.setTimeout(show, 5000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer !== undefined) window.clearTimeout(idleTimer);
    };
  }, [splashVisible, tryShowCampaign]);

  const onHeroImageLoad = useCallback(() => {
    dismissSplash();
  }, [dismissSplash]);

  return (
    <>
      <SEOHead pageKey="home" />

      <HomeMicroSplash visible={splashVisible} exiting={splashExiting} />

      <div className="home-page-root min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] overflow-x-hidden bg-[#300505]">
        <div className="relative">
          <SiteNav variant="transparent" />
          <main className="home-scroll-content">
            <HeroSection onHeroImageLoad={onHeroImageLoad} />

            <LazyWhenVisible
              fallback={<BelowFoldFallback />}
              rootMargin="280px 0px"
            >
              <BelowFoldChunk />
            </LazyWhenVisible>
          </main>
        </div>

        <SectionSeam variant="contact-to-footer" />
        <SiteFooter />

        {showCampaign && (
          <Suspense fallback={null}>
            <CampaignPopup />
          </Suspense>
        )}
      </div>
    </>
  );
}
