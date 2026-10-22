import type { Metadata } from "next";
import "@fontsource/metropolis/400.css";
import "@fontsource/metropolis/500.css";
import "@fontsource/metropolis/600.css";
import "@fontsource/metropolis/700.css";
import "@fontsource/zilla-slab/400.css";
import "@fontsource/zilla-slab/500.css";
import "@fontsource/zilla-slab/400-italic.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TattvaLab — Digital Electronics Labs", template: "%s · TattvaLab" },
  description: "Learn digital electronics through simple explanations, diagrams, examples and practice questions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a href="#main-content" className="skip-link">Skip to content</a><SiteHeader />{children}<SiteFooter /></body></html>;
}
