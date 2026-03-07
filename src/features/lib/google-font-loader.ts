const loadedFonts = new Set<string>();

/**
 * Loads a Google Font by injecting a <link> stylesheet into <head>.
 * No-ops if the font was already loaded.
 */
export function loadGoogleFont(family: string): Promise<void> {
  if (loadedFonts.has(family)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;600;700&display=swap`;
    link.onload = () => {
      loadedFonts.add(family);
      resolve();
    };
    link.onerror = () => reject(new Error(`Failed to load font: ${family}`));
    document.head.appendChild(link);
  });
}

/**
 * Checks whether a given Google Font has already been loaded.
 */
export function isGoogleFontLoaded(family: string): boolean {
  return loadedFonts.has(family);
}
