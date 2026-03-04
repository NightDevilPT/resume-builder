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

export type SkillDisplayFormat = 'percentage' | 'bar' | 'circle' | 'dots' | 'stars';

export interface SkillBlock extends BaseBlock {
  type: 'skill';
  name: string;
  level: number;
  displayFormat: SkillDisplayFormat;
  showLevel?: boolean;
}

export interface ExperienceItem {
  id?: string;
  title: string;
  subtitle?: string;
  location?: string;
  startDate?: string;
  endDate?: string | 'present';
  description?: Array<TextBlock | ListBlock | LinkBlock>;
  link?: string;
}

export interface ExperienceBlock extends BaseBlock {
  type: 'experience';
  item: ExperienceItem;
}

export interface EducationItem extends ExperienceItem {
  degree?: string;
  field?: string;
}

export interface EducationBlock extends BaseBlock {
  type: 'education';
  item: EducationItem;
}

export interface AchievementItem {
  id?: string;
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
  link?: string;
}

export interface AchievementBlock extends BaseBlock {
  type: 'achievement';
  item: AchievementItem;
}

export type ContentBlock =
  | TextBlock
  | HeadingBlock
  | LinkBlock
  | ListBlock
  | ImageBlock
  | SkillBlock
  | ExperienceBlock
  | EducationBlock
  | AchievementBlock