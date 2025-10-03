import { AudioControlState } from '@/components/reader/AudioPlayer';
import { PlaybackSpeed } from '@/components/reader/PlaybackSpeedDropdown';
import { FontSizeItem } from '@/components/reader/ReaderFontSizeDropdown';
import {
  audioSettingsKey,
  clientIdKey,
  defaultPublicationVersion,
  featuresStorageKey,
  groupCodeKey,
  lastPassagesKey,
  readerSettingsKey,
  recentLanguagesKey,
  showEditionIndicatorKey,
  userClosedRoleSelectionModalKey,
} from '@/constants';
import { EditionLanguageDto, SourceLevel } from '@/types/api.types';
import { v4 as uuidv4 } from 'uuid';
import { parseLegacyEditionSlug } from './edition';

export type StorageKey =
  | typeof audioSettingsKey
  | typeof featuresStorageKey
  | typeof lastPassagesKey
  | typeof clientIdKey
  | typeof groupCodeKey
  | typeof readerSettingsKey
  | typeof showEditionIndicatorKey
  | typeof recentLanguagesKey
  | typeof userClosedRoleSelectionModalKey;

export type ReaderParamsForPublication = {
  language: string;
  level: SourceLevel;
  position: number;
  publicationSlug: string;
  publicationVersion: string;
  secondaryLanguage?: string;
  secondaryLevel?: SourceLevel;
};

export type ListenParamsForPublication = {
  autoPlay: boolean;
  language: string;
  level: SourceLevel;
  position: number;
  publicationSlug: string;
  publicationVersion: string;
};
// TODO - this is to support reader urls without a version. Remove when no longer needed
//
type ReaderParamsForPublicationWithoutVersion = {
  language: string;
  level: SourceLevel;
  position: number;
  publicationSlug: string;
  secondaryLanguage?: string;
  secondaryLevel?: SourceLevel;
};

// TODO - this is to support legacy reader urls. Remove when no longer needed
//
type LegacyReaderParamsForPublication = {
  editionSlug: string;
  position: string;
  publicationSlug: string;
  secondaryEdition?: string;
};

export type AudioSettings = {
  audioControlState: AudioControlState;
  editionSelected: 'primary' | 'secondary';
  highlight: boolean;
  currentTime: {
    primary: number;
    secondary: number;
  };
  autoPlay: boolean;
  playbackSpeed: PlaybackSpeed;
  playbackSpeedMap?: Record<PlaybackSpeed, number>;
};

export type Features = {
  features: string[];
};

export type ReaderSettings = {
  decodeEnabled?: boolean;
  fontSize: FontSizeItem['id'];
  illustratedModeFontSize: FontSizeItem['id'];
};

export class BrowserStorage {
  static get(key: StorageKey) {
    return BrowserStorage.getLocalStorage(key);
  }

  static getGroupCode(): string | undefined {
    return BrowserStorage.get(groupCodeKey);
  }

  static getReaderParamsForPublication(params: { slug: string; version: string }):
    | ReaderParamsForPublication
    | undefined {
    const { slug, version } = params;
    const key = `${slug}-${version}`;

    const readerParamsByPublication = BrowserStorage.getJson(lastPassagesKey) ?? {};

    let readerParams = readerParamsByPublication[key] as
      | ReaderParamsForPublication
      | ReaderParamsForPublicationWithoutVersion
      | LegacyReaderParamsForPublication
      | undefined;

    // If not found and the version is the default ("v1"), try to find the legacy params
    //
    if (!readerParams && version === defaultPublicationVersion) {
      readerParams = readerParamsByPublication[slug];
    }

    // If no reader params are found for that slug look for any available reader params
    //
    if (!readerParams) {
      if (readerParamsByPublication) {
        const keys = Object.keys(readerParamsByPublication);
        if (keys.length) {
          readerParams = readerParamsByPublication[keys[0]];
        }
      }
    }

    if (!readerParams) return undefined;

    // Legacy support
    //
    if ('editionSlug' in readerParams) {
      const { language, level } = parseLegacyEditionSlug(readerParams.editionSlug);
      const { language: secondaryLanguage, level: secondaryLevel } = readerParams.secondaryEdition
        ? parseLegacyEditionSlug(readerParams.secondaryEdition)
        : { language: undefined, level: undefined };

      return {
        language,
        level,
        position: parseInt(readerParams.position),
        publicationSlug: readerParams.publicationSlug,
        publicationVersion: defaultPublicationVersion,
        secondaryLanguage,
        secondaryLevel,
      };
    }

    if (!('publicationVersion' in readerParams)) {
      return {
        ...readerParams,
        publicationVersion: defaultPublicationVersion,
      };
    }

    return readerParams;
  }

  static getRecentlyUsedLanguages(): EditionLanguageDto[] {
    const recentLanguages = BrowserStorage.getLocalStorage(recentLanguagesKey);
    if (!recentLanguages) return [];
    return JSON.parse(recentLanguages!);
  }

  static getJson<T = Record<string, any>>(key: StorageKey): T | undefined {
    const value = BrowserStorage.getLocalStorage(key);
    if (value) return JSON.parse(value);
  }

  static getLocalStorage(key: string): string | undefined {
    const get = (k: string) => localStorage.getItem(k);
    return getSafety(get)(key);
  }

  static getOrGenerateClientId(): string {
    const clientId = BrowserStorage.get(clientIdKey);
    if (!clientId) {
      BrowserStorage.set(clientIdKey, uuidv4());
    }

    return BrowserStorage.get(clientIdKey) as string;
  }

  static getAudioSettings(): AudioSettings | undefined {
    return BrowserStorage.getJson<AudioSettings>(audioSettingsKey);
  }

  static getReaderSettings(): ReaderSettings | undefined {
    return BrowserStorage.getJson<ReaderSettings>(readerSettingsKey);
  }

  static getShowEditionIndicator(): boolean | undefined {
    const showEditionIndicator = BrowserStorage.get(showEditionIndicatorKey);
    return showEditionIndicator ? showEditionIndicator === 'true' : undefined;
  }

  static getUserClosedRoleSelectionModal(): boolean | undefined {
    const userClosedRoleSelectionModal = BrowserStorage.get(userClosedRoleSelectionModalKey);
    return userClosedRoleSelectionModal ? userClosedRoleSelectionModal === 'true' : undefined;
  }

  static remove(key: StorageKey) {
    BrowserStorage.removeLocalStorage(key);
  }

  static removeGroupCode() {
    BrowserStorage.remove(groupCodeKey);
  }

  static set(key: StorageKey, value: string) {
    BrowserStorage.setLocalStorage(key, value);
  }

  static setAudioSettings(audioSettings: AudioSettings) {
    BrowserStorage.setJson(audioSettingsKey, audioSettings);
  }
  static setGroupCode(code: string) {
    BrowserStorage.set(groupCodeKey, code);
  }

  static setJson(key: StorageKey, value: any) {
    BrowserStorage.setLocalStorage(key, JSON.stringify(value));
  }

  static setRecentlyUsedLanguages(language: EditionLanguageDto) {
    let recentlyUsedLanguages = BrowserStorage.getRecentlyUsedLanguages();
    recentlyUsedLanguages = [language, ...recentlyUsedLanguages.filter((l) => l.code !== language.code)];
    BrowserStorage.setJson(recentLanguagesKey, recentlyUsedLanguages);
  }

  static setReaderParamsForPublication(params: ReaderParamsForPublication) {
    const readerParamsByPublication = (BrowserStorage.getJson(lastPassagesKey) ?? {}) as Record<
      string,
      ReaderParamsForPublication
    >;

    BrowserStorage.setJson(lastPassagesKey, {
      ...readerParamsByPublication,
      [params.publicationSlug]: params,
    });
  }

  static setLocalStorage(key: string, value: string) {
    const set = (k: string, v: string) => localStorage.setItem(k, v);
    setSafety(set)(key, value);
  }

  static removeLocalStorage(key: string) {
    const remove = (k: string) => localStorage.removeItem(k);
    setSafety(remove)(key);
  }

  static setReaderSettings(settings: Partial<ReaderSettings>) {
    const readerSettings = BrowserStorage.getReaderSettings() ?? {};

    BrowserStorage.setJson(readerSettingsKey, {
      ...readerSettings,
      ...settings,
    });
  }

  static setShowEditionIndicator(value: boolean) {
    BrowserStorage.set(showEditionIndicatorKey, String(value));
  }

  static setFeatures(features: Features) {
    BrowserStorage.setJson(featuresStorageKey, features);
  }

  static getFeatures(): Features | undefined {
    return BrowserStorage.getJson<Features>(featuresStorageKey);
  }

  static setUserClosedRoleSelectionModal(value: boolean) {
    BrowserStorage.set(userClosedRoleSelectionModalKey, String(value));
  }

  static hasFeature(feature: string) {
    const features = BrowserStorage.getFeatures();
    return features?.features.includes(feature);
  }
}

const getSafety =
  (getFn: (...args: any[]) => any) =>
  (...args: any[]) => {
    let value: string | undefined;
    try {
      value = getFn(...args);
    } catch (error) {
      console.warn((error as Error).message);
    }
    return value;
  };

const setSafety =
  (setFn: (...args: any[]) => any) =>
  (...args: any[]) => {
    try {
      setFn(...args);
    } catch (error) {
      console.warn((error as Error).message);
    }
  };
