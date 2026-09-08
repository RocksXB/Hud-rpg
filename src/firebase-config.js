const firebaseEnvironmentKeys = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

export function createFirebaseConfig(environment) {
  const config = Object.fromEntries(
    Object.entries(firebaseEnvironmentKeys).map(([property, key]) => [
      property,
      environment[key]?.trim(),
    ]),
  );
  const missingKeys = Object.entries(firebaseEnvironmentKeys)
    .filter(([property]) => !config[property])
    .map(([, key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingKeys.join(", ")}`,
    );
  }

  return config;
}
