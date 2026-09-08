import { useMemo, useState } from "react";
import type { Player } from "../../types/domain";
import { CLASSES } from "../../game/classes";
import { RACES } from "../../game/races";
import { calculateMaxHp, calculateMaxMp, calculateStats } from "../../game/stats";
import { playerRepository } from "../../services/firebase/repositories/playerRepository";
export function CharacterCreation({ player, onComplete }: { player: Player; onComplete: () => Promise<void> }) {
  const [step, setStep] = useState(0); const [name, setName] = useState(""); const [raceId, setRaceId] = useState(""); const [classId, setClassId] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const race = RACES.find((item) => item.id === raceId); const gameClass = CLASSES.find((item) => item.id === classId);
  const stats = useMemo(() => race && gameClass ? calculateStats(race, gameClass) : null, [race, gameClass]);
  async function confirm() { if (!race || !gameClass || !stats || name.trim().length < 2) return; setBusy(true); setError(""); try { await playerRepository.completeCharacter(player.uid, { displayName: name.trim(), raceId: race.id, classId: gameClass.id, stats, maxHp: calculateMaxHp(stats), maxMp: calculateMaxMp(stats) }); await onComplete(); } catch { setError("PROCESSING FAILED — revise os dados e tente novamente."); setBusy(false); } }
  return <main className="creation"><header><p className="kicker">NEW ENTITY // {String(step + 1).padStart(2, "0")}</p><h1>O Sistema aguarda sua definição.</h1><div className="step-line" aria-hidden="true"><span data-step={step}/></div></header>
    {step === 0 && <section className="creation-step"><h2>Como o mundo irá reconhecê-lo?</h2><label>CHARACTER NAME<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={32} autoFocus /></label><button disabled={name.trim().length < 2} onClick={() => setStep(1)}>CONTINUE</button></section>}
    {step === 1 && <Selection title="Selecione sua origem" entries={RACES} selected={raceId} onSelect={setRaceId} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
    {step === 2 && <Selection title="Selecione sua vocação" entries={CLASSES} selected={classId} onSelect={setClassId} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
    {step === 3 && stats && <section className="creation-step"><h2>Identity preview</h2><div className="identity-preview"><strong>{name}</strong><span>{race?.name} // {gameClass?.name}</span><dl>{Object.entries(stats).map(([key, value]) => <div key={key}><dt>{key.toUpperCase()}</dt><dd>{value}</dd></div>)}</dl><p>HP {calculateMaxHp(stats)} · MP {calculateMaxMp(stats)}</p></div>{error && <p role="alert">{error}</p>}<div className="actions"><button className="secondary" onClick={() => setStep(2)}>BACK</button><button disabled={busy} onClick={() => void confirm()}>{busy ? "SYSTEM PROCESSING…" : "CONFIRM IDENTITY"}</button></div></section>}
  </main>;
}
function Selection({ title, entries, selected, onSelect, onBack, onNext }: { title: string; entries: readonly { id: string; name: string; description?: string; role?: string }[]; selected: string; onSelect: (id: string) => void; onBack: () => void; onNext: () => void }) {
  return <section className="creation-step"><h2>{title}</h2><div className="choice-grid">{entries.map((entry) => <button key={entry.id} className={selected === entry.id ? "choice selected" : "choice"} aria-pressed={selected === entry.id} onClick={() => onSelect(entry.id)}><strong>{entry.name}</strong><span>{entry.description ?? entry.role}</span></button>)}</div><div className="actions"><button className="secondary" onClick={onBack}>BACK</button><button disabled={!selected} onClick={onNext}>CONTINUE</button></div></section>;
}
