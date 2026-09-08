import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createFirebaseConfig } from "../src/firebase-config.js";

const environment = {
  VITE_FIREBASE_API_KEY: "api-key",
  VITE_FIREBASE_AUTH_DOMAIN: "project.firebaseapp.com",
  VITE_FIREBASE_PROJECT_ID: "project",
  VITE_FIREBASE_STORAGE_BUCKET: "project.firebasestorage.app",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "123",
  VITE_FIREBASE_APP_ID: "1:123:web:abc",
};

describe("createFirebaseConfig", () => {
  it("maps every required Vite environment variable", () => {
    assert.deepEqual(createFirebaseConfig(environment), {
      apiKey: "api-key",
      authDomain: "project.firebaseapp.com",
      projectId: "project",
      storageBucket: "project.firebasestorage.app",
      messagingSenderId: "123",
      appId: "1:123:web:abc",
    });
  });

  it("rejects an incomplete deployment configuration", () => {
    const incomplete = { ...environment, VITE_FIREBASE_PROJECT_ID: "" };

    assert.throws(
      () => createFirebaseConfig(incomplete),
      /Missing required Firebase environment variables: VITE_FIREBASE_PROJECT_ID/,
    );
  });

  it("does not add a Realtime Database URL", () => {
    assert.ok(!("databaseURL" in createFirebaseConfig(environment)));
  });
});
