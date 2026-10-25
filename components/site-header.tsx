"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Home, Menu, Settings, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navItems = pathname === "/"
    ? [{ href: "/labs", label: "TLab" }, { href: "/#about", label: "About TattvaLab" }]
    : [{ href: "/labs", label: "TLab" }, { href: "/progress", label: "My progress" }];
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <BrandMark />
        <button className="mobile-menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`site-nav ${open ? "site-nav--open" : ""}`} aria-label="Main navigation">
          <Link className="site-nav__icon-link" href="/" aria-label="Home" title="Home" onClick={() => setOpen(false)} aria-current={pathname === "/" ? "page" : undefined}>
            <Home size={19} aria-hidden="true" />
          </Link>
          {navItems.map((item) => {
            const route = item.href.split("#")[0];
            return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname === route || pathname.startsWith(`${route}/`) ? "page" : undefined}>
              {item.label}
            </Link>;
          })}
          <Link className="site-nav__settings" href="/settings" onClick={() => setOpen(false)} aria-current={pathname === "/settings" ? "page" : undefined}>
            <Settings size={17} aria-hidden="true" /> Settings
          </Link>
          <Link className="button button--small button--primary site-nav__cta" href="/labs" onClick={() => setOpen(false)}>
            Enter TattvaLab <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
