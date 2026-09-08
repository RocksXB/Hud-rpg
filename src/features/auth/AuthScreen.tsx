import { useState, type FormEvent } from "react";
import { connectPlayer, registerPlayer } from "../../services/firebase/auth";
import { translateAuthError } from "./authErrors";
export function AuthScreen() {
  const [mode, setMode] = useState<"connect" | "create">("connect"); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("IDENTITY CHANNEL READY");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("VERIFYING IDENTITY"); const data = new FormData(event.currentTarget);
    try { const playerId = String(data.get("playerId")); const key = String(data.get("accessKey")); if (mode === "create") await registerPlayer(playerId, key); else await connectPlayer(playerId, key); setMessage("SYSTEM LINK ESTABLISHED"); }
    catch (error) { setMessage(translateAuthError(error)); setBusy(false); }
  }
  return <main className="auth-stage"><section className="auth-panel" aria-labelledby="auth-title"><p className="kicker">SECURE IDENTITY GATE</p><h1 id="auth-title">{mode === "connect" ? "Return to the world." : "Forge your system ID."}</h1><p className="system-message" aria-live="polite">{message}</p><form onSubmit={submit}><label>PLAYER ID<input name="playerId" autoComplete="username" minLength={3} maxLength={32} required autoFocus /></label><label>ACCESS KEY<input name="accessKey" type="password" autoComplete={mode === "create" ? "new-password" : "current-password"} minLength={6} required /></label><button disabled={busy}>{busy ? "LINKING…" : mode === "connect" ? "CONNECT" : "CREATE ID"}</button></form><button className="text-button" onClick={() => setMode(mode === "connect" ? "create" : "connect")}>{mode === "connect" ? "CREATE NEW ID" : "USE EXISTING ID"}</button></section></main>;
}
