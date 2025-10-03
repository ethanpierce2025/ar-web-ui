import { EditionLanguageDto, SourceLevel } from './api.types';

export type EditionMetadata = {
  readingEase: number;
  totalWords: number;
  uniqueWords: number;
};

export type Edition = {
  id: number;
  audioEnabled: boolean;
  audioStatus: boolean;
  audioTotalLength?: number;
  language: EditionLanguageDto;
  level: SourceLevel;
  lexileLevelFormatted?: string;
  metadata: EditionMetadata;
  passageCount: number;
};
