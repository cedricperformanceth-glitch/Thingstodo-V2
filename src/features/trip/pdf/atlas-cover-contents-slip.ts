/**
 * A self-contained SVG insert for the "Your Own Atlas" PDF cover.
 *
 * The returned SVG intentionally owns every visual rule so that it can be
 * placed over the cover artwork by a browser or PDF renderer without a
 * stylesheet, HTML, or remotely loaded font.
 */
export interface SavedAtlasCountry {
  country: string;
  savedPlaces: number;
}

export interface AtlasCoverContentsOptions {
  /** Fixed paper width in SVG user units. */
  width?: number;
  /** Accessible label for the exported SVG. */
  title?: string;
}

export const ATLAS_COVER_CONTENTS_METRICS = {
  width: 620,
  paperInset: 7,
  headerHeight: 88,
  rowHeight: 48,
  bottomPadding: 34,
} as const;

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
})[character] ?? character);

const savedPlacesLabel = (count: number) => `${count} saved ${count === 1 ? 'place' : 'places'}`;

/**
 * Creates an archival contents slip whose paper grows by one fixed row for
 * every country. The header, tape, typography, and footer never scale.
 */
export const createAtlasCoverContentsSvg = (
  countries: readonly SavedAtlasCountry[],
  options: AtlasCoverContentsOptions = {},
) => {
  const width = options.width ?? ATLAS_COVER_CONTENTS_METRICS.width;
  const { paperInset, headerHeight, rowHeight, bottomPadding } = ATLAS_COVER_CONTENTS_METRICS;
  const height = headerHeight + countries.length * rowHeight + bottomPadding;
  const paperBottom = height - 6;
  const paperRight = width - paperInset;
  const rightTextX = width - 38;
  const rowStart = headerHeight;
  const title = options.title ?? 'Your saved atlas contents';
  const tapeWidth = Math.min(126, width * 0.22);
  const tapeX = (width - tapeWidth) / 2;

  const rows = countries.map(({ country, savedPlaces }, index) => {
    const rowY = rowStart + index * rowHeight;
    const baseline = rowY + 30;
    const separatorY = rowY + rowHeight - 1;
    const safeCountry = escapeXml(country);
    const normalizedCount = Number.isFinite(savedPlaces) ? Math.max(0, Math.trunc(savedPlaces)) : 0;

    return `
      <g>
        <circle cx="43" cy="${rowY + 24}" r="5" fill="none" stroke="#9a4238" stroke-width="1.35"/>
        <g clip-path="url(#atlas-country-column)"><text x="61" y="${baseline}" fill="#314238" font-family="Newsreader, Georgia, 'Times New Roman', serif" font-size="17" font-weight="500">${safeCountry}</text></g>
        <text x="${rightTextX}" y="${baseline}" fill="#556158" font-family="Manrope, Arial, sans-serif" font-size="10.5" font-weight="600" letter-spacing="0.18" text-anchor="end">${savedPlacesLabel(normalizedCount)}</text>
        <path d="M 32 ${separatorY} H ${width - 32}" fill="none" stroke="#718076" stroke-opacity=".18" stroke-width=".75" stroke-dasharray="1.3 4.2"/>
      </g>`;
  }).join('');

  // The paper outline is generated from the calculated bottom edge. This is
  // deliberate: only the middle expands, while both sets of corners remain
  // gently irregular at their original proportions.
  const paperPath = `M 12 14 Q 10 10 17 9 L ${width - 19} 10 Q ${width - 9} 11 ${width - 10} 18 L ${paperRight} ${paperBottom - 12} Q ${width - 9} ${paperBottom - 4} ${width - 17} ${paperBottom - 3} L 17 ${paperBottom} Q 8 ${paperBottom - 1} 9 ${paperBottom - 10} L 7 20 Q 7 15 12 14 Z`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="atlas-cover-contents-title" shape-rendering="geometricPrecision">
  <title id="atlas-cover-contents-title">${escapeXml(title)}</title>
  <defs>
    <linearGradient id="atlas-paper-wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7f1e3"/>
      <stop offset=".56" stop-color="#f4eedf"/>
      <stop offset="1" stop-color="#eee5d3"/>
    </linearGradient>
    <pattern id="atlas-paper-grain" width="23" height="19" patternUnits="userSpaceOnUse">
      <path d="M 2 4 h .7 M 15 8 h .55 M 7 16 h .6 M 20 14 h .45" stroke="#806f55" stroke-opacity=".13" stroke-width=".55" stroke-linecap="round"/>
    </pattern>
    <filter id="atlas-paper-shadow" x="-8%" y="-8%" width="116%" height="122%" color-interpolation-filters="sRGB">
      <feDropShadow dx="2.2" dy="4.2" stdDeviation="3.4" flood-color="#22362d" flood-opacity=".22"/>
    </filter>
    <filter id="atlas-tape-shadow" x="-12%" y="-30%" width="124%" height="170%" color-interpolation-filters="sRGB">
      <feDropShadow dx=".7" dy="1.4" stdDeviation="1" flood-color="#3b3329" flood-opacity=".19"/>
    </filter>
    <clipPath id="atlas-country-column"><rect x="61" y="${rowStart}" width="${width - 260}" height="${countries.length * rowHeight}"/></clipPath>
  </defs>
  <path d="${paperPath}" fill="#e8deca" fill-opacity=".72" filter="url(#atlas-paper-shadow)"/>
  <path d="${paperPath}" fill="url(#atlas-paper-wash)" stroke="#c6b99f" stroke-opacity=".68" stroke-width="1"/>
  <path d="${paperPath}" fill="url(#atlas-paper-grain)" opacity=".42"/>
  <path d="M 30 72 H ${width - 30}" fill="none" stroke="#466052" stroke-opacity=".32" stroke-width=".85"/>
  <text x="34" y="51" fill="#29463d" font-family="Caveat, 'Segoe Print', 'Bradley Hand', cursive" font-size="31" font-weight="600">Contents</text>
  <text x="${width - 34}" y="47" fill="#29463d" fill-opacity=".91" font-family="Manrope, Arial, sans-serif" font-size="9.4" font-weight="700" letter-spacing="1.55" text-anchor="end">YOUR SAVED ATLAS</text>
  <text x="${width - 34}" y="61" fill="#68746c" font-family="Manrope, Arial, sans-serif" font-size="7.6" font-weight="600" letter-spacing=".78" text-anchor="end">COUNTRY INDEX</text>
  ${rows}
  <g transform="translate(${width - 48} ${height - 27})" fill="none" stroke="#29463d" stroke-opacity=".24" stroke-width=".8">
    <circle r="6.1"/><circle r="1.65"/><path d="M -9 0 H 9 M 0 -9 V 9"/>
  </g>
  <g filter="url(#atlas-tape-shadow)">
    <path d="M ${tapeX + 2} 4 L ${tapeX + tapeWidth - 2} 3 L ${tapeX + tapeWidth} 25 L ${tapeX} 26 Z" fill="#cdb98d" fill-opacity=".69" stroke="#aa9369" stroke-opacity=".22" stroke-width=".8"/>
    <path d="M ${tapeX + 7} 7 L ${tapeX + tapeWidth - 6} 6" stroke="#f5edda" stroke-opacity=".4" stroke-width=".9"/>
    <path d="M ${tapeX + 12} 21 L ${tapeX + tapeWidth - 14} 20" stroke="#806d4e" stroke-opacity=".12" stroke-width=".75" stroke-dasharray="1 4"/>
  </g>
</svg>`;
};
