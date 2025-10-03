import { Close } from '@/assets/icons/Close';
import { Reader } from '@/components/reader/Reader';
import { useGetPublication } from '@/hooks/api';
import { useNavigateToReaderUrl, useReaderUrlParams } from '@/hooks/url';
import { MainLayout } from '@/layouts/MainLayout';
import { routes } from '@/routes/routes';
import { replaceUrlParams } from '@/utils/api-client';
import { FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const ReaderPage: FunctionComponent = () => {
  const readerUrlParams = useReaderUrlParams();
  const { language, level, publicationSlug, publicationVersion, secondaryLanguage, secondaryLevel } = readerUrlParams;
  const navigateToReaderUrl = useNavigateToReaderUrl();
  const { data: publication } = useGetPublication({ publicationSlug, publicationVersion });
  const title = publication?.title ? `${publication?.title} | Adaptive Reader` : undefined;

  useEffect(() => {
    if (readerUrlParams.renavigateToReaderUrl) {
      navigateToReaderUrl(readerUrlParams);
    }
  }, [navigateToReaderUrl, readerUrlParams]);

  return (
    <MainLayout
      hideGroupCodeBanner
      navbarProps={{
        author: publication?.author,
        disableBrandLink: true,
        displayItems: false,
        forReader: true,
        hideTitleOnMobile: false,
        rightComponent: (
          <Link
            to={replaceUrlParams({
              path: routes.publication.path,
              pathParams: { publicationSlug, publicationVersion },
            })}
          >
            <Close />
          </Link>
        ),
        title: publication?.title,
      }}
      showFooter={false}
      title={title}
    >
      <Reader key={`${publicationSlug}${language}${secondaryLanguage}${level}${secondaryLevel}`} />
    </MainLayout>
  );
};
