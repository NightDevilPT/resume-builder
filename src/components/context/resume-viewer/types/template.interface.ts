import { Style } from './style.interface';
import { Section } from './section.interface';

export interface ColumnDefinition {
  /**
   * Width of the column. If using percentages, the sum of all column widths should be 100.
   * For example, two columns could be [50, 50] and three columns could be [33, 33, 34].
   * You can also specify absolute widths (e.g., 200 for 200 points) if you are not using percentages.
   */
  width?: number;
  style?: Style; // additional styling for the column container
}

export type Layout = number | ColumnDefinition[]; // number = equal columns

export interface TemplateConfig {
  // Document metadata (props of <Document>)
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  version?: string;
  language?: string;
  pageMode?: 'useNone' | 'useOutlines' | 'useThumbs' | 'fullScreen' | 'useOC' | 'useAttachments';
  pageLayout?: 'singlePage' | 'oneColumn' | 'twoColumnLeft' | 'twoColumnRight' | 'twoPageLeft' | 'twoPageRight';

  // Column layout shortcut
  columnLayout?: 'one-column' | 'two-column' | 'three-column';

  // Page settings (props of <Page>)
  pageSize?: string | [number, number];
  orientation?: 'portrait' | 'landscape';
  pageStyle?: Style;
  pageWrap?: boolean;
  pageDebug?: boolean;
  pageDpi?: number;

  // Global content settings
  margins?: number | { top: number; bottom: number; left: number; right: number };
  globalStyle?: Style; // applied to every section container

  // Layout definition (if provided, overrides columnLayout; must be consistent)
  layout: Layout; // total columns and their widths
  sections: Section[]; // sections with order and colMap
}