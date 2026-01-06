# Unicode Support in pdf-lib-unicode

This fork of pdf-lib adds **first-class support for Unicode characters**, including European diacritics (Polish, Czech, Hungarian, etc.), Cyrillic, Greek, and more.

## The Problem

The original pdf-lib uses WinAnsi encoding (Windows-1252) for standard fonts, which only supports Western European characters. This means characters like:

- **Polish:** ą, ć, ę, ł, ń, ó, ś, ź, ż
- **Czech:** ě, š, č, ř, ž, ý, á, í, é, ú, ů
- **Hungarian:** ő, ű
- **Cyrillic:** а, б, в, г, д...

...will throw encoding errors or render incorrectly.

## The Solution

This fork provides two easy ways to enable Unicode support:

### Method 1: Automatic (Recommended)

Use `enableUnicodeFont()` to automatically embed a bundled Unicode font (Noto Sans):

```javascript
import { PDFDocument } from '@raen64/pdf-lib-unicode';
import fontkit from '@pdf-lib/fontkit';

// Create document and register fontkit
const pdfDoc = await PDFDocument.create();
pdfDoc.registerFontkit(fontkit);

// Enable Unicode font for form fields
const form = pdfDoc.getForm();
await form.enableUnicodeFont();

// Now form fields support Unicode!
const textField = form.createTextField('name');
textField.setText('Zażółć gęślą jaźń'); // Polish pangram - works!

// The Unicode font can also be used for page text
const page = pdfDoc.addPage();
const font = form.getDefaultFont();
page.drawText('Příliš žluťoučký kůň', { font, size: 24 });
```

### Method 2: Manual Font Setting

Use `setDefaultFont()` with your own Unicode-compatible font:

```javascript
import { PDFDocument } from '@raen64/pdf-lib-unicode';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';

const pdfDoc = await PDFDocument.create();
pdfDoc.registerFontkit(fontkit);

// Embed your own Unicode font
const fontBytes = fs.readFileSync('path/to/your/font.ttf');
const unicodeFont = await pdfDoc.embedFont(fontBytes);

// Set it as the default for forms
const form = pdfDoc.getForm();
form.setDefaultFont(unicodeFont);

// Form fields now use your custom font
const field = form.getTextField('address');
field.setText('ul. Świętojańska 15, Gdańsk');
```

## API Reference

### PDFForm Methods

#### `enableUnicodeFont(): Promise<void>`

Enables automatic Unicode font support using the bundled Noto Sans font.

**Requirements:**
- fontkit must be registered via `pdfDoc.registerFontkit(fontkit)`

**Example:**
```javascript
pdfDoc.registerFontkit(fontkit);
const form = pdfDoc.getForm();
await form.enableUnicodeFont();
```

#### `setDefaultFont(font: PDFFont): void`

Sets a custom font as the default for all form fields.

**Example:**
```javascript
const customFont = await pdfDoc.embedFont(fontBytes);
form.setDefaultFont(customFont);
```

#### `hasUnicodeFont(): boolean`

Returns `true` if a Unicode font has been configured.

### PDFDocument Methods

#### `isRegisteredFontkit(): boolean`

Returns `true` if fontkit has been registered.

### Utility Functions

#### `getBundledUnicodeFontBytes(): Promise<Uint8Array>`

Get the bundled Noto Sans font data for manual embedding.

#### `preloadBundledUnicodeFont(): Promise<void>`

Preload the bundled font into cache for faster access.

#### `isBundledUnicodeFontLoaded(): boolean`

Check if the bundled font is already loaded.

## Bundled Font

This library includes **Noto Sans Regular** from Google Fonts:
- Full Unicode support for Latin, Cyrillic, and Greek scripts
- Clean, readable sans-serif design
- Licensed under [SIL Open Font License (OFL)](https://scripts.sil.org/OFL)
- Size: ~600KB (embedded in the library)

## Installation

```bash
npm install @raen64/pdf-lib-unicode @pdf-lib/fontkit
```

## Migrating from pdf-lib

This is a drop-in replacement. Just change your import:

```javascript
// Before
import { PDFDocument } from 'pdf-lib';

// After
import { PDFDocument } from '@raen64/pdf-lib-unicode';
```

Then add Unicode support where needed:

```javascript
pdfDoc.registerFontkit(fontkit);
const form = pdfDoc.getForm();
await form.enableUnicodeFont();
```

## Supported Characters

With Unicode font enabled, you can use any character supported by Noto Sans, including:

| Language | Example Characters |
|----------|-------------------|
| Polish | ą, ć, ę, ł, ń, ó, ś, ź, ż, Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż |
| Czech | ě, š, č, ř, ž, ý, á, í, é, ú, ů, Ě, Š, Č, Ř, Ž |
| Hungarian | ő, ű, Ő, Ű |
| Romanian | ă, â, î, ș, ț, Ă, Â, Î, Ș, Ț |
| Turkish | ğ, ı, ş, İ, Ğ, Ş |
| German | ä, ö, ü, ß, Ä, Ö, Ü |
| French | à, â, ç, é, è, ê, ë, î, ï, ô, ù, û, ü, ÿ |
| Russian | а-я, А-Я |
| Greek | α-ω, Α-Ω |
| And many more... |

## License

This fork maintains the original MIT license from pdf-lib.

The bundled Noto Sans font is licensed under the SIL Open Font License (OFL).
