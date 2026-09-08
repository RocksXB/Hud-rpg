import { useEffect, useState } from "react";
type IntroPreference = "always" | "reduced" | "skip";
const KEY = "hud-rpg.intro";
export function LinkStart({ onComplete }: { onComplete: () => void }) {
  const preference = (localStorage.getItem(KEY) as IntroPreference | null) ?? "always";
  const reduced = preference === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [step, setStep] = useState(0);
  const sequence = ["SYSTEM BOOT", "DEVICE CHANNEL READY", "IDENTITY LAYER ONLINE", "WORLD LINK STABLE"];
  useEffect(() => {
    if (preference === "skip") { onComplete(); return; }
    const timer = window.setTimeout(() => step === sequence.length - 1 ? onComplete() : setStep((value) => value + 1), reduced ? 260 : 650);
    return () => window.clearTimeout(timer);
  }, [step, reduced, preference, onComplete, sequence.length]);
  return <main className="link-start" aria-live="polite"><div className="link-orbit" aria-hidden="true"/><p className="kicker">HUD-RPG // LINK PROTOCOL</p><h1>{sequence[step]}</h1><div className="link-progress"><span style={{ width: `${((step + 1) / sequence.length) * 100}%` }}/></div><button className="text-button" onClick={onComplete}>SKIP SEQUENCE</button></main>;
}
