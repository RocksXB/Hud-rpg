import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase.js";

/**
 * Reads only the signed-in player's own game document. Returns null for a
 * signed-out session or for an account without a player document yet.
 */
export async function getCurrentPlayer() {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const snapshot = await getDoc(doc(db, "players", user.uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}
