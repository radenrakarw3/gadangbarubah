import { ReactNode } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

interface PublicPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PublicPageLayout({
  children,
  className = "",
}: PublicPageLayoutProps) {
  return (
    <div className={`min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background flex flex-col ${className}`}>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
