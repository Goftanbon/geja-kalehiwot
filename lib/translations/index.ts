import { en, type Dict } from "./en";
import { am } from "./am";

export { en } from "./en";
export { am } from "./am";
export type { Dict } from "./en";

export const translations = {
  en,
  am,
} as const;

// Alias `T` for convenience
export const T = translations;

export type Lang = keyof typeof translations;

