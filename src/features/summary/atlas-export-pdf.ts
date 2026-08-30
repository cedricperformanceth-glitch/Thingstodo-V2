import type { TripEntry } from '../trip/store';
import { categoryLabel, googleMapsUrl, groupedEntries, PDF_MIME, titleize } from './atlas-export-shared';

interface PdfLink { x: number; y: number; width: number; height: number; url: string; }
interface PdfPage { commands: string[]; links: PdfLink[]; }
interface PdfPalette { primary: [number, number, number]; secondary: [number, number, number]; }
interface PdfImage { hex: string; width: number; height: number; }
interface HandwrittenImage extends PdfImage { name: string; displayWidth: number; displayHeight: number; }

type PdfFont = 'F1' | 'F2' | 'F3';

const PAPER: [number, number, number] = [0.98, 0.965, 0.925];
const INK: [number, number, number] = [0.16, 0.18, 0.17];
const MUTED: [number, number, number] = [0.43, 0.43, 0.39];
const ATLAS_GREEN: [number, number, number] = [0.19, 0.33, 0.27];
const HANDWRITING_FONT = 'Caveat';
export const PDF_ANNOTATION_FONTS = ['Schoolbell', 'Indie Flower'] as const;

const DEFAULT_PALETTE: PdfPalette = {
  primary: ATLAS_GREEN,
  secondary: [0.56, 0.29, 0.24],
};

const COUNTRY_PALETTES: Record<string, PdfPalette> = {
  laos: {
    primary: [0.145, 0.22, 0.36],
    secondary: [0.60, 0.30, 0.26],
  },
  'sri-lanka': {
    primary: [0.22, 0.35, 0.27],
    secondary: [0.70, 0.48, 0.22],
  },
};

const asciiPdf = (value: string) => value.normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[–—]/g, '-').replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'").replace(/→/g, '->').replace(/[^\x20-\x7E]/g, '');
const pdfEscape = (value: string) => asciiPdf(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const pdfText = (
  page: PdfPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PdfFont = 'F1',
  color: [number, number, number] = INK,
) => {
  page.commands.push(`BT /${font} ${size} Tf ${color.join(' ')} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEscape(text)}) Tj ET`);
};

const pdfLine = (
  page: PdfPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: [number, number, number] = [0.76, 0.73, 0.66],
  width = 0.8,
) => {
  page.commands.push(`[] 0 d ${color.join(' ')} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
};

const pdfFill = (page: PdfPage, x: number, y: number, width: number, height: number, color: [number, number, number]) => {
  page.commands.push(`${color.join(' ')} rg ${x} ${y} ${width} ${height} re f`);
};

const pdfStrokeRect = (
  page: PdfPage,
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number],
  lineWidth = 0.5,
) => {
  page.commands.push(`[] 0 d ${color.join(' ')} RG ${lineWidth} w ${x} ${y} ${width} ${height} re S`);
};

const pdfCircle = (
  page: PdfPage,
  cx: number,
  cy: number,
  radius: number,
  color: [number, number, number],
  lineWidth = 1,
  dashed = false,
) => {
  const k = radius * 0.5522847498;
  const dash = dashed ? '[2.2 2.8] 0 d' : '[] 0 d';
  page.commands.push(
    `${dash} ${color.join(' ')} RG ${lineWidth} w `
    + `${(cx + radius).toFixed(2)} ${cy.toFixed(2)} m `
    + `${(cx + radius).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx + k).toFixed(2)} ${(cy + radius).toFixed(2)} ${cx.toFixed(2)} ${(cy + radius).toFixed(2)} c `
    + `${(cx - k).toFixed(2)} ${(cy + radius).toFixed(2)} ${(cx - radius).toFixed(2)} ${(cy + k).toFixed(2)} ${(cx - radius).toFixed(2)} ${cy.toFixed(2)} c `
    + `${(cx - radius).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx - k).toFixed(2)} ${(cy - radius).toFixed(2)} ${cx.toFixed(2)} ${(cy - radius).toFixed(2)} c `
    + `${(cx + k).toFixed(2)} ${(cy - radius).toFixed(2)} ${(cx + radius).toFixed(2)} ${(cy - k).toFixed(2)} ${(cx + radius).toFixed(2)} ${cy.toFixed(2)} c S`,
  );
};

const pdfDivider = (page: PdfPage, x1: number, x2: number, y: number, palette: PdfPalette) => {
  const shortEnd = Math.min(x1 + 92, x2);
  pdfLine(page, x1, y, shortEnd, y, palette.secondary, 0.62);
};

const paletteForCountry = (country = '') => COUNTRY_PALETTES[country.trim().toLowerCase()] ?? DEFAULT_PALETTE;

const formatExportDate = () => new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date());

const rgbCss = (color: [number, number, number]) => `rgb(${color.map((channel) => Math.round(channel * 255)).join(' ')})`;

const canvasToJpegImage = (canvas: HTMLCanvasElement, quality = 0.92): PdfImage => {
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const encoded = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const binary = atob(encoded);
  let hex = '';
  for (let index = 0; index < binary.length; index += 1) {
    hex += binary.charCodeAt(index).toString(16).padStart(2, '0');
  }
  return { hex: `${hex}>`, width: canvas.width, height: canvas.height };
};

const loadImageElement = async (src: string): Promise<HTMLImageElement> => {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  await new Promise<void>((resolve, reject) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => reject(new Error(`Atlas PDF asset could not be loaded: ${src}`)), { once: true });
  });
  return image;
};

const loadAssetAsJpeg = async (
  src: string,
  width: number,
  height: number,
  mode: 'cover' | 'contain' = 'cover',
  background: [number, number, number] = PAPER,
): Promise<PdfImage | null> => {
  if (typeof document === 'undefined' || typeof Image === 'undefined') return null;

  try {
    const image = await loadImageElement(src);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.fillStyle = rgbCss(background);
    context.fillRect(0, 0, width, height);

    const scale = mode === 'cover'
      ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
      : Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const drawX = (width - drawWidth) / 2;
    const drawY = (height - drawHeight) / 2;
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    return canvasToJpegImage(canvas, src.endsWith('.svg') ? 0.96 : 0.92);
  } catch {
    return null;
  }
};

const ensureCaveatReady = async () => {
  if (typeof document === 'undefined' || !document.fonts) return false;
  try {
    await document.fonts.load(`600 48px "${HANDWRITING_FONT}"`);
    await document.fonts.ready;
    return document.fonts.check(`600 48px "${HANDWRITING_FONT}"`);
  } catch {
    return false;
  }
};

const handwrittenKey = (text: string, size: number, color: [number, number, number]) => `${text}\u0000${size}\u0000${color.join(',')}`;

const renderHandwrittenImage = async (
  text: string,
  size: number,
  color: [number, number, number],
  name: string,
): Promise<HandwrittenImage | null> => {
  if (typeof document === 'undefined') return null;
  const caveatReady = await ensureCaveatReady();
  if (!caveatReady) return null;

  const scale = 4;
  const paddingX = Math.ceil(size * scale * 0.22);
  const paddingY = Math.ceil(size * scale * 0.24);
  const probe = document.createElement('canvas');
  const probeContext = probe.getContext('2d');
  if (!probeContext) return null;
  probeContext.font = `600 ${size * scale}px "${HANDWRITING_FONT}", cursive`;
  const measured = probeContext.measureText(text);
  const width = Math.max(8, Math.ceil(measured.width + (paddingX * 2)));
  const height = Math.max(8, Math.ceil((size * scale * 1.42) + (paddingY * 2)));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.fillStyle = rgbCss(PAPER);
  context.fillRect(0, 0, width, height);
  context.font = `600 ${size * scale}px "${HANDWRITING_FONT}", cursive`;
  context.fillStyle = rgbCss(color);
  context.textBaseline = 'alphabetic';
  context.fillText(text, paddingX, paddingY + (size * scale));

  return {
    ...canvasToJpegImage(canvas, 0.94),
    name,
    displayWidth: width / scale,
    displayHeight: height / scale,
  };
};

const loadStampImage = async (): Promise<PdfImage | null> => {
  if (typeof document === 'undefined' || typeof Image === 'undefined') return null;

  try {
    const image = await loadImageElement('/assets/navbar/things-to-do-atlas-logo-v2.webp');
    const size = 180;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;

    context.clearRect(0, 0, size, size);
    context.drawImage(image, 0, 0, size, size);
    const source = context.getImageData(0, 0, size, size);
    const data = source.data;
    const paper = [250, 246, 236];
    const ink = [49, 85, 69];

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3] / 255;
      const luminance = (0.2126 * data[index]) + (0.7152 * data[index + 1]) + (0.0722 * data[index + 2]);
      const strength = Math.max(0, Math.min(1, (245 - luminance) / 155)) * alpha * 0.92;
      data[index] = Math.round((paper[0] * (1 - strength)) + (ink[0] * strength));
      data[index + 1] = Math.round((paper[1] * (1 - strength)) + (ink[1] * strength));
      data[index + 2] = Math.round((paper[2] * (1 - strength)) + (ink[2] * strength));
      data[index + 3] = 255;
    }

    context.putImageData(source, 0, 0);
    return canvasToJpegImage(canvas, 0.88);
  } catch {
    return null;
  }
};

const drawStamp = (page: PdfPage, cx: number, cy: number, imageAvailable: boolean) => {
  pdfCircle(page, cx, cy, 36, ATLAS_GREEN, 2.1);
  pdfCircle(page, cx, cy, 31.5, ATLAS_GREEN, 0.9, true);
  pdfCircle(page, cx, cy, 22.5, ATLAS_GREEN, 0.65);
  pdfLine(page, cx - 27, cy - 19, cx + 27, cy - 19, ATLAS_GREEN, 0.65);
  pdfText(page, 'FIELD APPROVED', cx - 27.5, cy - 28, 5.4, 'F2', ATLAS_GREEN);
  if (imageAvailable) {
    page.commands.push(`q 38 0 0 38 ${(cx - 19).toFixed(2)} ${(cy - 16).toFixed(2)} cm /ImStamp Do Q`);
  } else {
    pdfText(page, 'THINGS', cx - 17.5, cy + 5, 6.1, 'F2', ATLAS_GREEN);
    pdfText(page, 'TO DO', cx - 14.5, cy - 3, 6.1, 'F2', ATLAS_GREEN);
    pdfText(page, 'ATLAS', cx - 16, cy - 11, 6.1, 'F2', ATLAS_GREEN);
  }
};

export const buildPdf = async (entries: TripEntry[]): Promise<Blob> => {
  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const SHEET_WIDTH = PAGE_W - 80;
  const SHEET_LEFT = 24;
  const SHEET_RIGHT = SHEET_LEFT + SHEET_WIDTH;
  const LEFT = SHEET_LEFT + 27;
  const RIGHT = SHEET_RIGHT - 27;
  const COVER_SUMMARY_WIDTH = 318;
  const COVER_SUMMARY_HEIGHT = 128;
  const COVER_SUMMARY_X = (PAGE_W - COVER_SUMMARY_WIDTH) / 2;
  const COVER_SUMMARY_Y = 36;
  const pages: PdfPage[] = [];
  const summaryUrl = new URL('/summary', window.location.origin).toString();
  const countries = groupedEntries(entries);
  const multiCountry = countries.size > 1;
  const [stampImage, coverImage, coverSummaryImage, binderImage] = await Promise.all([
    loadStampImage(),
    loadAssetAsJpeg('/assets/PDF/couverture.webp', 1190, 1684, 'cover'),
    loadAssetAsJpeg('/assets/shared/pdf/atlas-cover-summary-card.svg', 1240, 500, 'contain'),
    loadAssetAsJpeg('/assets/shared/pdf/atlas-binder-edge.svg', 180, 1520, 'contain'),
  ]);
  const uniqueCountries = [...countries.keys()];
  const coverSummaryRows = [...countries.entries()].map(([country, cities]) => {
    let count = 0;
    cities.forEach((categories) => categories.forEach((items) => { count += items.length; }));
    return { country, count };
  });
  const handwritingAssets = new Map<string, HandwrittenImage>();

  const addHandwritingAsset = async (text: string, size: number, color: [number, number, number]) => {
    const key = handwrittenKey(text, size, color);
    if (handwritingAssets.has(key)) return;
    const asset = await renderHandwrittenImage(text, size, color, `Hw${handwritingAssets.size + 1}`);
    if (asset) handwritingAssets.set(key, asset);
  };

  const titleColor: [number, number, number] = [0.12, 0.2, 0.16];
  const headingCountry = uniqueCountries.length === 1 ? titleize(uniqueCountries[0]) : '';
  const headingLabel = headingCountry ? `My Atlas ${headingCountry}` : 'My Atlas';
  await addHandwritingAsset(headingLabel, 25.5, titleColor);
  await addHandwritingAsset('Contents', 17.5, titleColor);
  for (const [country, cities] of countries) {
    if (multiCountry) await addHandwritingAsset(`My Atlas ${titleize(country)}`, 20, titleColor);
    for (const city of cities.keys()) await addHandwritingAsset(titleize(city), 16.5, titleColor);
  }

  const pdfHandwrittenText = (
    target: PdfPage,
    text: string,
    x: number,
    baselineY: number,
    size: number,
    color: [number, number, number] = titleColor,
  ) => {
    const asset = handwritingAssets.get(handwrittenKey(text, size, color));
    if (!asset) {
      pdfText(target, text, x, baselineY, size * 0.84, 'F3', color);
      return;
    }
    const imageY = baselineY - (asset.displayHeight * 0.32);
    target.commands.push(
      `q ${asset.displayWidth.toFixed(2)} 0 0 ${asset.displayHeight.toFixed(2)} ${x.toFixed(2)} ${imageY.toFixed(2)} cm /${asset.name} Do Q`,
    );
  };

  let page!: PdfPage;
  let y = PAGE_H - 112;
  let currentPalette = DEFAULT_PALETTE;

  const addCoverPage = () => {
    page = { commands: [], links: [] };
    pages.push(page);
    if (coverImage) {
      page.commands.push(`q ${PAGE_W.toFixed(2)} 0 0 ${PAGE_H.toFixed(2)} 0 0 cm /ImCover Do Q`);
    } else {
      pdfFill(page, 0, 0, PAGE_W, PAGE_H, PAPER);
      pdfText(page, 'MY ATLAS', 62, PAGE_H - 104, 28, 'F2', ATLAS_GREEN);
    }

    if (coverSummaryImage) {
      page.commands.push(
        `q ${COVER_SUMMARY_WIDTH.toFixed(2)} 0 0 ${COVER_SUMMARY_HEIGHT.toFixed(2)} ${COVER_SUMMARY_X.toFixed(2)} ${COVER_SUMMARY_Y.toFixed(2)} cm /ImCoverSummary Do Q`,
      );
    } else {
      pdfFill(page, COVER_SUMMARY_X, COVER_SUMMARY_Y, COVER_SUMMARY_WIDTH, COVER_SUMMARY_HEIGHT, PAPER);
      pdfStrokeRect(page, COVER_SUMMARY_X, COVER_SUMMARY_Y, COVER_SUMMARY_WIDTH, COVER_SUMMARY_HEIGHT, [0.79, 0.74, 0.66], 0.5);
    }

    const cardLeft = COVER_SUMMARY_X + 24;
    const cardRight = COVER_SUMMARY_X + COVER_SUMMARY_WIDTH - 24;
    pdfHandwrittenText(page, 'Contents', cardLeft, COVER_SUMMARY_Y + COVER_SUMMARY_HEIGHT - 36, 17.5);
    pdfText(page, 'YOUR SAVED ATLAS', cardRight - 75, COVER_SUMMARY_Y + COVER_SUMMARY_HEIGHT - 30, 5.8, 'F2', ATLAS_GREEN);

    const visibleRows = coverSummaryRows.slice(0, 4);
    const rowGap = visibleRows.length > 2 ? 18 : 22;
    let rowY = COVER_SUMMARY_Y + COVER_SUMMARY_HEIGHT - 66;
    visibleRows.forEach(({ country, count }, index) => {
      const palette = paletteForCountry(country);
      pdfCircle(page, cardLeft + 3.5, rowY + 2.8, 2.3, palette.secondary, 1.1);
      pdfText(page, titleize(country), cardLeft + 14, rowY, 9.6, 'F2', INK);
      const countLabel = `${count} saved ${count === 1 ? 'place' : 'places'}`;
      pdfText(page, countLabel, cardRight - 78, rowY, 7.6, 'F1', MUTED);
      if (index < visibleRows.length - 1) {
        pdfLine(page, cardLeft + 14, rowY - 7, cardRight, rowY - 7, [0.83, 0.80, 0.74], 0.38);
      }
      rowY -= rowGap;
    });

    if (coverSummaryRows.length > visibleRows.length) {
      pdfText(page, `+ ${coverSummaryRows.length - visibleRows.length} more`, cardLeft + 14, COVER_SUMMARY_Y + 18, 6.8, 'F1', MUTED);
    }
  };

  const addPage = () => {
    page = { commands: [], links: [] };
    pages.push(page);
    pdfFill(page, 0, 0, PAGE_W, PAGE_H, PAPER);
    pdfStrokeRect(page, SHEET_LEFT, 27, SHEET_WIDTH, PAGE_H - 54, [0.82, 0.79, 0.72], 0.38);
    if (binderImage) page.commands.push('q 60 0 0 610 -5 116 cm /ImBinder Do Q');
    pdfText(page, 'THINGS TO DO ATLAS', LEFT, PAGE_H - 43, 8.2, 'F2', ATLAS_GREEN);
    pdfDivider(page, LEFT, RIGHT, PAGE_H - 57, currentPalette);
    y = PAGE_H - 88;
  };

  const addFooter = (target: PdfPage, pageNumber: number) => {
    pdfLine(target, LEFT, 49, RIGHT, 49, [0.78, 0.75, 0.69], 0.55);
    pdfText(target, 'Things To Do Atlas - Your Atlas', LEFT, 31, 7.1, 'F2', ATLAS_GREEN);
    target.links.push({ x: LEFT, y: 27, width: 126, height: 12, url: summaryUrl });
    pdfText(target, 'FIELD COPY', (SHEET_LEFT + (SHEET_WIDTH / 2)) - 18, 31, 6.2, 'F1', [0.53, 0.51, 0.47]);
    pdfText(target, `Page ${pageNumber}`, RIGHT - 34, 31, 7.1, 'F1', [0.48, 0.48, 0.45]);
  };

  const ensure = (height: number) => {
    if (y - height >= 72) return;
    addFooter(page, pages.length);
    addPage();
  };

  if (uniqueCountries.length === 1) currentPalette = paletteForCountry(uniqueCountries[0]);
  addCoverPage();
  addPage();

  pdfHandwrittenText(page, headingLabel, LEFT, y, 25.5);
  y -= 27;
  pdfText(page, `Your journey so far - ${entries.length} saved ${entries.length === 1 ? 'place' : 'places'}.`, LEFT, y, 10, 'F1', MUTED);
  y -= 15;
  pdfDivider(page, LEFT, RIGHT, y, currentPalette);
  y -= 22;

  countries.forEach((cities, country) => {
    currentPalette = paletteForCountry(country);
    if (multiCountry) {
      ensure(49);
      pdfHandwrittenText(page, `My Atlas ${titleize(country)}`, LEFT, y, 20);
      y -= 12;
      pdfDivider(page, LEFT, RIGHT, y, currentPalette);
      y -= 21;
    }

    cities.forEach((categories, city) => {
      ensure(50);
      pdfHandwrittenText(page, titleize(city), LEFT, y, 16.5);
      y -= 10;
      pdfDivider(page, LEFT, RIGHT, y, currentPalette);
      y -= 18;

      categories.forEach((items, category) => {
        ensure(28);
        pdfText(page, categoryLabel(category).toUpperCase(), LEFT, y, 8.2, 'F2', currentPalette.secondary);
        y -= 17;
        items.forEach((entry) => {
          ensure(27);
          const name = entry.name.length > 46 ? `${entry.name.slice(0, 43)}...` : entry.name;
          pdfText(page, name, LEFT + 8, y, 9.7);
          pdfText(page, 'Google Maps ->', RIGHT - 79, y, 8.3, 'F2', currentPalette.primary);
          page.links.push({ x: RIGHT - 82, y: y - 3, width: 85, height: 13, url: googleMapsUrl(entry) });
          y -= 18;
        });
        y -= 6;
      });
      y -= 8;
    });
  });

  ensure(148);
  pdfText(page, 'Thanks for letting Things To Do Atlas travel with you.', LEFT, y, 9.5, 'F2', [0.12, 0.2, 0.16]);
  y -= 15;
  pdfText(page, 'Keep exploring, stay curious, and have a beautiful journey.', LEFT, y, 9, 'F1', MUTED);
  y -= 23;
  pdfText(page, 'Open Your Atlas ->', LEFT, y, 8.5, 'F2', ATLAS_GREEN);
  page.links.push({ x: LEFT, y: y - 3, width: 84, height: 13, url: summaryUrl });

  y -= 39;
  pdfText(page, 'REVIEWED & APPROVED', LEFT, y, 7.2, 'F2', [0.25, 0.25, 0.23]);
  pdfLine(page, LEFT, y - 7, LEFT + 82, y - 7, [0.12, 0.12, 0.11], 0.42);
  pdfText(page, formatExportDate(), LEFT, y - 24, 8.2, 'F1', MUTED);
  drawStamp(page, RIGHT - 45, y - 10, Boolean(stampImage));
  addFooter(page, pages.length);

  const objects: string[] = [''];
  const reserve = () => { objects.push(''); return objects.length - 1; };
  const catalogId = reserve();
  const pagesId = reserve();
  const regularFontId = reserve();
  const boldFontId = reserve();
  const obliqueFontId = reserve();
  const stampImageId = stampImage ? reserve() : 0;
  const coverImageId = coverImage ? reserve() : 0;
  const coverSummaryImageId = coverSummaryImage ? reserve() : 0;
  const binderImageId = binderImage ? reserve() : 0;
  const handwritingImageIds = new Map<string, number>();
  objects[regularFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[boldFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  objects[obliqueFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>';

  const writeJpegObject = (id: number, image: PdfImage) => {
    const stream = `${image.hex}\n`;
    const streamLength = new TextEncoder().encode(stream).length;
    objects[id] = `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${streamLength} >>\nstream\n${stream}endstream`;
  };

  if (stampImage && stampImageId) writeJpegObject(stampImageId, stampImage);
  if (coverImage && coverImageId) writeJpegObject(coverImageId, coverImage);
  if (coverSummaryImage && coverSummaryImageId) writeJpegObject(coverSummaryImageId, coverSummaryImage);
  if (binderImage && binderImageId) writeJpegObject(binderImageId, binderImage);
  handwritingAssets.forEach((asset) => {
    const id = reserve();
    handwritingImageIds.set(asset.name, id);
    writeJpegObject(id, asset);
  });

  const pageIds: number[] = [];
  pages.forEach((pdfPage) => {
    const content = `${pdfPage.commands.join('\n')}\n`;
    const contentId = reserve();
    objects[contentId] = `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}endstream`;
    const annotationIds = pdfPage.links.map((link) => {
      const id = reserve();
      objects[id] = `<< /Type /Annot /Subtype /Link /Rect [${link.x.toFixed(2)} ${link.y.toFixed(2)} ${(link.x + link.width).toFixed(2)} ${(link.y + link.height).toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${pdfEscape(link.url)}) >> >>`;
      return id;
    });
    const pageId = reserve();
    const annots = annotationIds.length ? `/Annots [${annotationIds.map((id) => `${id} 0 R`).join(' ')}]` : '';
    const xObjectEntries: string[] = [];
    if (stampImageId) xObjectEntries.push(`/ImStamp ${stampImageId} 0 R`);
    if (coverImageId) xObjectEntries.push(`/ImCover ${coverImageId} 0 R`);
    if (coverSummaryImageId) xObjectEntries.push(`/ImCoverSummary ${coverSummaryImageId} 0 R`);
    if (binderImageId) xObjectEntries.push(`/ImBinder ${binderImageId} 0 R`);
    handwritingImageIds.forEach((id, name) => xObjectEntries.push(`/${name} ${id} 0 R`));
    const xObjects = xObjectEntries.length ? `/XObject << ${xObjectEntries.join(' ')} >>` : '';
    objects[pageId] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R /F3 ${obliqueFontId} 0 R >> ${xObjects} >> /Contents ${contentId} 0 R ${annots} >>`;
    pageIds.push(pageId);
  });

  objects[pagesId] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets = new Array(objects.length).fill(0);
  let offset = 0;
  const push = (text: string) => { const bytes = encoder.encode(text); parts.push(bytes); offset += bytes.length; };
  push('%PDF-1.4\n');
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = offset;
    push(`${id} 0 obj\n${objects[id]}\nendobj\n`);
  }
  const xrefOffset = offset;
  push(`xref\n0 ${objects.length}\n0000000000 65535 f \n`);
  for (let id = 1; id < objects.length; id += 1) push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  push(`trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob(parts, { type: PDF_MIME });
};
