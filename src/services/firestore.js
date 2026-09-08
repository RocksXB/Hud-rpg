import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase.js";

/**
 * Reads only the signed-in player's own profile. Returns null for a signed-out
 * session or for an account that does not have a profile document yet.
 */
export async function getCurrentUserProfile() {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const snapshot = await getDoc(doc(db, "users", user.uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}
