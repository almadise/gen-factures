const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
const LOGO_MAX_HEIGHT_PX = 80;

export interface LogoResult {
  base64: string;
  naturalWidth: number;
  naturalHeight: number;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function svgToPngBase64(svgDataUrl: string): Promise<LogoResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const png = canvas.toDataURL("image/png");
        resolve({
          base64: png,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Échec du chargement de l'image SVG"));
    img.src = svgDataUrl;
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Échec du chargement de l'image"));
    img.src = dataUrl;
  });
}

/**
 * Traite un fichier image (JPG, PNG, SVG) : conversion en base64,
 * SVG → PNG pour compatibilité PDF. Retourne les dimensions pour redimensionnement.
 */
export async function processLogoFile(file: File): Promise<LogoResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Le fichier ne doit pas dépasser 2 Mo.");
  }
  const type = file.type.toLowerCase();
  if (!ACCEPTED_TYPES.includes(type)) {
    throw new Error("Format accepté : JPG, PNG ou SVG.");
  }

  const dataUrl = await readFileAsDataURL(file);

  if (type === "image/svg+xml") {
    return svgToPngBase64(dataUrl);
  }

  const { width, height } = await getImageDimensions(dataUrl);
  return {
    base64: dataUrl,
    naturalWidth: width,
    naturalHeight: height,
  };
}

/** Calcule largeur/hauteur pour affichage avec hauteur max 80px */
export function getLogoDisplaySize(
  naturalWidth: number,
  naturalHeight: number,
  maxHeight: number = LOGO_MAX_HEIGHT_PX
): { width: number; height: number } {
  if (naturalHeight <= 0) return { width: 0, height: 0 };
  const scale = Math.min(1, maxHeight / naturalHeight);
  return {
    width: Math.round(naturalWidth * scale),
    height: Math.round(naturalHeight * scale),
  };
}
