/**
 * Example: Polish Diacritics Support
 *
 * This example demonstrates how to use the Unicode font support
 * to create PDFs with Polish characters (ą, ę, ł, ś, etc.)
 *
 * Usage:
 *   npx ts-node examples/polish-diacritics.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb } from '../src';

async function createPolishPdf() {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // IMPORTANT: Register fontkit to enable custom font embedding
  pdfDoc.registerFontkit(fontkit);

  // Get the form and enable Unicode font support
  const form = pdfDoc.getForm();
  await form.enableUnicodeFont();

  // Add a page
  const page = pdfDoc.addPage([600, 400]);

  // Get the Unicode font for drawing text directly on the page
  const font = form.getDefaultFont();

  // Draw some Polish text on the page
  const polishText = 'Zażółć gęślą jaźń';
  const polishAlphabet = 'ą ć ę ł ń ó ś ź ż';
  const pangram = 'Pchnąć w tę łódź jeża lub ośm skrzyń fig';

  page.drawText('Polish Diacritics Test', {
    x: 50,
    y: 350,
    size: 24,
    font,
    color: rgb(0, 0, 0.8),
  });

  page.drawText(`Polish pangram: ${polishText}`, {
    x: 50,
    y: 300,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Special characters: ${polishAlphabet}`, {
    x: 50,
    y: 270,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Another pangram: ${pangram}`, {
    x: 50,
    y: 240,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  // Create a text field with Polish text
  const textField = form.createTextField('polish.name');
  textField.setText('Stanisław Wyspiański');
  textField.addToPage(page, {
    x: 50,
    y: 150,
    width: 300,
    height: 30,
    borderColor: rgb(0, 0, 0),
    backgroundColor: rgb(0.95, 0.95, 0.95),
  });

  page.drawText('Form field with Polish name:', {
    x: 50,
    y: 190,
    size: 12,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Create another text field for user input
  const addressField = form.createTextField('polish.address');
  addressField.setText('ul. Świętojańska 15, Gdańsk');
  addressField.addToPage(page, {
    x: 50,
    y: 80,
    width: 300,
    height: 30,
    borderColor: rgb(0, 0, 0),
    backgroundColor: rgb(0.95, 0.95, 0.95),
  });

  page.drawText('Address with Polish characters:', {
    x: 50,
    y: 120,
    size: 12,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();

  // Write to file
  const outputPath = path.join(__dirname, 'polish-output.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`PDF created successfully: ${outputPath}`);
  console.log('Open the PDF to verify Polish characters are displayed correctly.');
}

// Also demonstrate the alternative approach: manual font setting
async function createPolishPdfManualFont() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Load a custom font (could be any Unicode-compatible font)
  // For this example, we use the bundled font directly
  const { getBundledUnicodeFontBytes } = await import('../src/fonts');
  const fontBytes = await getBundledUnicodeFontBytes();
  const unicodeFont = await pdfDoc.embedFont(fontBytes);

  // Set it as the default font for forms
  const form = pdfDoc.getForm();
  form.setDefaultFont(unicodeFont);

  // Now create form fields - they will use the Unicode font
  const page = pdfDoc.addPage([600, 200]);

  const nameField = form.createTextField('name');
  nameField.setText('Łukasz Żółkiewski');
  nameField.addToPage(page, {
    x: 50,
    y: 100,
    width: 300,
    height: 30,
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, 'polish-manual-font.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`PDF with manual font created: ${outputPath}`);
}

// Run the examples
async function main() {
  try {
    console.log('Creating PDF with Polish diacritics...\n');

    console.log('Method 1: Using enableUnicodeFont()');
    await createPolishPdf();

    console.log('\nMethod 2: Using setDefaultFont() with custom font');
    await createPolishPdfManualFont();

    console.log('\nAll examples completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
