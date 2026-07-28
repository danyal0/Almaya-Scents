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
              `${label} timed out. Open Firebase Console → Storage → get started, then publish Storage rules for cms-uploads/.`,
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
      case "permission-denied":
        return `Image upload blocked by Firebase Storage rules (not Firestore). In Firebase Console go to Storage → Rules and publish rules that allow ${siteConfig.adminEmail} to write cms-uploads/.`;
      case "storage/canceled":
        return "Upload canceled.";
      case "storage/retry-limit-exceeded":
        return "Upload failed after retries. Check your connection and Storage setup.";
      case "storage/unauthenticated":
        return "You must be logged in to upload images.";
      default:
        return `Storage error (${error.code}): ${error.message}`;
    }
  }
  if (error instanceof Error) return error.message;
  return "Upload failed. Enable Firebase Storage and publish Storage rules.";
}

function resolveContentType(file: File): string {
  if (file.type && file.type.startsWith("image/")) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".gif")) return "image/gif";
  if (name.endsWith(".heic") || name.endsWith(".heif")) return "image/heic";
  return "image/jpeg";
}

function isLikelyImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name);
}

export async function uploadCmsImage(file: File): Promise<string> {
  if (!isLikelyImage(file)) {
    throw new Error("Please choose an image file (JPG, PNG, WEBP, GIF).");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be under 8MB.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "upload.jpg";
  const path = `cms-uploads/${Date.now()}-${safeName}`;
  const storageRef = ref(firebaseStorage, path);
  const contentType = resolveContentType(file);

  await withTimeout(
    uploadBytes(storageRef, file, { contentType }),
    "Uploading image",
  );

  return withTimeout(getDownloadURL(storageRef), "Getting image URL");
}
