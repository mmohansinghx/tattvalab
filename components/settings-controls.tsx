"use client";

import { useEffect, useState } from "react";
import { Check, Contrast, RotateCcw, Settings2 } from "lucide-react";

const motionKey = "tattvalab.reduceMotion";

export function SettingsControls() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const savedValue = localStorage.getItem(motionKey) === "true";
    setReduceMotion(savedValue);
    document.documentElement.dataset.reduceMotion = String(savedValue);
  }, []);

  function toggleMotion() {
    const nextValue = !reduceMotion;
    setReduceMotion(nextValue);
    localStorage.setItem(motionKey, String(nextValue));
    document.documentElement.dataset.reduceMotion = String(nextValue);
  }

  function resetSettings() {
    setReduceMotion(false);
    localStorage.removeItem(motionKey);
    document.documentElement.dataset.reduceMotion = "false";
  }

  return (
    <div className="settings-controls">
      <section className="settings-card" aria-labelledby="settings-appearance-title">
        <div className="settings-card__heading"><span className="settings-card__icon"><Contrast size={19} /></span><div><h2 id="settings-appearance-title">Appearance</h2><p>TattvaLab’s blue visual theme.</p></div></div>
        <div className="settings-theme"><span className="settings-theme__swatches"><i /><i /><i /></span><span><strong>Medi-Caps Blue</strong><small>Current theme</small></span><span className="settings-theme__active"><Check size={14} /> Active</span></div>
      </section>

      <section className="settings-card" aria-labelledby="settings-accessibility-title">
        <div className="settings-card__heading"><span className="settings-card__icon"><Settings2 size={19} /></span><div><h2 id="settings-accessibility-title">Accessibility</h2><p>Choose how interface motion behaves in this browser.</p></div></div>
        <div className="settings-option">
          <div><strong>Reduce motion</strong><p>Limit animations and transitions across TattvaLab.</p></div>
          <button className={`settings-switch${reduceMotion ? " settings-switch--on" : ""}`} type="button" role="switch" aria-checked={reduceMotion} aria-label="Reduce motion" onClick={toggleMotion}><span /></button>
        </div>
      </section>

      <div className="settings-controls__footer"><span>Settings are saved in this browser.</span><button type="button" className="settings-reset" onClick={resetSettings}><RotateCcw size={15} /> Reset settings</button></div>
    </div>
  );
}
