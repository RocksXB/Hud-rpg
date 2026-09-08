import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { createFirebaseConfig } from "./config";

export const firebaseApp = getApps().length ? getApp() : initializeApp(createFirebaseConfig(import.meta.env));
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
