import { Style } from './style.interface';

export interface BaseBlock {
  id?: string;
  style?: Style;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  content: string;
}

export interface LinkBlock extends BaseBlock {
  type: 'link';
  src: string;
  content: string;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  ordered?: boolean;
  items: Array<{
    content: string;
    link?: string;
  }>;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt?: string;
}

export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | LinkBlock
  | ListBlock
  | ImageBlock