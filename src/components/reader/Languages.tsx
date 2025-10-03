import { useGetPublication } from '@/hooks/api';
import { usePublicationUrlParams } from '@/hooks/url';
import { FunctionComponent } from 'react';

export const Languages: FunctionComponent = () => {
  const { publicationSlug, publicationVersion } = usePublicationUrlParams();
  const { data: publication } = useGetPublication({ publicationSlug, publicationVersion });
  const editions = publication?.editions ?? [];
  const languages = [...new Set([...editions.map((edition) => edition.language.name)])];

  return <div className="flex">{languages.join(', ')}.</div>;
};
