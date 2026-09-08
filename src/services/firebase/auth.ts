import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { playerIdFromInternalEmail, playerIdToInternalEmail } from "../../features/auth/playerIdentity";
import { auth } from "./app";
import { playerRepository } from "./repositories/playerRepository";

export async function registerPlayer(playerId: string, accessKey: string) {
  const internalEmail = playerIdToInternalEmail(playerId);
  const credential = await createUserWithEmailAndPassword(auth, internalEmail, accessKey);
  return playerRepository.ensureInitial(credential.user.uid, playerIdFromInternalEmail(credential.user.email) ?? playerId);
}
export async function connectPlayer(playerId: string, accessKey: string) {
  const credential = await signInWithEmailAndPassword(auth, playerIdToInternalEmail(playerId), accessKey);
  return playerRepository.ensureInitial(credential.user.uid, playerIdFromInternalEmail(credential.user.email) ?? playerId);
}
export const disconnectPlayer = () => signOut(auth);
export const observeSession = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);
