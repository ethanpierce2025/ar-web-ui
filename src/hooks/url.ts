import { config } from '@/config';
import { defaultPublicationVersion } from '@/constants';
import { UrlKey, routes } from '@/routes/routes';
import { SourceLevel } from '@/types/api.types';
import { BrowserStorage, ListenParamsForPublication, ReaderParamsForPublication } from '@/utils/storage';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const redirectUrlKey = 'redirectUrl';

export function useNavigateToReaderUrl() {
  const navigate = useNavigate();

  const navigateToReaderUrl = (params: ReaderParamsForPublication) => {
    const { language, level, position, publicationSlug, publicationVersion, secondaryLanguage, secondaryLevel } =
      params;

    const left = `${language}:${level}`;
    const right = secondaryLanguage && secondaryLevel ? `/${secondaryLanguage}:${secondaryLevel}` : '';

    navigate(`/${publicationSlug}/${publicationVersion}/${left}${right}/${position}`.toLowerCase());
  };

  return navigateToReaderUrl;
}

export function useNavigateToListenUrl() {
  const navigate = useNavigate();

  const navigateToListenUrl = (params: ListenParamsForPublication) => {
    const { language, level, position, publicationSlug, publicationVersion } = params;

    navigate(`/listen/${publicationSlug}/${publicationVersion}/${language}:${level}/${position}`.toLowerCase(), {
      state: {
        autoPlay: true,
      },
    });
  };

  return navigateToListenUrl;
}

export function useCatalogSearchParams() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get(UrlKey.CATALOG_SEARCH) || '';
  const page = searchParams.get(UrlKey.CATALOG_PAGE) || '1';
  return { page, search };
}

export function usePublicationUrlParams() {
  const navigate = useNavigate();
  const { publicationSlug, publicationVersion } = useParams<{
    [UrlKey.PUBLICATION_SLUG]: string;
    [UrlKey.PUBLICATION_VERSION]: string;
  }>();

  if (!publicationSlug || !publicationVersion) {
    navigate(routes.catalog.path);
    throw new Error('Invalid URL params');
  }

  return { publicationSlug, publicationVersion };
}

export function useQrCodeParams() {
  const { qrCode } = useParams<{ [UrlKey.QR_CODE]: string }>();

  if (!qrCode) {
    throw new Error('Invalid URL params');
  }

  return { qrCode };
}

export function useNavigateToQrRedirect() {
  const navigate = useNavigate();

  const nagivateToQrRedirectUrl = (url: string) => {
    const currentDomain = window.location.origin;

    if (url.startsWith(currentDomain)) {
      const relativePath = url.replace(currentDomain, '');
      navigate(relativePath, { replace: true });
    } else if (/^https?:\/\//.test(url)) {
      throw new Error('Navigation to a different domain is blocked.');
    } else if (url.startsWith('/')) {
      navigate(url, { replace: true });
    } else {
      navigate(`/${url}`, { replace: true });
    }
  };

  return nagivateToQrRedirectUrl;
}

export function useReadUrlParams() {
  const navigate = useNavigate();
  const { publicationSlug, publicationVersion } = useParams<{
    [UrlKey.PUBLICATION_SLUG]: string;
    [UrlKey.PUBLICATION_VERSION]: string;
  }>();

  if (!publicationSlug || !publicationVersion) {
    navigate(routes.catalog.path);
    throw new Error('Invalid URL params');
  }

  return { publicationSlug, publicationVersion };
}

export function useLegacyPublicationOverviewUrlParams() {
  const navigate = useNavigate();
  const { publicationSlug } = useParams<{ [UrlKey.PUBLICATION_SLUG]: string }>();

  if (!publicationSlug) {
    navigate(routes.catalog.path);
    throw new Error('Invalid URL params');
  }

  return { publicationSlug };
}

export function usePublicationWithoutVersionUrlParams() {
  const navigate = useNavigate();
  const { publicationSlug } = useParams<{ [UrlKey.PUBLICATION_SLUG]: string }>();

  if (!publicationSlug) {
    navigate(routes.catalog.path);
    throw new Error('Invalid URL params');
  }

  return { publicationSlug };
}

export function useReadWithoutVersionUrlParams() {
  const navigate = useNavigate();
  const { publicationSlug } = useParams<{ [UrlKey.PUBLICATION_SLUG]: string }>();

  if (!publicationSlug) {
    navigate(routes.catalog.path);
    throw new Error('Invalid URL params');
  }

  return { publicationSlug };
}

export function useLegacyReaderUrlParams() {
  const navigate = useNavigate();
  const location = useLocation();

  const { legacyEditionSlug, position, publicationSlug } = useParams<{
    [UrlKey.LEGACY_EDITION_SLUG]: string;
    [UrlKey.POSITION]: string;
    [UrlKey.PUBLICATION_SLUG]: string;
  }>();

  const positionInt = parseInt(position ?? '');
  if (!legacyEditionSlug || isNaN(positionInt) || !publicationSlug) {
    navigate(routes.catalog.path);
    throw new Error('Invalid URL params');
  }

  const searchParams = new URLSearchParams(location.search);
  const secondaryLegacyEditionSlug = searchParams.get('secondaryEdition') ?? undefined;

  return {
    legacyEditionSlug,
    position: positionInt,
    publicationSlug,
    secondaryLegacyEditionSlug,
  };
}

// This function handles both the current reader URL and the old reader URL format.
//
//   Examples of valid current URLs:
//     - Single column: /frankenstein/v1/en:original/11
//     - Dual column: /frankenstein/v1/en:original/es:gold/11
//
//   Examples of valid old URLs:
//     - Single column: /frankenstein/en/original/11
//     - Dual column: /frankenstein/en:es/original:gold/11
//
//   The reason all of the logic is here is because of how path matching works in
//   React router dom. Since there is nothing constant between the old and new URLs, we can't
//   use different paths for the old and new URLs. Instead, we have to handle the redirect
//   logic in the same component.
//
export function useReaderUrlParams(): {
  groupCode?: string;
  language: string;
  level: SourceLevel;
  position: number;
  publicationSlug: string;
  publicationVersion: string;
  renavigateToReaderUrl: boolean;
  secondaryLanguage?: string;
  secondaryLevel?: SourceLevel;
} {
  const location = useLocation();

  const { publicationSlug, ...rest } = useParams<{
    [UrlKey.PUBLICATION_SLUG]: string;
    '*': string; // ex. "/v1/en:original/11" or "/en/original/11"
  }>();

  const readerData = rest['*']?.split('/') ?? [];

  let renavigateToReaderUrl = false;

  let position = parseInt(readerData[readerData.length - 1] ?? '');
  if (isNaN(position)) {
    renavigateToReaderUrl = true;
    position = 1;
  } else {
    readerData.pop();
  }

  let language: string;
  let level: SourceLevel;
  let publicationVersion: string;
  let secondaryLanguage: string | undefined;
  let secondaryLevel: SourceLevel | undefined;

  // Parse reader columns
  //
  //   Valid current URL formats:
  //     - ["v1", "en:original"]
  //     - ["v1", "en:original", "es:gold"]
  //
  //   Valid old URL formats:
  //     - ["en", "original"]
  //     - ["en:es", "original:gold"]
  //
  const isOldUrl = !/^v\d+$/.test(readerData[0]);
  if (isOldUrl) {
    renavigateToReaderUrl = true;
    publicationVersion = defaultPublicationVersion;
    const [languages, levels] = readerData;
    [language, secondaryLanguage] = languages.split(':') as [string, string | undefined];
    [level, secondaryLevel] = (levels.split(':') as [string, string | undefined]).map(
      (level) => level?.toUpperCase() as SourceLevel,
    );
  } else {
    const [version, left, right] = readerData as [string, string, string | undefined];
    publicationVersion = version;
    [language, level] = left.split(':').map((level, index) => (index === 1 ? level.toUpperCase() : level)) as [
      string,
      SourceLevel,
    ];
    [secondaryLanguage, secondaryLevel] = (right
      ?.split(':')
      .map((level, index) => (index === 1 ? level.toUpperCase() : level)) as [string, SourceLevel]) ?? [
      undefined,
      undefined,
    ];
    if (!secondaryLanguage || !secondaryLevel) {
      secondaryLanguage = undefined;
      secondaryLevel = undefined;
    }
  }

  const searchParams = new URLSearchParams(location.search);
  const groupCode = searchParams.get(UrlKey.GROUP_CODE) ?? undefined;

  return {
    groupCode,
    language,
    level,
    position,
    publicationSlug: publicationSlug!,
    publicationVersion,
    renavigateToReaderUrl,
    secondaryLanguage,
    secondaryLevel,
  };
}

export function useReaderWithoutVersionUrlParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const { languages, levels, position, publicationSlug } = useParams<{
    [UrlKey.LANGUAGES]: string;
    [UrlKey.LEVELS]: string;
    [UrlKey.POSITION]: string;
    [UrlKey.PUBLICATION_SLUG]: string;
  }>();

  const positionInt = parseInt(position ?? '');
  if (!languages || !levels || isNaN(positionInt) || !publicationSlug) {
    navigate(routes.catalog.path);
    throw new Error('Invalid URL params');
  }

  const [language, secondaryLanguage] = languages.split(':') as [string, string | undefined];
  const [level, secondaryLevel] = levels.split(':') as [string, string | undefined];

  const searchParams = new URLSearchParams(location.search);
  const groupCode = searchParams.get(UrlKey.GROUP_CODE) ?? undefined;

  return {
    groupCode,
    language,
    level: level.toUpperCase() as SourceLevel,
    position: positionInt,
    publicationSlug,
    secondaryLanguage,
    secondaryLevel: secondaryLevel?.toUpperCase() as SourceLevel | undefined,
  };
}

export function useListenUrlParams() {
  const location = useLocation();
  const { editionSlug, publicationSlug, publicationVersion, position } = useParams<{
    [UrlKey.PUBLICATION_SLUG]: string;
    [UrlKey.PUBLICATION_VERSION]: string;
    [UrlKey.EDITION_SLUG]: string;
    [UrlKey.POSITION]: string;
  }>();
  if (!editionSlug || !publicationSlug || !publicationVersion || !position) {
    throw new Error('Invalid URL params');
  }
  const language = editionSlug.split(':')[0];
  const level = editionSlug.split(':')[1] as SourceLevel;
  const autoPlay = location.state?.autoPlay;
  return { publicationSlug, publicationVersion, position: Number(position), language, level, autoPlay };
}

export function useSelectPassageUrlParams() {
  const { editionSlug, publicationSlug, publicationVersion } = useParams<{
    [UrlKey.PUBLICATION_SLUG]: string;
    [UrlKey.PUBLICATION_VERSION]: string;
    [UrlKey.EDITION_SLUG]: string;
  }>();

  if (!editionSlug || !publicationSlug || !publicationVersion) {
    throw new Error('Invalid URL params');
  }

  const language = editionSlug.split(':')[0];
  const level = editionSlug.split(':')[1] as SourceLevel;

  return { publicationSlug, publicationVersion, language, level };
}

export function usePlaybackSpeedMapUrlParam() {
  const [searchParams] = useSearchParams();

  const playbackSpeedParam = searchParams.get(UrlKey.PLAYBACK_SPEED);

  if (playbackSpeedParam === 'default') return config.app.audioPlaybackSpeedDefaultMap;

  if (!playbackSpeedParam)
    return BrowserStorage.getAudioSettings()?.playbackSpeedMap || config.app.audioPlaybackSpeedDefaultMap;

  const pairs = playbackSpeedParam.split(',');

  const playbackSpeedMap: Record<number, number> = {};

  pairs.forEach((pair) => {
    const [original, mapped] = pair.split(':').map(Number);
    if (!isNaN(original) && !isNaN(mapped)) {
      playbackSpeedMap[original] = mapped;
    }
  });

  return playbackSpeedMap;
}

export function useRedirectUrlParam() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  function addRedirectUrl(baseUrl: string, redirectUrl: string) {
    return `${baseUrl}?${redirectUrlKey}=${redirectUrl}`;
  }

  return {
    addRedirectUrl,
    redirectUrl: searchParams.get(redirectUrlKey) ?? undefined,
  };
}
