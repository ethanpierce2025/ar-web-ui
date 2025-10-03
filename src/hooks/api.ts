import { useGetPublication as useGetPublicationQuery } from '@/queries/publications.query';

export function useGetPublication(params: { publicationSlug: string; publicationVersion: string }) {
  return useGetPublicationQuery({ titleSlug: params.publicationSlug, version: params.publicationVersion });
}
