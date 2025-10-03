import { EditionLanguageDto, SourceLevel } from './api.types';
import { Edition } from './edition.types';

export type PublicationShortcut = {
  name: string;
  passage: number;
};

export type Badge = {
  label: string;
  theme?: string;
};

export type InfoData = {
  body: string;
  title: string;
};

export enum PublicationStatus {
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum PublicationRenderingMode {
  DEFAULT = 'DEFAULT',
  ILLUSTRATED = 'ILLUSTRATED',
}

export type Publication = {
  author: string;
  availability: PublicationAvailability;
  badges?: Badge[];
  defaultReader: PublicationDefaultReader;
  editions: Edition[];
  englishEditions: Edition[];
  infoData?: InfoData[];
  languages: EditionLanguageDto[];
  levels: SourceLevel[];
  otherLanguagesEditions: Edition[];
  renderingMode: PublicationRenderingMode;
  shopifyStoreUrl: string;
  shortcuts?: PublicationShortcut[];
  slug: string;
  status: PublicationStatus;
  thumbnailImageUrl: string;
  title: string;
  version: string;
};

export enum PublicationAvailability {
  FREE = 'FREE',
}

type PublicationDefaultReader = {
  left: PublicationDefaultReaderColumn;
  right?: PublicationDefaultReaderColumn;
};

type PublicationDefaultReaderColumn = {
  language: string;
  level: SourceLevel;
};
