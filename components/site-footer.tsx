import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__main">
        <div className="site-footer__brand">
          <BrandMark />
          <p>Understand. Experiment. Discover.</p>
          <span>Digital Electronics, explained clearly.</span>
        </div>
        <div className="site-footer__links">
          <div><span className="footer-label">Explore</span><Link href="/labs">All experiments</Link><Link href="/progress">My progress</Link></div>
          <div><span className="footer-label">Subject</span><Link href="/labs/digital-electronics">Digital Electronics</Link></div>
        </div>
        <Link className="footer-top-link" href="/labs">Find your next experiment <ArrowUpRight size={15} /></Link>
      </div>
      <div className="container site-footer__bottom">
        <span>© TattvaLab</span>
        <span>Independent learning resource. Not an official university record or endorsement.</span>
      </div>
    </footer>
  );
}
