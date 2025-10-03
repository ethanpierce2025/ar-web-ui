import { config } from '@/config';
import { readerBackgroundHeader, readerClientIdHeader, readerGroupCodeHeader } from '@/constants';
import { SourceLevel } from '@/types/api.types';
import { generatePath } from 'react-router-dom';
import { BrowserStorage } from './storage';

type ApiError = {
  code?: number;
  message: string;
};

export class ApiErrors extends Error {
  errors: ApiError[];
  originalError?: Error;

  constructor(params: { errors: ApiError[]; originalError?: Error }) {
    super(params.errors[0].message);
    this.errors = params.errors;
    this.originalError = params.originalError;
  }
}

export class ApiUnauthorized extends ApiErrors {}

export class ApiForbidden extends ApiErrors {}

export enum ApiRoutesKey {
  createOnDemandSourceForPublication = 'createOnDemandSourceForPublication',
  getCurrentUser = 'getCurrentUser',
  getExcerpt = 'getExcerpt',
  getFeatures = 'getFeatures',
  getPassage = 'getPassage',
  getPassageAudio = 'getPassageAudio',
  getPassageAudioOnly = 'getPassageAudioOnly',
  getPassageAudioOnlyOnDemand = 'getPassageAudioOnlyOnDemand',
  getPassageDecode = 'getPassageDecode',
  getPassageSpeechMarks = 'getPassageSpeechMarks',
  getPing = 'getPing',
  getPublication = 'getPublication',
  getPublications = 'getPublications',
  getQrUrl = 'getQrUrl',
  getVisitor = 'getVisitor',
  updateUserRole = 'updateUserRole',
}

export enum ApiPathKey {
  POSITION = 'position',
  PUBLICATION_SLUG = 'publicationSlug',
  Qr = 'qrCode',
  PASSAGE_ID = 'passageId',
}

export const apiPath: Record<ApiRoutesKey, string> = {
  createOnDemandSourceForPublication: `/publications/${keyToPathParam(ApiPathKey.PUBLICATION_SLUG)}/sources/on-demand`,
  getCurrentUser: '/users/me',
  getExcerpt: `/publications/${keyToPathParam(ApiPathKey.PUBLICATION_SLUG)}/editions/passage`,
  getFeatures: '/features/me',
  getPassage: '/passages',
  getPassageAudio: `/passages/${keyToPathParam(ApiPathKey.PASSAGE_ID)}/audio`,
  getPassageAudioOnly: `/passages/audioOnly`,
  getPassageAudioOnlyOnDemand: `/passages/${keyToPathParam(ApiPathKey.PASSAGE_ID)}/audioOnly/onDemand`,
  getPassageDecode: `/passages/${keyToPathParam(ApiPathKey.PASSAGE_ID)}/decode`,
  getPassageSpeechMarks: `/passages/${keyToPathParam(ApiPathKey.PASSAGE_ID)}/speechMarks`,
  getPing: '/ping',
  getPublication: `/publications/${keyToPathParam(ApiPathKey.PUBLICATION_SLUG)}`,
  getPublications: '/publications',
  getQrUrl: `/qr/${keyToPathParam(ApiPathKey.Qr)}`,
  getVisitor: '/visitors/me',
  updateUserRole: '/users/me/role',
};

export type GetEditionUrlPathParams = {
  publicationSlug: string;
};

export type GetEditionUrlQueryParams = {
  languageCode: string;
  level: SourceLevel;
};

export type GetExcerptUrlPathParams = {
  publicationSlug: string;
};

export type GetExcerptUrlQueryParams = {
  languageCode: string;
  level: SourceLevel;
  position: string;
  secondaryLanguageCode?: string;
  secondaryLevel?: SourceLevel;
};

export type ErrorsResponse = {
  errors: ApiError[];
};

const fallbackErrorMessage = 'Something went wrong, please try again!';

async function processApiRequest<T>(request: Promise<Response>): Promise<T> {
  const response = await request;
  const data = await response.json();

  if (!response.ok) {
    const errorResponse = data as ErrorsResponse;
    const apiErrors: ApiError[] = errorResponse.errors ?? [{ message: fallbackErrorMessage }];

    let ApiError = ApiErrors;

    if (response.status === 401) {
      ApiError = ApiUnauthorized;
    }

    if (response.status === 403) {
      ApiError = ApiForbidden;
    }

    throw new ApiError({ errors: apiErrors });
  }

  return data;
}

export async function httpGet<T>(params: {
  accessToken?: string;
  backgroundRequest?: boolean;
  groupCode?: string;
  queryStringParameters?: any;
  url: string;
}): Promise<T> {
  for (const key in params.queryStringParameters) {
    if (params.queryStringParameters[key] === undefined) {
      delete params.queryStringParameters[key];
    }
  }
  return processApiRequest<T>(get(params));
}

export async function get(params: {
  accessToken?: string;
  backgroundRequest?: boolean;
  groupCode?: string;
  queryStringParameters?: Record<string, string>;
  url: string;
}) {
  const { accessToken, backgroundRequest, groupCode, queryStringParameters = {}, url } = params;

  const getUrl = new URL(url);
  for (const [key, value] of Object.entries(queryStringParameters)) {
    getUrl.searchParams.set(key, value);
  }

  return fetch(getUrl.toString(), {
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(groupCode && {
        [readerGroupCodeHeader]: groupCode,
      }),
      ...(backgroundRequest && {
        [readerBackgroundHeader]: 'true',
      }),
      [readerClientIdHeader]: BrowserStorage.getOrGenerateClientId(),
    },
  });
}

export function replaceUrlParams(params: {
  path: string;
  pathParams: Partial<Record<string, string | number>>;
  search?: string;
}) {
  const { path, pathParams, search } = params;
  return `${generatePath(path, pathParams)}${search ? `?${search.replace('?', '')}` : ''}`;
}

export function keyToPathParam(key: string) {
  return `:${key}`;
}

export function getApiUrl(params: { path: string; pathParams: any; search?: string }) {
  return `${config.api.baseUrl}${replaceUrlParams(params)}`;
}

type HttpPatchParams = {
  accessToken?: string;
  backgroundRequest?: boolean;
  body?: any;
  groupCode?: string;
  url: string;
};

export const httpPatch = async <T>(params: HttpPatchParams): Promise<T> => {
  const { accessToken, backgroundRequest, body, groupCode, url } = params;
  return processApiRequest<T>(
    fetch(url, {
      body: JSON.stringify(body),
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(groupCode && {
          [readerGroupCodeHeader]: groupCode,
        }),
        ...(backgroundRequest && {
          [readerBackgroundHeader]: 'true',
        }),
        'Content-Type': 'application/json',
        [readerClientIdHeader]: BrowserStorage.getOrGenerateClientId(),
      },
      method: 'PATCH',
    }),
  );
};

type HttpPostParams = {
  accessToken?: string;
  backgroundRequest?: boolean;
  body?: any;
  groupCode?: string;
  url: string;
};

export const httpPost = async <T>(params: HttpPostParams): Promise<T> => {
  const { accessToken, backgroundRequest, body, groupCode, url } = params;
  console.log('httpPost', url);
  return processApiRequest<T>(
    fetch(url, {
      body: JSON.stringify(body),
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(groupCode && {
          [readerGroupCodeHeader]: groupCode,
        }),
        ...(backgroundRequest && {
          [readerBackgroundHeader]: 'true',
        }),
        'Content-Type': 'application/json',
        [readerClientIdHeader]: BrowserStorage.getOrGenerateClientId(),
      },
      method: 'POST',
    }),
  );
};
