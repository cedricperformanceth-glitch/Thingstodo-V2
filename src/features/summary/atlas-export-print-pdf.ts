import type { TripEntry, TripPrintMeta } from '../trip/store';
import { categoryLabel, PDF_MIME, titleize } from './atlas-export-shared';

type PdfFont = 'F1' | 'F2' | 'F3' | 'F4';
interface PdfPage { commands: string[]; }
interface PdfImage { hex: string; width: number; height: number; }
interface OrderedCity { country: string; city: string; entries: TripEntry[]; }
interface PrintFact { label: string; value: string; }
interface SummaryEntityMeta { printMeta?: TripPrintMeta; }

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_X = 32;
const TOP = 791;
const BOTTOM = 43;
const COLUMN_GAP = 18;
const COLUMN_W = (PAGE_W - (MARGIN_X * 2) - COLUMN_GAP) / 2;
const COLUMN_X = [MARGIN_X, MARGIN_X + COLUMN_W + COLUMN_GAP] as const;
const INK = 0.08;
const MUTED = 0.36;
const LIGHT = 0.72;
const SUMMARY_META_URLS = ['/summary-media.json', '/api/summary-media.json'] as const;
const LAOS_MAP_SRC = '/assets/PDF/carte-du-laos-pdf.webp';
const LAOS_MAP_DISPLAY_W = 68;
const LAOS_MAP_DISPLAY_H = 82;
const LAOS_MAP_X = PAGE_W - MARGIN_X - LAOS_MAP_DISPLAY_W;
const LAOS_MAP_Y = TOP - LAOS_MAP_DISPLAY_H + 1;
const FIRST_PAGE_RIGHT_TOP = LAOS_MAP_Y - 10;

const asciiPdf = (value: string) => value.normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[–—]/g, '-')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/→/g, '->')
  .replace(/[^\x20-\x7E]/g, '');

const pdfEscape = (value: string) => asciiPdf(value)
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const pdfText = (
  page: PdfPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PdfFont = 'F1',
  gray = INK,
) => {
  page.commands.push(`BT /${font} ${size} Tf ${gray} g 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEscape(text)}) Tj ET`);
};

const pdfLine = (page: PdfPage, x1: number, y1: number, x2: number, y2: number, gray = LIGHT, width = 0.45) => {
  page.commands.push(`[] 0 d ${gray} G ${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
};

const canvasToJpegImage = (canvas: HTMLCanvasElement, quality = 0.9): PdfImage => {
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
    image.addEventListener('error', () => reject(new Error(`Printable PDF asset could not be loaded: ${src}`)), { once: true });
  });
  return image;
};

const loadGrayscaleAssetAsJpeg = async (src: string, width: number, height: number): Promise<PdfImage | null> => {
  if (typeof document === 'undefined' || typeof Image === 'undefined') return null;
  try {
    const image = await loadImageElement(src);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

    const pixels = context.getImageData(0, 0, width, height);
    for (let index = 0; index < pixels.data.length; index += 4) {
      const gray = Math.round(
        (pixels.data[index] * 0.2126)
        + (pixels.data[index + 1] * 0.7152)
        + (pixels.data[index + 2] * 0.0722),
      );
      pixels.data[index] = gray;
      pixels.data[index + 1] = gray;
      pixels.data[index + 2] = gray;
      pixels.data[index + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    return canvasToJpegImage(canvas, 0.9);
  } catch {
    return null;
  }
};

const ellipsis = (value: string, max: number) => {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, Math.max(1, max - 3)).trimEnd()}...`;
};

const wrapText = (value: string, maxChars: number, maxLines: number) => {
  const words = asciiPdf(value).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  const consumed = lines.join(' ').length;
  const original = words.join(' ');
  if (lines.length === maxLines && consumed < original.length) {
    lines[lines.length - 1] = ellipsis(lines[lines.length - 1], Math.max(8, maxChars - 1));
  }
  return lines.slice(0, maxLines);
};

const savedAtNumber = (entry: TripEntry) => {
  const value = Date.parse(entry.savedAt);
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
};

const orderedCities = (entries: TripEntry[]): OrderedCity[] => {
  const sorted = [...entries].sort((a, b) => savedAtNumber(a) - savedAtNumber(b));
  const byKey = new Map<string, OrderedCity>();
  sorted.forEach((entry) => {
    const country = entry.country || 'atlas';
    const city = entry.city || 'saved-places';
    const key = `${country}\u0000${city}`;
    const group = byKey.get(key) ?? { country, city, entries: [] };
    group.entries.push(entry);
    byKey.set(key, group);
  });
  return [...byKey.values()];
};

const categoryIs = (entry: TripEntry, values: string[]) => {
  const category = entry.category.trim().toLowerCase();
  return values.some((value) => category === value || category.includes(value));
};

const costFact = (entry: TripEntry): PrintFact => {
  if (entry.printMeta?.costType === 'free') return { label: 'COST', value: 'Free' };
  if (entry.printMeta?.costType === 'paid') return { label: 'COST', value: 'Paid' };
  if (categoryIs(entry, ['restaurant', 'cafe', 'accommodation', 'guesthouse', 'hotel', 'rental', 'gym'])) {
    return { label: 'COST', value: 'Paid' };
  }
  if (categoryIs(entry, ['market'])) return { label: 'COST', value: 'Free entry' };
  return { label: 'COST', value: 'Varies' };
};

const accessFact = (entry: TripEntry): PrintFact => {
  const source = entry.printMeta?.gettingThere?.toLowerCase() ?? '';
  if (/boat|ferry/.test(source)) return { label: 'ACCESS', value: 'Boat' };
  if (/scooter|motorbike|motorcycle/.test(source)) return { label: 'ACCESS', value: 'Motorized' };
  if (/bicycle|bike|cycling|cycle/.test(source)) return { label: 'ACCESS', value: 'Bike' };
  if (/walk|walking|on foot/.test(source)) return { label: 'ACCESS', value: 'Walk' };
  if (/tuk.?tuk|taxi|car|van|bus|transfer|driver/.test(source)) return { label: 'ACCESS', value: 'Transport' };
  if (source && source.length <= 18) return { label: 'ACCESS', value: titleize(source) };
  if (entry.printMeta?.address) return { label: 'ACCESS', value: 'See address' };
  return { label: 'ACCESS', value: 'Check access' };
};

const timingFact = (entry: TripEntry): PrintFact => {
  const duration = entry.printMeta?.duration?.trim();
  if (entry.kind === 'thing-to-do' && duration) return { label: 'TIME', value: ellipsis(duration, 18) };
  const openingHours = entry.printMeta?.openingHours?.trim();
  if (openingHours) return { label: 'OPEN', value: ellipsis(openingHours, 18) };
  const bestTime = entry.printMeta?.bestTime?.trim();
  if (bestTime) return { label: 'WHEN', value: ellipsis(bestTime, 18) };
  return { label: 'WHEN', value: 'Flexible' };
};

const factsForEntry = (entry: TripEntry) => [costFact(entry), accessFact(entry), timingFact(entry)];

const factText = (fact: PrintFact) => `${fact.label}: ${fact.value}`;

const entryMetrics = (entry: TripEntry) => {
  const nameLines = wrapText(entry.name, 39, 2);
  const descriptionLines = wrapText(entry.shortDescription, 58, 2);
  const addressLines = entry.printMeta?.address ? wrapText(entry.printMeta.address, 61, 1) : [];
  const height = 10
    + (nameLines.length * 11)
    + (descriptionLines.length * 9)
    + (addressLines.length * 8)
    + 14;
  return { nameLines, descriptionLines, addressLines, height: Math.max(47, height) };
};

const entryIndexKeys = (entry: TripEntry) => [
  `${entry.country}:${entry.city}:${entry.id}`,
  `id:${entry.id}`,
  ...(entry.slug ? [`slug:${entry.slug}`] : []),
];

const hydratePrintableEntries = async (entries: TripEntry[]) => {
  if (!entries.some((entry) => !entry.printMeta)) return entries;

  for (const url of SUMMARY_META_URLS) {
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) continue;
      const index = await response.json() as Record<string, SummaryEntityMeta>;
      return entries.map((entry) => {
        if (entry.printMeta) return entry;
        const meta = entryIndexKeys(entry)
          .map((key) => index[key])
          .find((candidate) => candidate?.printMeta);
        return meta?.printMeta ? { ...entry, printMeta: meta.printMeta } : entry;
      });
    } catch {
      // Try the compatibility endpoint below.
    }
  }

  return entries;
};

const renderHeader = (page: PdfPage, pageNumber: number) => {
  pdfText(page, 'THINGS TO DO ATLAS / PRINT FIELD COPY', MARGIN_X, PAGE_H - 23, 6.7, 'F2', MUTED);
  pdfText(page, `PAGE ${pageNumber}`, PAGE_W - MARGIN_X - 31, PAGE_H - 23, 6.7, 'F2', MUTED);
  pdfLine(page, MARGIN_X, PAGE_H - 29, PAGE_W - MARGIN_X, PAGE_H - 29, 0.58, 0.5);
  pdfLine(page, PAGE_W / 2, BOTTOM + 9, PAGE_W / 2, TOP + 4, 0.88, 0.3);
};

const renderFooter = (page: PdfPage) => {
  pdfLine(page, MARGIN_X, 31, PAGE_W - MARGIN_X, 31, 0.68, 0.4);
  pdfText(page, 'Offline field copy', MARGIN_X, 18, 6.2, 'F3', MUTED);
  pdfText(page, 'Keep this sheet with your travel documents.', PAGE_W - MARGIN_X - 158, 18, 6.2, 'F3', MUTED);
};

const renderCityHeading = (page: PdfPage, group: OrderedCity, x: number, y: number, continued = false) => {
  const country = titleize(group.country).toUpperCase();
  const city = titleize(group.city);
  pdfText(page, country, x, y + 7, 6.4, 'F2', MUTED);
  pdfText(page, continued ? `${city} / continued` : city, x, y - 7, continued ? 11.5 : 17, continued ? 'F3' : 'F4', INK);
  pdfLine(page, x, y - 14, x + COLUMN_W, y - 14, 0.46, 0.55);
  return y - 27;
};

const renderEntry = (page: PdfPage, entry: TripEntry, x: number, y: number) => {
  const metrics = entryMetrics(entry);
  let cursor = y;
  pdfText(page, categoryLabel(entry.category).toUpperCase(), x, cursor, 6.1, 'F2', MUTED);
  cursor -= 10;
  metrics.nameLines.forEach((line) => {
    pdfText(page, line, x, cursor, 9.1, 'F2', INK);
    cursor -= 11;
  });
  metrics.descriptionLines.forEach((line) => {
    pdfText(page, line, x, cursor, 7.35, 'F1', 0.18);
    cursor -= 9;
  });
  metrics.addressLines.forEach((line) => {
    pdfText(page, `Address: ${line}`, x, cursor, 6.35, 'F3', MUTED);
    cursor -= 8;
  });
  const facts = factsForEntry(entry);
  const factWidth = COLUMN_W / 3;
  facts.forEach((fact, index) => {
    const factX = x + (index * factWidth);
    if (index > 0) pdfLine(page, factX - 5, cursor - 2, factX - 5, cursor + 7, 0.78, 0.35);
    pdfText(page, ellipsis(factText(fact), 25), factX, cursor, 6.15, 'F2', 0.22);
  });
  const separatorY = y - metrics.height + 4;
  pdfLine(page, x, separatorY, x + COLUMN_W, separatorY, 0.86, 0.3);
  return y - metrics.height;
};

const serializePdf = (pages: PdfPage[], laosMapImage: PdfImage | null) => {
  const objects: string[] = [''];
  const reserve = () => { objects.push(''); return objects.length - 1; };
  const catalogId = reserve();
  const pagesId = reserve();
  const regularFontId = reserve();
  const boldFontId = reserve();
  const obliqueFontId = reserve();
  const scriptFontId = reserve();
  const laosMapImageId = laosMapImage ? reserve() : 0;
  objects[regularFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[boldFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  objects[obliqueFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>';
  objects[scriptFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>';

  if (laosMapImage && laosMapImageId) {
    const stream = `${laosMapImage.hex}\n`;
    const streamLength = new TextEncoder().encode(stream).length;
    objects[laosMapImageId] = `<< /Type /XObject /Subtype /Image /Width ${laosMapImage.width} /Height ${laosMapImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${streamLength} >>\nstream\n${stream}endstream`;
  }

  const pageIds = pages.map(() => reserve());
  pages.forEach((pdfPage, pageIndex) => {
    const content = `${pdfPage.commands.join('\n')}\n`;
    const contentId = reserve();
    objects[contentId] = `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}endstream`;
    const xObjects = laosMapImageId ? `/XObject << /ImLaosMap ${laosMapImageId} 0 R >>` : '';
    objects[pageIds[pageIndex]] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R /F3 ${obliqueFontId} 0 R /F4 ${scriptFontId} 0 R >> ${xObjects} >> /Contents ${contentId} 0 R >>`;
  });
  objects[pagesId] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;

  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets = new Array(objects.length).fill(0);
  let offset = 0;
  const push = (text: string) => {
    const bytes = encoder.encode(text);
    parts.push(bytes);
    offset += bytes.length;
  };
  push('%PDF-1.4\n');
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = offset;
    push(`${id} 0 obj\n${objects[id]}\nendobj\n`);
  }
  const xrefOffset = offset;
  push(`xref\n0 ${objects.length}\n0000000000 65535 f \n`);
  for (let id = 1; id < objects.length; id += 1) {
    push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  }
  push(`trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob(parts, { type: PDF_MIME });
};

export const buildPrintablePdf = async (entries: TripEntry[]): Promise<Blob> => {
  const hydratedEntries = await hydratePrintableEntries(entries);
  const groups = orderedCities(hydratedEntries);
  const hasLaos = hydratedEntries.some((entry) => entry.country.trim().toLowerCase() === 'laos');
  const laosMapImage = hasLaos ? await loadGrayscaleAssetAsJpeg(LAOS_MAP_SRC, 340, 410) : null;
  const pages: PdfPage[] = [];
  let page!: PdfPage;
  let column = 0;
  let y = TOP;

  const addPage = () => {
    const firstPage = pages.length === 0;
    page = { commands: [] };
    pages.push(page);
    renderHeader(page, pages.length);
    renderFooter(page);
    if (firstPage && laosMapImage) {
      page.commands.push(
        `q ${LAOS_MAP_DISPLAY_W.toFixed(2)} 0 0 ${LAOS_MAP_DISPLAY_H.toFixed(2)} ${LAOS_MAP_X.toFixed(2)} ${LAOS_MAP_Y.toFixed(2)} cm /ImLaosMap Do Q`,
      );
    }
    column = 0;
    y = TOP;
  };

  const advanceColumn = () => {
    if (column === 0) {
      column = 1;
      y = pages.length === 1 && laosMapImage ? FIRST_PAGE_RIGHT_TOP : TOP;
      return;
    }
    addPage();
  };

  addPage();

  groups.forEach((group) => {
    const firstEntryHeight = group.entries[0] ? entryMetrics(group.entries[0]).height : 0;
    const headingNeed = 35 + firstEntryHeight;
    if (y - headingNeed < BOTTOM) advanceColumn();
    y = renderCityHeading(page, group, COLUMN_X[column], y);

    group.entries.forEach((entry) => {
      const metrics = entryMetrics(entry);
      if (y - metrics.height < BOTTOM) {
        advanceColumn();
        y = renderCityHeading(page, group, COLUMN_X[column], y, true);
      }
      y = renderEntry(page, entry, COLUMN_X[column], y);
    });

    y -= 8;
  });

  return serializePdf(pages, laosMapImage);
};
