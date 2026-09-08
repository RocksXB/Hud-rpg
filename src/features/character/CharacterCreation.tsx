import { useMemo, useState, type ReactNode } from "react";
import type { Player, Stats } from "../../types/domain";
import { CLASSES } from "../../game/classes";
import { RACES } from "../../game/races";
import {
  STAT_KEYS,
  calculateMaxHp,
  calculateMaxMp,
  calculateStats,
  createFlexibleBonus,
} from "../../game/stats";
import { playerRepository } from "../../services/firebase/repositories/playerRepository";

type StatKey = (typeof STAT_KEYS)[number];
type HumanBonusSelection = [StatKey | "", StatKey | ""];

export function CharacterCreation({ player, onComplete }: { player: Player; onComplete: () => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [raceId, setRaceId] = useState("");
  const [classId, setClassId] = useState("");
  const [humanBonus, setHumanBonus] = useState<HumanBonusSelection>(["", ""]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const race = RACES.find((item) => item.id === raceId);
  const gameClass = CLASSES.find((item) => item.id === classId);
  const needsFlexibleBonus = Boolean(race?.flexiblePoints);
  const flexibleBonusValid = !needsFlexibleBonus || (
    humanBonus[0] !== "" && humanBonus[1] !== "" && humanBonus[0] !== humanBonus[1]
  );

  const flexibleBonus = useMemo<Partial<Stats>>(() => {
    if (!race?.flexiblePoints || !flexibleBonusValid) return {};
    return createFlexibleBonus(humanBonus.filter((key): key is StatKey => key !== ""), race.flexiblePoints);
  }, [race, flexibleBonusValid, humanBonus]);

  const stats = useMemo(
    () => race && gameClass && flexibleBonusValid ? calculateStats(race, gameClass, flexibleBonus) : null,
    [race, gameClass, flexibleBonus, flexibleBonusValid],
  );

  function selectRace(id: string) {
    setRaceId(id);
    const selectedRace = RACES.find((item) => item.id === id);
    if (!selectedRace?.flexiblePoints) setHumanBonus(["", ""]);
  }

  function updateHumanBonus(index: 0 | 1, value: StatKey | "") {
    setHumanBonus((current) => {
      const next: HumanBonusSelection = [...current];
      next[index] = value;
      return next;
    });
  }

  async function confirm() {
    if (!race || !gameClass || !stats || name.trim().length < 2 || !flexibleBonusValid) return;
    setBusy(true);
    setError("");
    try {
      await playerRepository.completeCharacter(player.uid, {
        displayName: name.trim(),
        raceId: race.id,
        classId: gameClass.id,
        stats,
        maxHp: calculateMaxHp(stats),
        maxMp: calculateMaxMp(stats),
      });
      await onComplete();
    } catch {
      setError("PROCESSING FAILED — revise os dados e tente novamente.");
      setBusy(false);
    }
  }

  return (
    <main className="creation">
      <header>
        <p className="kicker">NEW ENTITY // {String(step + 1).padStart(2, "0")}</p>
        <h1>O Sistema aguarda sua definição.</h1>
        <div className="step-line" aria-hidden="true"><span data-step={step} /></div>
      </header>

      {step === 0 && (
        <section className="creation-step">
          <h2>Como o mundo irá reconhecê-lo?</h2>
          <label>
            CHARACTER NAME
            <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={16} autoFocus />
          </label>
          <button disabled={name.trim().length < 2} onClick={() => setStep(1)}>CONTINUE</button>
        </section>
      )}

      {step === 1 && (
        <Selection
          title="Selecione sua origem"
          entries={RACES}
          selected={raceId}
          onSelect={selectRace}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
          nextDisabled={!raceId || !flexibleBonusValid}
        >
          {needsFlexibleBonus && (
            <div className="flexible-stats" aria-live="polite">
              <p><strong>ADAPTABILIDADE HUMANA</strong></p>
              <p>Escolha dois atributos diferentes. Cada um recebe +1.</p>
              <div className="actions">
                <StatSelect label="BÔNUS 01" value={humanBonus[0]} blocked={humanBonus[1]} onChange={(value) => updateHumanBonus(0, value)} />
                <StatSelect label="BÔNUS 02" value={humanBonus[1]} blocked={humanBonus[0]} onChange={(value) => updateHumanBonus(1, value)} />
              </div>
              {!flexibleBonusValid && <p role="status">Selecione dois atributos diferentes para continuar.</p>}
            </div>
          )}
        </Selection>
      )}

      {step === 2 && (
        <Selection
          title="Selecione sua vocação"
          entries={CLASSES}
          selected={classId}
          onSelect={setClassId}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          nextDisabled={!classId}
        />
      )}

      {step === 3 && stats && (
        <section className="creation-step">
          <h2>Identity preview</h2>
          <div className="identity-preview">
            <strong>{name}</strong>
            <span>{race?.name} // {gameClass?.name}</span>
            <dl>{Object.entries(stats).map(([key, value]) => <div key={key}><dt>{key.toUpperCase()}</dt><dd>{value}</dd></div>)}</dl>
            <p>HP {calculateMaxHp(stats)} · MP {calculateMaxMp(stats)}</p>
          </div>
          {error && <p role="alert">{error}</p>}
          <div className="actions">
            <button className="secondary" onClick={() => setStep(2)}>BACK</button>
            <button disabled={busy} onClick={() => void confirm()}>{busy ? "SYSTEM PROCESSING…" : "CONFIRM IDENTITY"}</button>
          </div>
        </section>
      )}
    </main>
  );
}

function StatSelect({ label, value, blocked, onChange }: { label: string; value: StatKey | ""; blocked: StatKey | ""; onChange: (value: StatKey | "") => void }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value as StatKey | "")}>
        <option value="">Selecione</option>
        {STAT_KEYS.map((key) => <option key={key} value={key} disabled={key === blocked}>{key.toUpperCase()}</option>)}
      </select>
    </label>
  );
}

function Selection({
  title,
  entries,
  selected,
  onSelect,
  onBack,
  onNext,
  nextDisabled,
  children,
}: {
  title: string;
  entries: readonly { id: string; name: string; description?: string; role?: string }[];
  selected: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="creation-step">
      <h2>{title}</h2>
      <div className="choice-grid">
        {entries.map((entry) => (
          <button
            key={entry.id}
            className={selected === entry.id ? "choice selected" : "choice"}
            aria-pressed={selected === entry.id}
            onClick={() => onSelect(entry.id)}
          >
            <strong>{entry.name}</strong>
            <span>{entry.description ?? entry.role}</span>
          </button>
        ))}
      </div>
      {children}
      <div className="actions">
        <button className="secondary" onClick={onBack}>BACK</button>
        <button disabled={nextDisabled} onClick={onNext}>CONTINUE</button>
      </div>
    </section>
  );
}
