export interface AtlasCoverContentsCountry {
  country: string;
  savedPlaces: number;
}

export interface AtlasCoverContentsSvgOptions {
  idPrefix?: string;
  showContent?: boolean;
}

export const ATLAS_COVER_CONTENTS_LAYOUT = {
  width: 620,
  paperLeft: 16,
  paperTop: 26,
  paperWidth: 588,
  headerHeight: 94,
  rowHeight: 48,
  bottomPadding: 34,
  svgBottomPadding: 18,
  tapeTop: 8,
  tapeWidth: 140,
  tapeHeight: 40,
  contentLeft: 48,
  bulletX: 52,
  countryX: 76,
  countRightX: 570,
  headerTitleBaselineY: 78,
  headerMetaBaselineY: 72,
  headerSeparatorY: 101,
} as const;

const PAPER = '#F4EEDF';
const PAPER_LIGHT = '#FAF6EA';
const PAPER_DARK = '#E9DEC8';
const PAPER_EDGE = '#CBBEA7';
const INK = '#29332E';
const MUTED = '#667069';
const ATLAS_GREEN = '#29463D';
const BURGUNDY = '#9A4238';
const RULE = '#B8AA91';

const escapeSvgText = (value: string) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const safeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '') || 'atlasCoverContents';

const normalizedCount = (value: number) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.trunc(numeric));
};

export const formatAtlasSavedPlaces = (value: number) => {
  const count = normalizedCount(value);
  return `${count} saved ${count === 1 ? 'place' : 'places'}`;
};

export const getAtlasCoverContentsDimensions = (countryCount: number) => {
  const rows = Math.max(0, Math.trunc(Number.isFinite(countryCount) ? countryCount : 0));
  const paperHeight = ATLAS_COVER_CONTENTS_LAYOUT.headerHeight
    + (rows * ATLAS_COVER_CONTENTS_LAYOUT.rowHeight)
    + ATLAS_COVER_CONTENTS_LAYOUT.bottomPadding;
  const height = ATLAS_COVER_CONTENTS_LAYOUT.paperTop
    + paperHeight
    + ATLAS_COVER_CONTENTS_LAYOUT.svgBottomPadding;

  return {
    width: ATLAS_COVER_CONTENTS_LAYOUT.width,
    height,
    paperHeight,
    rows,
  };
};

const paperPath = (paperBottom: number) => {
  const { paperLeft, paperTop, paperWidth } = ATLAS_COVER_CONTENTS_LAYOUT;
  const right = paperLeft + paperWidth;
  return [
    `M ${paperLeft + 4} ${paperTop + 2}`,
    `C ${paperLeft + 132} ${paperTop - 5}, ${right - 134} ${paperTop - 4}, ${right - 7} ${paperTop + 3}`,
    `L ${right + 1} ${paperBottom - 9}`,
    `C ${right - 84} ${paperBottom - 1}, ${paperLeft + 112} ${paperBottom + 2}, ${paperLeft} ${paperBottom - 7}`,
    'Z',
  ].join(' ');
};

/**
 * Builds a self-contained, variable-height SVG contents slip for the Atlas PDF cover.
 * The width and every typographic/spacing value stay fixed; only the paper body grows.
 */
export const buildAtlasCoverContentsSvg = (
  countries: AtlasCoverContentsCountry[],
  options: AtlasCoverContentsSvgOptions = {},
) => {
  const rows = Array.isArray(countries) ? countries : [];
  const dimensions = getAtlasCoverContentsDimensions(rows.length);
  const layout = ATLAS_COVER_CONTENTS_LAYOUT;
  const paperBottom = layout.paperTop + dimensions.paperHeight;
  const bodyTop = layout.paperTop + layout.headerHeight;
  const tapeLeft = (layout.width - layout.tapeWidth) / 2;
  const id = safeId(options.idPrefix ?? 'atlasCoverContents');
  const showContent = options.showContent !== false;
  const shape = paperPath(paperBottom);

  const rowMarkup = showContent ? rows.map((row, index) => {
    const rowTop = bodyTop + (index * layout.rowHeight);
    const centerY = rowTop + (layout.rowHeight / 2);
    const baselineY = centerY + 6;
    const separatorY = rowTop + layout.rowHeight;
    const country = escapeSvgText(row.country ?? '');
    const count = escapeSvgText(formatAtlasSavedPlaces(row.savedPlaces));
    const separator = index < rows.length - 1
      ? `<line x1="76" y1="${separatorY}" x2="570" y2="${separatorY}" stroke="${RULE}" stroke-width="0.8" stroke-dasharray="1.5 5.5" opacity="0.36"/>`
      : '';

    return `<g data-atlas-country-row="${index}">
      <circle cx="${layout.bulletX}" cy="${centerY}" r="5.25" fill="none" stroke="${BURGUNDY}" stroke-width="1.55"/>
      <text x="${layout.countryX}" y="${baselineY}" fill="${INK}" font-family="Georgia, 'Times New Roman', serif" font-size="18" font-weight="600">${country}</text>
      <text x="${layout.countRightX}" y="${baselineY - 1}" fill="${MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="12.5" text-anchor="end" letter-spacing="0.15">${count}</text>
      ${separator}
    </g>`;
  }).join('\n') : '';

  const contentMarkup = showContent ? `<g id="${id}-content">
    <text x="${layout.contentLeft}" y="${layout.headerTitleBaselineY}" fill="${INK}" font-family="'Alex Brush', 'Brush Script MT', cursive" font-size="31" font-weight="400">Contents</text>
    <text x="${layout.countRightX}" y="${layout.headerMetaBaselineY}" fill="${ATLAS_GREEN}" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="600" text-anchor="end" letter-spacing="2.15">YOUR SAVED ATLAS</text>
    <line x1="${layout.contentLeft}" y1="${layout.headerSeparatorY}" x2="${layout.countRightX}" y2="${layout.headerSeparatorY}" stroke="${RULE}" stroke-width="0.9" stroke-dasharray="1.5 5" opacity="0.48"/>
    ${rowMarkup}
  </g>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">Your saved Atlas contents</title>
  <desc id="${id}-desc">A variable-height archival paper contents slip with ${dimensions.rows} country ${dimensions.rows === 1 ? 'row' : 'rows'}.</desc>
  <defs>
    <filter id="${id}-paperShadow" x="-8%" y="-8%" width="116%" height="120%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="blur"/>
      <feOffset in="blur" dx="0" dy="4" result="offsetBlur"/>
      <feFlood flood-color="#24231F" flood-opacity="0.16" result="shadowColor"/>
      <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadow"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="${id}-tapeShadow" x="-12%" y="-24%" width="124%" height="150%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.35" result="blur"/>
      <feOffset in="blur" dx="0" dy="1.7" result="offsetBlur"/>
      <feFlood flood-color="#2D2A23" flood-opacity="0.14" result="shadowColor"/>
      <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadow"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="${id}-paperWash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PAPER_LIGHT}"/>
      <stop offset="0.58" stop-color="${PAPER}"/>
      <stop offset="1" stop-color="${PAPER_DARK}"/>
    </linearGradient>
    <linearGradient id="${id}-tape" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#D5C294" stop-opacity="0.80"/>
      <stop offset="0.5" stop-color="#E7D5A6" stop-opacity="0.91"/>
      <stop offset="1" stop-color="#CFB987" stop-opacity="0.82"/>
    </linearGradient>
    <pattern id="${id}-grain" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="4" r="0.55" fill="#766B59" opacity="0.055"/>
      <circle cx="13" cy="11" r="0.42" fill="#5E5649" opacity="0.045"/>
      <path d="M1 16 C6 15.6 12 16.3 17 15.8" fill="none" stroke="#887B65" stroke-width="0.32" opacity="0.03"/>
    </pattern>
    <clipPath id="${id}-paperClip"><path d="${shape}"/></clipPath>
  </defs>

  <g filter="url(#${id}-paperShadow)">
    <path d="${shape}" fill="url(#${id}-paperWash)" stroke="${PAPER_EDGE}" stroke-width="1.25"/>
    <rect x="${layout.paperLeft}" y="${layout.paperTop}" width="${layout.paperWidth}" height="${dimensions.paperHeight}" fill="url(#${id}-grain)" clip-path="url(#${id}-paperClip)"/>
    ${contentMarkup}
    <g opacity="0.20">
      <circle cx="566" cy="${paperBottom - 20}" r="7.2" fill="none" stroke="#827764" stroke-width="0.9"/>
      <path d="M566 ${paperBottom - 25.5}v11M560.5 ${paperBottom - 20}h11" stroke="#827764" stroke-width="0.8"/>
    </g>
  </g>

  <g filter="url(#${id}-tapeShadow)" transform="rotate(-1.6 ${layout.width / 2} ${layout.tapeTop + (layout.tapeHeight / 2)})">
    <path d="M ${tapeLeft + 3} ${layout.tapeTop} L ${tapeLeft + layout.tapeWidth} ${layout.tapeTop + 3} L ${tapeLeft + layout.tapeWidth - 4} ${layout.tapeTop + layout.tapeHeight} L ${tapeLeft} ${layout.tapeTop + layout.tapeHeight - 3} Z" fill="url(#${id}-tape)"/>
    <path d="M ${tapeLeft + 8} ${layout.tapeTop + 4} L ${tapeLeft + layout.tapeWidth - 6} ${layout.tapeTop + 7}" stroke="#FFF7DD" stroke-width="0.9" opacity="0.40"/>
    <path d="M ${tapeLeft + 7} ${layout.tapeTop + layout.tapeHeight - 5} L ${tapeLeft + layout.tapeWidth - 8} ${layout.tapeTop + layout.tapeHeight - 2}" stroke="#8F7E5D" stroke-width="0.7" opacity="0.17"/>
  </g>
</svg>`;
};
