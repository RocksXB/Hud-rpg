import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase.js";
import { playerIdToInternalEmail } from "../player-identity.js";

export function logInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logInWithPlayerId(playerId, accessKey) {
  return logInWithEmail(playerIdToInternalEmail(playerId), accessKey);
}

export function registerWithPlayerId(playerId, accessKey) {
  return createUserWithEmailAndPassword(
    auth,
    playerIdToInternalEmail(playerId),
    accessKey,
  );
}

export function logOut() {
  return signOut(auth);
}

export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
