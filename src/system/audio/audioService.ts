type Cue = "open" | "select" | "confirm" | "error" | "notification" | "link";
const KEY = "hud-rpg.audio";
class AudioService {
  private context: AudioContext | null = null;
  private prefs = this.read();
  private read() { try { return JSON.parse(localStorage.getItem(KEY) ?? "") as { muted: boolean; volume: number }; } catch { return { muted: false, volume: 0.35 }; } }
  setPreferences(prefs: { muted: boolean; volume: number }) { this.prefs = { muted: prefs.muted, volume: Math.max(0, Math.min(1, prefs.volume)) }; localStorage.setItem(KEY, JSON.stringify(this.prefs)); }
  play(cue: Cue) { if (this.prefs.muted) return; this.context ??= new AudioContext(); const oscillator = this.context.createOscillator(); const gain = this.context.createGain(); const frequencies: Record<Cue, number> = { open: 420, select: 520, confirm: 720, error: 180, notification: 620, link: 880 }; oscillator.frequency.value = frequencies[cue]; gain.gain.setValueAtTime(this.prefs.volume * 0.08, this.context.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.12); oscillator.connect(gain).connect(this.context.destination); oscillator.start(); oscillator.stop(this.context.currentTime + 0.12); }
}
export const audioService = new AudioService();
