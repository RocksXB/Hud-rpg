export const MODULES = ["WORLD", "STATUS", "INVENTORY", "EQUIPMENT", "SKILLS", "QUESTS", "PARTY", "GUILD", "TITLES", "SYSTEM"] as const;
export type Module = typeof MODULES[number];
export function SystemNavigation({ active, onChange }: { active: Module; onChange: (module: Module) => void }) {
  return <nav className="system-nav" aria-label="Módulos do Sistema">{MODULES.map((module) => <button key={module} aria-current={active === module ? "page" : undefined} onClick={() => onChange(module)}><span>{module.slice(0, 2)}</span><small>{module}</small></button>)}</nav>;
}
