# @raen64/pdf-lib-unicode

A fork of [pdf-lib](https://github.com/Hopding/pdf-lib) with improved Unicode support for European languages (Polish, Czech, Hungarian, etc.).

## Why This Fork?

The original `pdf-lib` library uses WinAnsi encoding (Windows-1252) for standard fonts, which doesn't support characters like:

- Polish: ą, ć, ę, ł, ń, ó, ś, ź, ż
- Czech: ě, š, č, ř, ž, ý, á, í, é, ú, ů
- Hungarian: ő, ű
- And many other Central/Eastern European characters

This fork provides a simple API to enable Unicode support with any TrueType/OpenType font.

## Installation

```bash
npm install github:raen64/pdf-lib-unicode @pdf-lib/fontkit
```

## Quick Start

### Simplest Usage (Recommended)

```javascript
import { PDFDocument } from '@raen64/pdf-lib-unicode';
import fontkit from '@pdf-lib/fontkit';

// Load a Unicode-compatible font (e.g., Noto Sans from Google Fonts)
const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());

// Create document with unicodeFont option
const pdfDoc = await PDFDocument.create({ unicodeFont: fontBytes });
pdfDoc.registerFontkit(fontkit);

// Use getFormAsync() to auto-initialize Unicode font
const form = await pdfDoc.getFormAsync();

// Create form fields - Polish characters work!
const nameField = form.createTextField('name');
nameField.setText('Zażółć gęślą jaźń');
nameField.addToPage(pdfDoc.addPage());

// Save
const pdfBytes = await pdfDoc.save();
```

### Loading Existing PDF with Unicode Support

```javascript
import { PDFDocument } from '@raen64/pdf-lib-unicode';
import fontkit from '@pdf-lib/fontkit';

const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());

// Load existing PDF with unicodeFont and updateExistingFields options
const pdfDoc = await PDFDocument.load(existingPdfBytes, {
  unicodeFont: fontBytes,
  updateExistingFields: true  // Update fonts on existing form fields
});
pdfDoc.registerFontkit(fontkit);

// Use getFormAsync() to auto-initialize Unicode font
const form = await pdfDoc.getFormAsync();

// Fill existing form fields - Polish characters work!
const field = form.getTextField('name');
field.setText('Świętojańska');

// Save
const pdfBytes = await pdfDoc.save();
```

### Manual Approach (More Control)

```javascript
import { PDFDocument } from '@raen64/pdf-lib-unicode';
import fontkit from '@pdf-lib/fontkit';

const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());

const pdfDoc = await PDFDocument.create();
pdfDoc.registerFontkit(fontkit);

// Manually set Unicode font
const form = pdfDoc.getForm();
await form.setUnicodeFont(fontBytes);

// Or with options for existing PDFs
await form.setUnicodeFont(fontBytes, { updateExistingFields: true });

// Create form fields
const nameField = form.createTextField('name');
nameField.setText('Zażółć gęślą jaźń');
nameField.addToPage(pdfDoc.addPage());

const pdfBytes = await pdfDoc.save();
```

### Drawing Unicode Text on Page

```javascript
import { PDFDocument } from '@raen64/pdf-lib-unicode';
import fontkit from '@pdf-lib/fontkit';

const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());
const pdfDoc = await PDFDocument.create({ unicodeFont: fontBytes });
pdfDoc.registerFontkit(fontkit);

const form = await pdfDoc.getFormAsync();

// Get the Unicode font for drawing on pages
const unicodeFont = form.getDefaultFont();

const page = pdfDoc.addPage();
page.drawText('Żółta łódź w Gdańsku', {
  x: 50,
  y: 700,
  size: 24,
  font: unicodeFont,  // Must pass font explicitly for drawText
});

const pdfBytes = await pdfDoc.save();
```

## API Reference

### PDFDocument Extensions

#### `PDFDocument.create({ unicodeFont: fontBytes })`

Create a new PDF document with Unicode support enabled.

```javascript
const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());
const pdfDoc = await PDFDocument.create({ unicodeFont: fontBytes });
pdfDoc.registerFontkit(fontkit);
const form = await pdfDoc.getFormAsync(); // Auto-initializes Unicode font
```

#### `PDFDocument.load(bytes, { unicodeFont, updateExistingFields })`

Load an existing PDF with Unicode support. Use `updateExistingFields: true` to automatically update fonts on existing form fields.

```javascript
const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());
const pdfDoc = await PDFDocument.load(existingPdfBytes, {
  unicodeFont: fontBytes,
  updateExistingFields: true
});
pdfDoc.registerFontkit(fontkit);
const form = await pdfDoc.getFormAsync();
```

#### `pdfDoc.getFormAsync()`

Get the form with automatic Unicode font initialization (when `unicodeFont` was passed to create/load).

```javascript
const form = await pdfDoc.getFormAsync();
// Unicode font is now ready if unicodeFont was provided
```

### PDFForm Extensions

#### `form.setUnicodeFont(fontBytes, options?)`

Set a Unicode font for form fields using the provided font bytes.

```javascript
const fontBytes = await fetch('/fonts/NotoSans-Regular.ttf').then(r => r.arrayBuffer());
await form.setUnicodeFont(fontBytes);

// With options for existing PDFs
await form.setUnicodeFont(fontBytes, {
  updateExistingFields: true  // Update fonts on existing form fields
});
```

#### `form.setDefaultFont(font)`

Set a custom font as the default for all form fields.

```javascript
const myFont = await pdfDoc.embedFont(myFontBytes);
form.setDefaultFont(myFont);
```

#### `form.getDefaultFont()`

Get the current default font (Unicode font if set, otherwise Helvetica).

```javascript
const font = form.getDefaultFont();
page.drawText('Text', { font });
```

#### `form.hasUnicodeFont()`

Check if Unicode font is set.

```javascript
if (form.hasUnicodeFont()) {
  // Unicode is ready
}
```

### PDFField Extensions

#### `field.setFont(font)`

Set the font for an individual field.

```javascript
const unicodeFont = form.getDefaultFont();
const field = form.getTextField('name');
field.setFont(unicodeFont);
field.setText('Zażółć gęślą jaźń');
```

## Differences from Original pdf-lib

| Feature | pdf-lib | @raen64/pdf-lib-unicode |
|---------|---------|-------------------------|
| Standard fonts encoding | WinAnsi only | WinAnsi + Unicode option |
| Custom font for forms | Manual embedding | `setUnicodeFont()` API |
| fontkit | Optional | Required for Unicode features |

## Recommended Fonts

For Unicode support, we recommend [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) from Google Fonts. It's free, open source, and supports a wide range of characters.

Download from: https://fonts.google.com/noto/specimen/Noto+Sans

## Compatibility

This fork maintains full API compatibility with pdf-lib 1.17.x. All original pdf-lib code should work without changes.

- **Node.js**: 18+
- **Browsers**: All modern browsers
- **Deno**: Supported
- **React Native**: Supported

## Original pdf-lib Documentation

For general pdf-lib usage (creating pages, embedding images, etc.), refer to the original documentation:

- [pdf-lib Documentation](https://pdf-lib.js.org/docs/api/)
- [Original README](https://github.com/Hopding/pdf-lib#readme)

## License

MIT License (same as original pdf-lib)

## Credits

- Original [pdf-lib](https://github.com/Hopding/pdf-lib) by Andrew Dillon (Hopding)
