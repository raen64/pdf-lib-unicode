import { EmbeddedFileOptions } from 'src/core/embedders/FileEmbedder';
import { TypeFeatures } from 'src/types/fontkit';

export enum ParseSpeeds {
  Fastest = Infinity,
  Fast = 1500,
  Medium = 500,
  Slow = 100,
}

export interface AttachmentOptions extends EmbeddedFileOptions {}

export interface SaveOptions {
  useObjectStreams?: boolean;
  addDefaultPage?: boolean;
  objectsPerTick?: number;
  updateFieldAppearances?: boolean;
}

export interface Base64SaveOptions extends SaveOptions {
  dataUri?: boolean;
}

export interface LoadOptions {
  ignoreEncryption?: boolean;
  parseSpeed?: ParseSpeeds | number;
  throwOnInvalidObject?: boolean;
  updateMetadata?: boolean;
  capNumbers?: boolean;
  /**
   * If provided, enables automatic Unicode font support for form fields.
   * Pass the font file bytes (TTF or OTF) and calling `pdfDoc.getFormAsync()`
   * will automatically embed the font for Unicode character support.
   *
   * **IMPORTANT:** You must still register fontkit before using form fields:
   * ```js
   * import fontkit from '@pdf-lib/fontkit'
   * const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer())
   * const pdfDoc = await PDFDocument.load(bytes, { unicodeFont: fontBytes })
   * pdfDoc.registerFontkit(fontkit)
   * ```
   */
  unicodeFont?: ArrayBuffer | Uint8Array;
  /**
   * If true, automatically update existing form fields to use the Unicode font.
   * Only has effect when `unicodeFont` is also provided.
   *
   * @default false
   */
  updateExistingFields?: boolean;
}

export interface CreateOptions {
  updateMetadata?: boolean;
  /**
   * If provided, enables automatic Unicode font support for form fields.
   * Pass the font file bytes (TTF or OTF) and calling `pdfDoc.getFormAsync()`
   * will automatically embed the font for Unicode character support.
   *
   * **IMPORTANT:** You must still register fontkit before using form fields:
   * ```js
   * import fontkit from '@pdf-lib/fontkit'
   * const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer())
   * const pdfDoc = await PDFDocument.create({ unicodeFont: fontBytes })
   * pdfDoc.registerFontkit(fontkit)
   * ```
   */
  unicodeFont?: ArrayBuffer | Uint8Array;
}

export interface EmbedFontOptions {
  subset?: boolean;
  customName?: string;
  features?: TypeFeatures;
}

export interface SetTitleOptions {
  showInWindowTitleBar: boolean;
}
