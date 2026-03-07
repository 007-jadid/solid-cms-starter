export interface GoogleFontEntry {
  family: string;
  category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
}

export const GOOGLE_FONTS: GoogleFontEntry[] = [
  // Sans Serif
  { family: "Roboto", category: "sans-serif" },
  { family: "Open Sans", category: "sans-serif" },
  { family: "Lato", category: "sans-serif" },
  { family: "Montserrat", category: "sans-serif" },
  { family: "Poppins", category: "sans-serif" },
  { family: "Nunito", category: "sans-serif" },
  { family: "Raleway", category: "sans-serif" },
  { family: "Ubuntu", category: "sans-serif" },
  { family: "Rubik", category: "sans-serif" },
  { family: "Work Sans", category: "sans-serif" },
  { family: "DM Sans", category: "sans-serif" },
  { family: "Outfit", category: "sans-serif" },
  { family: "Figtree", category: "sans-serif" },
  { family: "Manrope", category: "sans-serif" },
  { family: "Source Sans 3", category: "sans-serif" },
  { family: "Noto Sans", category: "sans-serif" },
  { family: "IBM Plex Sans", category: "sans-serif" },
  { family: "Mulish", category: "sans-serif" },
  { family: "Cabin", category: "sans-serif" },
  { family: "Karla", category: "sans-serif" },
  { family: "Quicksand", category: "sans-serif" },
  { family: "Barlow", category: "sans-serif" },
  { family: "Lexend", category: "sans-serif" },
  { family: "Space Grotesk", category: "sans-serif" },
  { family: "Albert Sans", category: "sans-serif" },

  // Serif
  { family: "Lora", category: "serif" },
  { family: "Merriweather", category: "serif" },
  { family: "Playfair Display", category: "serif" },
  { family: "Crimson Text", category: "serif" },
  { family: "Bitter", category: "serif" },
  { family: "Libre Baskerville", category: "serif" },
  { family: "Source Serif 4", category: "serif" },
  { family: "Noto Serif", category: "serif" },
  { family: "EB Garamond", category: "serif" },
  { family: "IBM Plex Serif", category: "serif" },
  { family: "Cormorant Garamond", category: "serif" },
  { family: "Vollkorn", category: "serif" },

  // Display
  { family: "Comfortaa", category: "display" },
  { family: "Righteous", category: "display" },
  { family: "Lobster", category: "display" },
  { family: "Abril Fatface", category: "display" },
  { family: "Bebas Neue", category: "display" },
  { family: "Fredoka", category: "display" },
  { family: "Lilita One", category: "display" },
  { family: "Bungee", category: "display" },

  // Handwriting
  { family: "Pacifico", category: "handwriting" },
  { family: "Dancing Script", category: "handwriting" },
  { family: "Caveat", category: "handwriting" },
  { family: "Shadows Into Light", category: "handwriting" },
  { family: "Satisfy", category: "handwriting" },
  { family: "Sacramento", category: "handwriting" },
  { family: "Kalam", category: "handwriting" },

  // Monospace
  { family: "Fira Code", category: "monospace" },
  { family: "JetBrains Mono", category: "monospace" },
  { family: "Source Code Pro", category: "monospace" },
  { family: "IBM Plex Mono", category: "monospace" },
  { family: "Space Mono", category: "monospace" },
  { family: "Inconsolata", category: "monospace" },
];

export type FontCategory = GoogleFontEntry["category"];

export const FONT_CATEGORIES: { value: "all" | FontCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sans-serif", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
  { value: "display", label: "Display" },
  { value: "handwriting", label: "Handwriting" },
  { value: "monospace", label: "Monospace" },
];
