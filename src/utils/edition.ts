import { SourceLevel } from '@/types/api.types';

export function parseLegacyEditionSlug(legacyEditionSlug: string): {
  language: string;
  level: SourceLevel;
} {
  // Legacy edition slugs have the following two formats:
  //   1. {language}-{level} (e.g. en-original)
  //   2. {level} (e.g. original)
  //
  // We need to support both formats, defaulting to 'en' if the language is not specified.
  //
  const [language, levelLowerCase] = legacyEditionSlug.includes('-')
    ? legacyEditionSlug.split('-')
    : ['en', legacyEditionSlug];
  const level = levelLowerCase.toUpperCase() as SourceLevel;

  return { language, level };
}

export function slugifyEditionLevel(level: SourceLevel): string {
  return level.toLowerCase();
}
