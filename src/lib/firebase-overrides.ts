import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { normalizeOverrides, type ContentOverrides } from "@/lib/edit-overrides";
import {
  FIREBASE_OVERRIDES_COLLECTION,
  FIREBASE_OVERRIDES_DOCUMENT,
  firebaseDb,
} from "@/lib/firebase";

const overridesRef = doc(
  firebaseDb,
  FIREBASE_OVERRIDES_COLLECTION,
  FIREBASE_OVERRIDES_DOCUMENT,
);

export async function loadFirebaseOverrides(): Promise<ContentOverrides | null> {
  const snapshot = await getDoc(overridesRef);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return normalizeOverrides(data.overrides);
}

export async function saveFirebaseOverrides(
  overrides: ContentOverrides,
  updatedBy: string,
): Promise<void> {
  await setDoc(
    overridesRef,
    {
      overrides,
      updatedBy,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
