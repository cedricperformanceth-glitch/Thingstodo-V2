import type { TripEntry } from '../trip/store';
import { categoryLabel, googleMapsUrl, groupedEntries, PDF_MIME, titleize } from './atlas-export-shared';

interface PdfLink { x: number; y: number; width: number; height: number; url: string; }
interface PdfPage { commands: string[]; links: PdfLink[]; }

const asciiPdf = (value: string) => value.normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[–—]/g, '-').replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'").replace(/→/g, '->').replace(/[^\x20-\x7E]/g, '');
const pdfEscape = (value: string) => asciiPdf(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const pdfText = (page: PdfPage, text: string, x: number, y: number, size: number, font: 'F1' | 'F2' = 'F1', color: [number, number, number] = [0.16, 0.18, 0.17]) => {
  page.commands.push(`BT /${font} ${size} Tf ${color.join(' ')} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEscape(text)}) Tj ET`);
};
const pdfLine = (page: PdfPage, x1: number, y1: number, x2: number, y2: number, color: [number, number, number] = [0.76, 0.73, 0.66], width = 0.8) => {
  page.commands.push(`${color.join(' ')} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
};
const pdfFill = (page: PdfPage, x: number, y: number, width: number, height: number, color: [number, number, number]) => {
  page.commands.push(`${color.join(' ')} rg ${x} ${y} ${width} ${height} re f`);
};

export const buildPdf = (entries: TripEntry[]): Blob => {
  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const LEFT = 52;
  const RIGHT = PAGE_W - 52;
  const pages: PdfPage[] = [];
  const summaryUrl = new URL('/summary', window.location.origin).toString();
  const countries = groupedEntries(entries);
  const multiCountry = countries.size > 1;
  let page!: PdfPage;
  let y = PAGE_H - 112;

  const addPage = () => {
    page = { commands: [], links: [] };
    pages.push(page);
    pdfFill(page, 0, 0, PAGE_W, PAGE_H, [0.98, 0.965, 0.925]);
    pdfText(page, 'THINGS TO DO ATLAS', LEFT, PAGE_H - 44, 8.5, 'F2', [0.19, 0.33, 0.27]);
    pdfText(page, 'TRAVEL FIELD NOTES', RIGHT - 92, PAGE_H - 44, 7.3, 'F1', [0.45, 0.45, 0.41]);
    pdfLine(page, LEFT, PAGE_H - 56, RIGHT, PAGE_H - 56, [0.19, 0.33, 0.27], 1.1);
    y = PAGE_H - 88;
  };

  const addFooter = (target: PdfPage, pageNumber: number) => {
    pdfLine(target, LEFT, 48, RIGHT, 48, [0.78, 0.75, 0.69], 0.6);
    pdfText(target, 'Things To Do Atlas - Your Atlas', LEFT, 30, 7.2, 'F2', [0.19, 0.33, 0.27]);
    target.links.push({ x: LEFT, y: 26, width: 126, height: 12, url: summaryUrl });
    pdfText(target, `Page ${pageNumber}`, RIGHT - 34, 30, 7.2, 'F1', [0.48, 0.48, 0.45]);
  };

  const ensure = (height: number) => {
    if (y - height >= 66) return;
    addFooter(page, pages.length);
    addPage();
  };

  addPage();
  const uniqueCountries = [...countries.keys()];
  const headingCountry = uniqueCountries.length === 1 ? titleize(uniqueCountries[0]).toUpperCase() : 'YOUR JOURNEY';
  pdfText(page, `MY ATLAS - ${headingCountry}`, LEFT, y, 23, 'F2', [0.12, 0.2, 0.16]);
  y -= 24;
  pdfText(page, `Your journey so far - ${entries.length} saved ${entries.length === 1 ? 'place' : 'places'}.`, LEFT, y, 10, 'F1', [0.42, 0.43, 0.39]);
  y -= 26;

  countries.forEach((cities, country) => {
    if (multiCountry) {
      ensure(40);
      pdfText(page, titleize(country).toUpperCase(), LEFT, y, 17, 'F2', [0.47, 0.18, 0.16]);
      y -= 25;
    }
    cities.forEach((categories, city) => {
      ensure(46);
      pdfText(page, titleize(city), LEFT, y, 14.5, 'F2', [0.12, 0.2, 0.16]);
      y -= 8;
      pdfLine(page, LEFT, y, RIGHT, y, [0.73, 0.68, 0.59], 0.7);
      y -= 18;
      categories.forEach((items, category) => {
        ensure(28);
        pdfText(page, categoryLabel(category).toUpperCase(), LEFT, y, 8.2, 'F2', [0.47, 0.18, 0.16]);
        y -= 17;
        items.forEach((entry) => {
          ensure(27);
          const name = entry.name.length > 52 ? `${entry.name.slice(0, 49)}...` : entry.name;
          pdfText(page, name, LEFT + 8, y, 9.7);
          pdfText(page, 'Google Maps ->', RIGHT - 84, y, 8.3, 'F2', [0.19, 0.33, 0.27]);
          page.links.push({ x: RIGHT - 88, y: y - 3, width: 92, height: 13, url: googleMapsUrl(entry) });
          y -= 18;
        });
        y -= 6;
      });
      y -= 8;
    });
  });

  ensure(68);
  pdfText(page, 'Thanks for letting Things To Do Atlas travel with you.', LEFT, y, 9.5, 'F2', [0.12, 0.2, 0.16]);
  y -= 15;
  pdfText(page, 'Keep exploring, stay curious, and have a beautiful journey.', LEFT, y, 9, 'F1', [0.42, 0.43, 0.39]);
  y -= 23;
  pdfText(page, 'Open Your Atlas ->', LEFT, y, 8.5, 'F2', [0.19, 0.33, 0.27]);
  page.links.push({ x: LEFT, y: y - 3, width: 84, height: 13, url: summaryUrl });
  addFooter(page, pages.length);

  const objects: string[] = [''];
  const reserve = () => { objects.push(''); return objects.length - 1; };
  const catalogId = reserve();
  const pagesId = reserve();
  const regularFontId = reserve();
  const boldFontId = reserve();
  objects[regularFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[boldFontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
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
    objects[pageId] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${contentId} 0 R ${annots} >>`;
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
