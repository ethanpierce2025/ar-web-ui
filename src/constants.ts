import { EditionLanguageDto, SourceLevel } from './types/api.types';

// Headers
//
export const readerBackgroundHeader = 'x-reader-background';
export const readerClientIdHeader = 'x-reader-client-id';
export const readerGroupCodeHeader = 'x-reader-group-code';

// Storage
//
export const audioSettingsKey = 'audioSettings';
export const clientIdKey = 'clientId';
export const featuresStorageKey = 'features';
export const groupCodeKey = 'groupCode';
export const lastPassagesKey = 'lastPassages';
export const readerSettingsKey = 'readerSettings';
export const recentLanguagesKey = 'recentLanguages';
export const secondaryEditionKey = 'secondaryEdition';
export const secondaryEditionLanguageKey = 'language';
export const showEditionIndicatorKey = 'showEditionIndicator';
export const userClosedRoleSelectionModalKey = 'userClosedRoleSelectionModal';

export const defaultPublicationVersion = 'v1';
export const editionDefaults: { languages: EditionLanguageDto[]; levels: { level: SourceLevel }[] } = {
  languages: [
    { code: 'en', name: 'English', rightToLeft: false },
    { code: 'es', name: 'Spanish', rightToLeft: false },
    { code: 'ar', name: 'Arabic', rightToLeft: true },
    { code: 'zh', name: 'Chinese', rightToLeft: false },
    { code: 'vi', name: 'Vietnamese', rightToLeft: false },
    { code: 'bn', name: 'Bengali', rightToLeft: false },
    { code: 'fil', name: 'Filipino', rightToLeft: false },
    { code: 'ur', name: 'Urdu', rightToLeft: true },
    { code: 'ru', name: 'Russian', rightToLeft: false },
    { code: 'ha', name: 'Hatian Creole', rightToLeft: false },
    { code: 'pt', name: 'Portuguese', rightToLeft: false },
  ],
  levels: [{ level: SourceLevel.ORIGINAL }, { level: SourceLevel.GOLD }, { level: SourceLevel.SILVER }],
};
export const englishLanguageKey = 'en';
export const recentLanguagesLimit = 3;

export const primaryColumnDefault = {
  language: 'en',
  level: SourceLevel.ORIGINAL,
};

export const secondaryColumnDefaults = {
  language: 'es',
  level: SourceLevel.ORIGINAL,
};

export const autoPlayPageChangePauseMs = 1000;
export const autoPlayTransitionMinDelayMs = 500;
export const autoPlayTransitionMaxDelayMs = 3000;
export const toolbarAutoHideTimeoutMs = 3000;
export const highlightDefault = true;

// External Links
//
export const userUploadLink = 'https://app.adaptivereader.ai';
export const requestContentLink = 'https://www.adaptivereader.com/pages/request-content';
