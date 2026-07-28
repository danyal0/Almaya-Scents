import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { siteConfig } from "@/content/site-config";
import { firebaseStorage } from "@/lib/firebase";

const UPLOAD_TIMEOUT_MS = 20000;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(
              `${label} timed out. Enable Firebase Storage (Build → Storage), then publish rules allowing ${siteConfig.adminEmail} to write cms-uploads/.`,
            ),
          );
        }, UPLOAD_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function formatStorageError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "storage/unauthorized":
        return `Upload blocked. Publish Storage rules allowing ${siteConfig.adminEmail} to write cms-uploads/.`;
      case "storage/canceled":
        return "Upload canceled.";
      case "storage/retry-limit-exceeded":
        return "Upload failed after retries. Check your connection and Storage setup.";
      default:
        return `${error.code}: ${error.message}`;
    }
  }
  if (error instanceof Error) return error.message;
  return "Upload failed. Enable Firebase Storage and publish storage rules.";
}

export async function uploadCmsImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be under 8MB.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `cms-uploads/${Date.now()}-${safeName}`;
  const storageRef = ref(firebaseStorage, path);

  await withTimeout(
    uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
    }),
    "Uploading image",
  );

  return withTimeout(getDownloadURL(storageRef), "Getting image URL");
}
