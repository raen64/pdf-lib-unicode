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

// Load a Unicode-compatible font from CDN (or use your own)
const fontUrl = 'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSans/hinted/ttf/NotoSans-Regular.ttf';
const fontBytes = await fetch(fontUrl).then(r => r.arrayBuffer());

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

## Browser Usage (UMD)

For browser environments without a bundler, use the UMD build:

```html
<!-- Load pdf-lib UMD bundle -->
<script src="node_modules/@raen64/pdf-lib-unicode/dist/pdf-lib.js"></script>
<!-- Or from your own server -->
<script src="/path/to/pdf-lib.js"></script>

<!-- Load fontkit -->
<script src="https://unpkg.com/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js"></script>

<script>
  async function createPDF() {
    const { PDFDocument, rgb } = PDFLib;

    // Load font from CDN
    const fontUrl = 'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSans/hinted/ttf/NotoSans-Bold.ttf';
    const fontBytes = await fetch(fontUrl).then(r => r.arrayBuffer());

    // Create PDF with Unicode support
    const pdfDoc = await PDFDocument.create({ unicodeFont: fontBytes });
    pdfDoc.registerFontkit(fontkit);

    const form = await pdfDoc.getFormAsync();
    const font = form.getDefaultFont();

    const page = pdfDoc.addPage([600, 400]);
    page.drawText('Zażółć gęślą jaźń', {
      x: 50, y: 350, size: 24, font, color: rgb(0, 0, 0)
    });

    // Create form field with Polish text
    const nameField = form.createTextField('name');
    nameField.setText('Stanisław Wyspiański');
    nameField.addToPage(page, { x: 50, y: 250, width: 300, height: 30 });

    const pdfBytes = await pdfDoc.save();

    // Download or display the PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  }
</script>
```

## Recommended Fonts

Any TrueType (.ttf) or OpenType (.otf) font that includes the characters you need will work. We recommend [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) from Google Fonts - it's free, open source, and supports a wide range of characters.

**CDN URLs for Noto Sans:**

```javascript
// Regular
const regular = 'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSans/hinted/ttf/NotoSans-Regular.ttf';

// Bold
const bold = 'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSans/hinted/ttf/NotoSans-Bold.ttf';

// Italic
const italic = 'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSans/hinted/ttf/NotoSans-Italic.ttf';

// Bold Italic
const boldItalic = 'https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSans/hinted/ttf/NotoSans-BoldItalic.ttf';
```

Or download directly from: https://fonts.google.com/noto/specimen/Noto+Sans

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
