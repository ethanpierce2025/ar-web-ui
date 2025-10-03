export type RouteKey =
  | 'catalog'
  | 'debug'
  | 'legacyPublicationOverview'
  | 'listen'
  | 'notFound'
  | 'publication'
  | 'publicationWithoutVersion'
  | 'qr'
  | 'read'
  | 'readWithoutVersion'
  | 'reader'
  | 'root'
  | 'selectPassage';

export enum UrlKey {
  CATALOG_SEARCH = 'search',
  CATALOG_PAGE = 'p',
  GROUP_CODE = 'groupCode',
  LANGUAGES = 'languages',
  LEGACY_EDITION_SLUG = 'legacyEditionSlug',
  EDITION_SLUG = 'editionSlug',
  LEVELS = 'levels',
  POSITION = 'position',
  PUBLICATION_SLUG = 'publicationSlug',
  PUBLICATION_VERSION = 'publicationVersion',
  QR_CODE = 'qrCode',
  PLAYBACK_SPEED = 'playbackSpeed',
}

export type Route = {
  Icon?: (props: Record<string, any>) => JSX.Element;
  name: string;
  onClick?: () => void;
  path: string;
};

export enum TabKey {
  OVERVIEW = 'overview',
  TRANSLATIONS = 'translations',
}

export type ReaderSearchParams = {
  groupCode?: string;
  secondaryEdition?: string;
};

export type ReaderRouteSearchParams = {
  editionId?: string;
  position?: string;
};

export const routes: Record<RouteKey, Route> = {
  catalog: {
    name: 'Catalog',
    path: `/catalog`,
  },
  debug: {
    name: 'Debug',
    path: `/debug`,
  },
  listen: {
    name: 'Listen',
    path: `/listen/:${UrlKey.PUBLICATION_SLUG}/:${UrlKey.PUBLICATION_VERSION}/:${UrlKey.EDITION_SLUG}/:${UrlKey.POSITION}`,
  },
  legacyPublicationOverview: {
    name: 'Legacy Publication Overview',
    path: `/:${UrlKey.PUBLICATION_SLUG}/overview`,
  },
  notFound: {
    name: 'Not Found',
    path: `/not-found`,
  },
  publication: {
    name: 'Publication',
    path: `/:${UrlKey.PUBLICATION_SLUG}/:${UrlKey.PUBLICATION_VERSION}`,
  },
  publicationWithoutVersion: {
    name: 'Publication',
    path: `/:${UrlKey.PUBLICATION_SLUG}`,
  },
  qr: {
    name: 'Qr',
    path: `/qr/:${UrlKey.QR_CODE}`,
  },
  read: {
    name: 'Read',
    path: `/:${UrlKey.PUBLICATION_SLUG}/:${UrlKey.PUBLICATION_VERSION}/read`,
  },
  readWithoutVersion: {
    name: 'Read',
    path: `/:${UrlKey.PUBLICATION_SLUG}/read`,
  },
  reader: {
    name: 'Excerpt',
    path: `/:${UrlKey.PUBLICATION_SLUG}/*`,
  },
  root: {
    name: 'Home',
    path: '/',
  },
  selectPassage: {
    name: 'Select Passage',
    path: `/listen/:${UrlKey.PUBLICATION_SLUG}/:${UrlKey.PUBLICATION_VERSION}/:${UrlKey.EDITION_SLUG}`,
  },
};
