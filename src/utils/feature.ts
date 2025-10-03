import { freeAudioLanguages, freeLanguages } from '@shared/constants';

export function hasLanguageFreeAudio(languageCode?: string): boolean {
  if (!languageCode) return false;
  return freeAudioLanguages.includes(languageCode.toLowerCase());
}

export function hasLanguageAccess(languageCode?: string, hasLanguagesFeature?: boolean): boolean {
  if (!languageCode) return false;
  if (hasLanguagesFeature) return true;
  return freeLanguages.includes(languageCode.toLowerCase());
}
