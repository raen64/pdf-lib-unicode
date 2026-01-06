/**
 * Bundled Unicode Font Support
 *
 * This module provides a bundled Noto Sans font that supports full Unicode,
 * including European diacritics (Polish, Czech, Hungarian, etc.), Cyrillic,
 * Greek, and more.
 *
 * License: Noto Sans is licensed under the SIL Open Font License (OFL).
 * https://scripts.sil.org/OFL
 */

import { decodeFromBase64 } from 'src/utils/base64';
import { NOTO_SANS_REGULAR_BASE64 } from './NotoSansRegular.base64';

let cachedFontBytes: Uint8Array | null = null;

/**
 * Get the bundled Noto Sans Regular font bytes.
 * The font is cached after first load.
 *
 * @returns Promise resolving to the font as Uint8Array
 */
export const getBundledUnicodeFontBytes = async (): Promise<Uint8Array> => {
  if (cachedFontBytes) {
    return cachedFontBytes;
  }

  cachedFontBytes = decodeFromBase64(NOTO_SANS_REGULAR_BASE64);
  return cachedFontBytes;
};

/**
 * Synchronously get the bundled font bytes.
 * This requires the font to have been loaded previously via getBundledUnicodeFontBytes().
 *
 * @returns The font bytes if already loaded, or null if not yet loaded
 */
export const getBundledUnicodeFontBytesSync = (): Uint8Array | null => {
  return cachedFontBytes;
};

/**
 * Preload the bundled Unicode font into cache.
 * Call this early in your application to ensure the font is ready when needed.
 */
export const preloadBundledUnicodeFont = async (): Promise<void> => {
  await getBundledUnicodeFontBytes();
};

/**
 * Check if the bundled Unicode font is already loaded into cache.
 */
export const isBundledUnicodeFontLoaded = (): boolean => {
  return cachedFontBytes !== null;
};
