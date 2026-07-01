import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges CSS classes dynamically, handling Tailwind utility conflicts correctly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
