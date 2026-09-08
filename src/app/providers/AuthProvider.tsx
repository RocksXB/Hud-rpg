import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import type { Player } from "../../types/domain";
import { observeSession } from "../../services/firebase/auth";
import { playerIdFromInternalEmail } from "../../features/auth/playerIdentity";
import { playerRepository } from "../../services/firebase/repositories/playerRepository";

type SessionState = { status: "loading" | "anonymous" | "authenticated" | "error"; user: User | null; player: Player | null; error: string | null; reload: () => Promise<void> };
const AuthContext = createContext<SessionState | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<SessionState, "reload">>({ status: "loading", user: null, player: null, error: null });
  const load = async (user: User | null) => {
    if (!user) return setState({ status: "anonymous", user: null, player: null, error: null });
    try {
      const playerId = playerIdFromInternalEmail(user.email);
      if (!playerId) throw new Error("INVALID_AUTH_IDENTITY");
      const player = await playerRepository.ensureInitial(user.uid, playerId);
      setState({ status: "authenticated", user, player, error: null });
    } catch { setState({ status: "error", user, player: null, error: "O Sistema não conseguiu recuperar seu vínculo." }); }
  };
  useEffect(() => observeSession((user) => { void load(user); }), []);
  const value = useMemo<SessionState>(() => ({ ...state, reload: () => load(state.user) }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("AuthProvider missing"); return value; }
