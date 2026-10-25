import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SettingsControls } from "@/components/settings-controls";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <main id="main-content" className="settings-page">
      <div className="container">
        <div className="breadcrumbs"><Link href="/"><ArrowLeft size={14} /> Home</Link><span>/</span><span>Settings</span></div>
        <header className="settings-page__heading">
          <span className="eyebrow">TATTVA LAB · TLAB</span>
          <h1>Settings<span>.</span></h1>
          <p>Adjust the way TattvaLab looks and moves in this browser.</p>
        </header>
        <SettingsControls />
      </div>
    </main>
  );
}
