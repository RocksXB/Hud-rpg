# HUD-RPG

Baseline Firebase integration for HUD-RPG. Cloud Firestore is the project's
official database; Firebase Realtime Database is not used.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Run `npm run build`, `npm run lint`, and `npm test`.

`index.html` and `src/main.js` are the standard Vite application entry points;
the project is not configured as a JavaScript library. They provide only a
minimal System Shell bootstrap so Login, Character Creation, and World HUD can
be introduced incrementally.

Firebase is initialized once in `src/firebase.js` with the modular SDK. That
module exports the shared `auth` and `db` instances. Authentication helpers in
`src/services/auth.js` support the existing email/password flow (login, logout,
and session observation); no federated provider is configured.

`getCurrentPlayer` in `src/services/firestore.js` is the initial safe
Firestore read. It returns the authenticated player's own `players/{uid}` document
or `null` when signed out/the document does not exist. It never creates or
changes data.

### Player ID and Access Key

The immersive UI may authenticate with a **Player ID** and **Access Key**.
`src/player-identity.js` owns the conversion from Player ID to the internal
Firebase Auth email (`normalized-player-id@grpg.local`), keeping this technical
detail out of future screens. `logInWithPlayerId` and `registerWithPlayerId`
provide that flow, while direct email/password login and registration remain
available for account flows that require them. Both use Firebase Email/Password;
no additional provider is involved.

Player identity and game state use only `players/{uid}`. Do not create a parallel
`users/{uid}` model for the same entity.

## Environment variables

The frontend build requires all of these Vite variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

The expected public web-app values are documented in `.env.example`. Firebase
web configuration identifies the Firebase project; it is not an Admin SDK key
or a substitute for Security Rules. Never add a service-account JSON file.

### Cloudflare deployment

Add the six variables above to the Cloudflare Pages project's **Settings >
Environment variables** for both Preview and Production, then trigger a new
deployment. Vite injects these variables at build time, so Cloudflare runtime
secrets/bindings alone will not make them available to the bundle.

Use `npm run build` as the build command and `dist` as the output directory.

## Firebase Console setup

Manual changes cannot be performed from this repository. In the Firebase
Console for project `grpg-335ce`:

1. Confirm **Authentication > Sign-in method > Email/Password** is enabled.
   Do not enable Google Sign-In for this application.
2. Confirm the Cloud Firestore database exists in the intended location.
3. Review `firestore.rules` against any pre-existing production collections
   before deployment. The checked-in baseline permits an authenticated user to
   read only their own `players/{uid}` document and denies every other operation.
4. Deploy rules only after that review with
   `firebase deploy --only firestore:rules --project grpg-335ce`. Deployment is
   intentionally not part of the build and was not performed by this change.
5. Add the deployed Cloudflare domain to **Authentication > Settings >
   Authorized domains** if it is not already listed.

Because existing remote rules and documents are not available in this checkout,
do not deploy the baseline rules blindly: doing so could restrict existing app
features. No database contents are migrated, deleted, or seeded by this setup.

## Validation in a deployed environment

After configuration, use an existing email/password account to verify:

1. `logInWithEmail(email, password)` or `logInWithPlayerId(playerId, accessKey)`
   establishes a session.
2. `getCurrentPlayer()` reads only `players/{uid}` (or returns `null` when
   the profile does not exist).
3. Refresh and verify `observeAuthState` restores the session.
4. `logOut()` clears the session.
5. Confirm the browser console and Network panel contain no Firebase errors and
   no Realtime Database requests.

These end-to-end checks require a deployed origin, enabled Firebase services,
and valid user credentials, so they cannot be automated safely with repository
fixtures.
