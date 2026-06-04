export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Applies a pixel crop area (from react-easy-crop) to an image src URL
 * and returns a JPEG File ready for upload.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  fileName: string,
  quality = 0.92
): Promise<File> {
  const img = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  const outW = Math.min(pixelCrop.width, 1200);
  const outH = Math.round(outW * (pixelCrop.height / pixelCrop.width));
  canvas.width = outW;
  canvas.height = outH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(
    img,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outW,
    outH
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas toBlob failed"));
        resolve(new File([blob], fileName.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
      },
      "image/jpeg",
      quality
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Legacy auto-crop (kept for fallback) */
export async function cropToAspectRatio(
  file: File,
  aspectRatio = 3 / 4,
  quality = 0.9
): Promise<File> {
  const url = URL.createObjectURL(file);
  const img = await loadImage(url);
  URL.revokeObjectURL(url);

  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  const srcRatio = srcW / srcH;

  let cropW: number, cropH: number;
  if (srcRatio > aspectRatio) {
    cropH = srcH;
    cropW = srcH * aspectRatio;
  } else {
    cropW = srcW;
    cropH = srcW / aspectRatio;
  }

  const pixelCrop: PixelCrop = {
    x: (srcW - cropW) / 2,
    y: (srcH - cropH) / 2,
    width: cropW,
    height: cropH,
  };

  const objectUrl = URL.createObjectURL(file);
  const result = await getCroppedImg(objectUrl, pixelCrop, file.name, quality);
  URL.revokeObjectURL(objectUrl);
  return result;
}
