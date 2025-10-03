import { GetPassageParams1 } from '@/types/api.types';
import { ReaderParamsForPublication } from '@/utils/storage';

export const queryKeys = {
  passages: {
    getPassage: ({ editionId, groupCode, position }: Partial<GetPassageParams1> & { groupCode?: string }) => [
      'passages',
      'getPassage',
      editionId,
      position,
      groupCode,
    ],
    getAudioOnlyPassage: ({ editionId, groupCode, position }: Partial<GetPassageParams1> & { groupCode?: string }) => [
      'passages',
      'getAudioOnlyPassage',
      editionId,
      position,
      groupCode,
    ],
    getPassageAudio: ({}: { groupCode?: string }) => ['passages', 'getPassageAudio'],
  },
  ping: {
    getPing: ['ping', 'getPing'],
  },
  placeholder: {
    default: ['placeholder', 'default'],
  },
  publications: {
    getAudio: (params: ReaderParamsForPublication) => [
      'publications',
      'getAudio',
      params.publicationSlug,
      params.language,
      params.level,
      params.position,
      params.secondaryLanguage,
      params.secondaryLevel,
    ],
    getEdition: (params: Pick<ReaderParamsForPublication, 'language' | 'level' | 'publicationSlug'>) => [
      'publications',
      'getEdition',
      params.publicationSlug,
      params.language,
      params.level,
    ],
    getExcerpt: (params: ReaderParamsForPublication) => [
      'publications',
      'getExcerpt',
      params.publicationSlug,
      params.language,
      params.level,
      params.position,
      params.secondaryLanguage,
      params.secondaryLevel,
    ],
    getPassage: (params: { passageId: number }) => ['publications', 'getPassage', params.passageId],
    getPublication: (params: { publicationSlug: string; publicationVersion: string }) => [
      'publications',
      'getPublication',
      params.publicationSlug,
      params.publicationVersion,
    ],
    getPublications: () => ['publications', 'getPublications'],
  },
  qr: {
    getQrUrl: ['qrCode'],
  },
  users: {
    getCurrentUser: ['users', 'getCurrentUser'],
    getFeatures: ['users', 'getFeatures'],
  },
  visitors: {
    getVisitor: ['visitors', 'getVisitor'],
  },
  features: {
    getFeatures: (params: { groupCode: string }) => ['features', 'getFeatures', params.groupCode],
  },
};
