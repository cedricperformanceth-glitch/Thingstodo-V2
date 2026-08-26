import type { SeoMetadata } from '../../core/models/types';

export interface LegalInlineText {
  text: string;
  href?: string;
  external?: boolean;
}

export interface LegalParagraphBlock {
  type: 'paragraph';
  content: LegalInlineText[];
}

export interface LegalListBlock {
  type: 'list';
  style?: 'dash' | 'bullet';
  items: LegalInlineText[][];
}

export interface LegalCalloutBlock {
  type: 'callout';
  label?: string;
  title?: string;
  tone?: 'field-note' | 'important';
  paragraphs: LegalInlineText[][];
}

export interface LegalTableBlock {
  type: 'table';
  caption?: string;
  columns: string[];
  rows: string[][];
}

export interface LegalContactBlock {
  type: 'contact';
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface LegalDividerBlock {
  type: 'divider';
}

export type LegalBlock =
  | LegalParagraphBlock
  | LegalListBlock
  | LegalCalloutBlock
  | LegalTableBlock
  | LegalContactBlock
  | LegalDividerBlock;

export interface LegalSection {
  id: string;
  title: string;
  number?: string;
  blocks: LegalBlock[];
}

export interface LegalPageData {
  slug: string;
  eyebrow?: string;
  documentLabel?: string;
  title: string;
  heroIntro?: string;
  documentIntro?: string;
  lastUpdated: string;
  seo: SeoMetadata;
  showToc?: boolean;
  sections: LegalSection[];
  footerNote?: string;
}
