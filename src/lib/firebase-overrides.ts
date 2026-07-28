import { FirebaseError } from "firebase/app";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { normalizeOverrides, type ContentOverrides } from "@/lib/edit-overrides";
import { siteConfig } from "@/content/site-config";
import {
  FIREBASE_OVERRIDES_COLLECTION,
  FIREBASE_OVERRIDES_DOCUMENT,
  firebaseAuth,
  firebaseDb,
} from "@/lib/firebase";

const overridesRef = doc(
  firebaseDb,
  FIREBASE_OVERRIDES_COLLECTION,
  FIREBASE_OVERRIDES_DOCUMENT,
);

const FIRESTORE_TIMEOUT_MS = 12000;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(
              `${label} timed out. Create a Firestore database in Firebase Console (Build → Firestore Database), then publish rules that allow ${siteConfig.adminEmail} to write.`,
            ),
          );
        }, FIRESTORE_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function formatFirestoreError(error: unknown): string {
  const signedInAs = firebaseAuth.currentUser?.email ?? "not signed in";

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return `Permission denied for Firestore write as ${signedInAs}. Open Firestore → Rules (not Storage), publish rules allowing ${siteConfig.adminEmail}, then log out/in and retry.`;
      case "unavailable":
        return "Firestore is unavailable. Create/enable Firestore Database in Firebase Console, then retry.";
      case "failed-precondition":
        return "Firestore is not ready yet. Create a Firestore database in Firebase Console and retry.";
      default:
        return `${error.code}: ${error.message}`;
    }
  }

  if (error instanceof Error) return error.message;
  return "Unable to reach Firestore.";
}

async function ensureFreshAuthToken(): Promise<void> {
  await firebaseAuth.authStateReady();
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error(`You must be logged in as ${siteConfig.adminEmail} to save.`);
  }
  if (user.email?.toLowerCase() !== siteConfig.adminEmail.toLowerCase()) {
    throw new Error(
      `Logged in as ${user.email ?? "unknown"}, but only ${siteConfig.adminEmail} can save.`,
    );
  }
  // Force a fresh ID token so Firestore rules see request.auth correctly.
  await user.getIdToken(true);
}

export async function loadFirebaseOverrides(): Promise<ContentOverrides | null> {
  const snapshot = await withTimeout(getDoc(overridesRef), "Loading content");
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return normalizeOverrides(data.overrides);
}

export async function saveFirebaseOverrides(
  overrides: ContentOverrides,
  updatedBy: string,
): Promise<void> {
  await ensureFreshAuthToken();
  await withTimeout(
    setDoc(
      overridesRef,
      {
        overrides,
        updatedBy,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
    "Saving content",
  );
}
