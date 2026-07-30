/** Supabase `avatars` bucket limit (migration 007). */
export const AVATAR_BUCKET_LIMIT_BYTES = 2 * 1024 * 1024;
export const AVATAR_BUCKET_LIMIT_MB = 2;

/** Max size before client-side crop/compress (phone photos are fine). */
export const AVATAR_MAX_SOURCE_MB = 20;

export const AVATAR_OUTPUT_SIZE = 512;
export const AVATAR_PREVIEW_SIZE = 280;

export const AVATAR_ACCEPT =
  'image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif,.heic,.heif';

export interface AvatarCropState {
  /** Zoom multiplier on top of the base cover scale (1 = fill circle). */
  scale: number;
  /** Pan offset in preview pixels. */
  offsetX: number;
  offsetY: number;
}

export const DEFAULT_AVATAR_CROP: AvatarCropState = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export function validateAvatarSourceFile(file: File): string | null {
  if (!file.type.startsWith('image/') && !/\.heic$/i.test(file.name) && !/\.heif$/i.test(file.name)) {
    return 'Please choose a JPEG, PNG, WebP, or GIF image.';
  }
  if (file.size > AVATAR_MAX_SOURCE_MB * 1024 * 1024) {
    return `Image is too large. Choose a file under ${AVATAR_MAX_SOURCE_MB}MB.`;
  }
  return null;
}

export function loadImageFromFile(
  file: File
): Promise<{ image: HTMLImageElement; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ image: img, previewUrl });
    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(
        new Error(
          'Could not read this image. Use JPEG, PNG, or WebP — on iPhone try Settings → Camera → Formats → Most Compatible.'
        )
      );
    };
    img.src = previewUrl;
  });
}

function baseCoverScale(image: HTMLImageElement, previewSize: number) {
  return Math.max(previewSize / image.naturalWidth, previewSize / image.naturalHeight);
}

/** Draw dimensions/position for the crop preview. */
export function getAvatarDrawRect(
  image: HTMLImageElement,
  crop: AvatarCropState,
  previewSize: number
) {
  const { naturalWidth, naturalHeight } = image;
  if (!naturalWidth || !naturalHeight) {
    return { x: 0, y: 0, drawW: previewSize, drawH: previewSize, scale: 1 };
  }
  const scale = baseCoverScale(image, previewSize) * crop.scale;
  const drawW = naturalWidth * scale;
  const drawH = naturalHeight * scale;
  const x = (previewSize - drawW) / 2 + crop.offsetX;
  const y = (previewSize - drawH) / 2 + crop.offsetY;
  return { x, y, drawW, drawH, scale };
}

export async function renderAvatarBlob(
  image: HTMLImageElement,
  crop: AvatarCropState,
  previewSize = AVATAR_PREVIEW_SIZE,
  outputSize = AVATAR_OUTPUT_SIZE
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image in this browser.');

  const { x, y, drawW, drawH } = getAvatarDrawRect(image, crop, previewSize);
  const ratio = outputSize / previewSize;
  ctx.drawImage(image, x * ratio, y * ratio, drawW * ratio, drawH * ratio);

  let quality = 0.9;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > AVATAR_BUCKET_LIMIT_BYTES && quality > 0.5) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }
  if (blob.size > AVATAR_BUCKET_LIMIT_BYTES) {
    throw new Error(
      `Processed image is still over ${AVATAR_BUCKET_LIMIT_MB}MB. Try zooming in more on your face.`
    );
  }
  return blob;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process image'))),
      'image/jpeg',
      quality
    );
  });
}
