import type { FirebaseOptions } from "firebase/app";

const keys = {
  apiKey: "VITE_FIREBASE_API_KEY", authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID", storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID", appId: "VITE_FIREBASE_APP_ID",
} as const;
export function createFirebaseConfig(environment: Record<string, string | boolean | undefined>): FirebaseOptions {
  const config = Object.fromEntries(Object.entries(keys).map(([field, key]) => [field, typeof environment[key] === "string" ? environment[key].trim() : ""]));
  const missing = Object.entries(keys).filter(([field]) => !config[field]).map(([, key]) => key);
  if (missing.length) throw new Error(`Missing required Firebase environment variables: ${missing.join(", ")}`);
  return config;
}
