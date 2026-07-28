/**
 * Free image handling for GitHub Pages + Firebase Spark.
 * Images are compressed in the browser and stored as data URLs in Firestore.
 * No Firebase Storage / Blaze plan required.
 */

const MAX_OUTPUT_BYTES = 350_000; // keep Firestore docs under the 1MB limit
const MAX_DIMENSION = 1600;

function isLikelyImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name);
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "Could not read this image in the browser. Convert it to JPG/PNG, or paste an image URL instead.",
        ),
      );
    };
    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not convert image."));
    };
    reader.onerror = () => reject(new Error("Could not convert image."));
    reader.readAsDataURL(blob);
  });
}

async function compressToDataUrl(file: File): Promise<string> {
  const image = await loadImageElement(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image compression is not supported in this browser.");
  context.drawImage(image, 0, 0, width, height);

  let quality = 0.82;
  let blob = await canvasToBlob(canvas, "image/jpeg", quality);

  while (blob.size > MAX_OUTPUT_BYTES && quality > 0.4) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
  }

  if (blob.size > MAX_OUTPUT_BYTES) {
    // Second pass at smaller dimensions.
    const smaller = document.createElement("canvas");
    smaller.width = Math.max(1, Math.round(width * 0.7));
    smaller.height = Math.max(1, Math.round(height * 0.7));
    const smallerContext = smaller.getContext("2d");
    if (!smallerContext) throw new Error("Image compression is not supported in this browser.");
    smallerContext.drawImage(image, 0, 0, smaller.width, smaller.height);
    blob = await canvasToBlob(smaller, "image/jpeg", 0.7);
  }

  if (blob.size > MAX_OUTPUT_BYTES) {
    throw new Error(
      "Image is still too large after compression. Use a smaller photo, or paste a public image URL instead.",
    );
  }

  return blobToDataUrl(blob);
}

export function formatImageUploadError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Could not prepare this image. Try JPG/PNG, or paste an image URL.";
}

/** @deprecated Use formatImageUploadError */
export const formatStorageError = formatImageUploadError;

/**
 * Prepare an image for free CMS storage (compressed data URL).
 * No paid Firebase Storage required.
 */
export async function uploadCmsImage(file: File): Promise<string> {
  if (!isLikelyImage(file)) {
    throw new Error("Please choose an image file (JPG, PNG, WEBP, GIF).");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("Please choose an image under 12MB.");
  }
  return compressToDataUrl(file);
}
