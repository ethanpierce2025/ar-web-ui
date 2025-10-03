import { useGetPublication } from '@/hooks/api';
import { useNavigateToReaderUrl, useReadUrlParams } from '@/hooks/url';
import { routes } from '@/routes/routes';
import { BrowserStorage } from '@/utils/storage';
import { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ReadPage: FunctionComponent = () => {
  const { publicationSlug, publicationVersion } = useReadUrlParams();
  const { data: publication, isFetching } = useGetPublication({ publicationSlug, publicationVersion });
  const navigate = useNavigate();
  const navigateToReaderUrl = useNavigateToReaderUrl();

  const readerParams = BrowserStorage.getReaderParamsForPublication({
    slug: publicationSlug,
    version: publicationVersion,
  });

  useEffect(() => {
    if (isFetching) return;
    if (!publication) {
      navigate(routes.catalog.path);
      return;
    }

    const { left, right } = publication.defaultReader;

    const publicationHasReaderParamPrimary = publication.editions.some(
      (edition) => edition.language.code === readerParams?.language && edition.level === readerParams?.level,
    );

    const publicationHasReaderParamSecondary = publication.editions.some(
      (edition) =>
        edition.language.code === readerParams?.secondaryLanguage && edition.level === readerParams?.secondaryLevel,
    );

    // Default to cached reader params if available, otherwise use defaults
    //
    const language = readerParams && publicationHasReaderParamPrimary ? readerParams?.language : left.language;
    const level = readerParams && publicationHasReaderParamPrimary ? readerParams?.level : left.level;
    const position = readerParams?.position ?? 1;
    const secondaryLanguage =
      readerParams && publicationHasReaderParamSecondary ? readerParams.secondaryLanguage : right?.language;
    const secondaryLevel =
      readerParams && publicationHasReaderParamSecondary ? readerParams.secondaryLevel : right?.level;

    navigateToReaderUrl({
      language,
      level,
      position,
      publicationSlug,
      publicationVersion,
      secondaryLanguage,
      secondaryLevel,
    });
  }, [isFetching, navigate, navigateToReaderUrl, publication, publicationSlug, publicationVersion, readerParams]);

  return null;
};
