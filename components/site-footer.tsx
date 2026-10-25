import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__main">
        <div className="site-footer__brand">
          <BrandMark />
          <p>Understand. Explore. Discover.</p>
          <span>TattvaLab · Virtual learning, made clear.</span>
        </div>
        <div className="site-footer__links">
          <div><span className="footer-label">TattvaLab</span><Link href="/#about">About TattvaLab</Link></div>
          <div><span className="footer-label">Virtual lab</span><Link href="/labs">Explore the virtual lab</Link></div>
        </div>
        <Link className="footer-top-link" href="/labs">Enter TattvaLab <ArrowUpRight size={15} /></Link>
      </div>
      <div className="container site-footer__bottom">
        <span>© TattvaLab</span>
        <span>An independent space for virtual learning.</span>
      </div>
    </footer>
  );
}
