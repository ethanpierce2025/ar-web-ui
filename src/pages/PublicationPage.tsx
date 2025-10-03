import { PublicationHeader } from '@/components/reader/PublicationHeader';
import { ReaderOverview } from '@/components/reader/ReaderOverview';
import { ShareLink } from '@/components/teachers/ShareLink';
import { MaxWidthContainer } from '@/components/ui/MaxWidthContainer';
import { WithSkeleton } from '@/components/ui/Skeleton';
import { useGetPublication } from '@/hooks/api';
import { Event, useTrackEvent } from '@/hooks/events';
import { usePublicationUrlParams } from '@/hooks/url';
import { MainLayout } from '@/layouts/MainLayout';
import { routes } from '@/routes/routes';
import { FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

export const PublicationPage: FunctionComponent = () => {
  const { publicationSlug, publicationVersion } = usePublicationUrlParams();
  const { data: publication, isFetching } = useGetPublication({ publicationSlug, publicationVersion });
  const trackEvent = useTrackEvent();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (publication) {
      trackEvent(Event.ViewedNovel, {
        slug: publication.slug,
        version: publication.version,
      });
      window.scrollTo({
        behavior: 'smooth',
        top: 0,
      });
    }
  }, [publication]);

  const title = publication?.title ? `${publication.title} | Adaptive Reader` : undefined;

  const isMissing = !publication && !isFetching;

  const isLoading = isFetching && !publication;

  return (
    <>
      {isMissing ? (
        <NotFoundPage message="Unable to retrieve this Novel.  If you believe this is an error, please contact support@adaptivereader.com"></NotFoundPage>
      ) : (
        <MainLayout title={title}>
          <MaxWidthContainer className="flex flex-col gap-8 w-full md:px-8 md:pt-8">
            <div className="font-primary text-[16px] flex flex-row gap-2 self-start mb-4 md:p-0 p-4">
              <Link to={routes.catalog.path}>
                <span>Our Novels</span>
              </Link>
              <span>/</span>
              <span className="font-bold">{publication?.title}</span>
            </div>
            <PublicationHeader isLoading={isLoading} />
            <ShareLink />
            <WithSkeleton
              showSkeleton={isLoading}
              skeleton={
                <div className="w-[100%] ml-16">
                  <div className="animate-pulse h-7 bg-gray-300 rounded-full w-[75%] mb-4 mt-8" />
                  <div className="animate-pulse h-6 bg-gray-200 rounded-full w-[50%] mb-4 mt-8" />
                </div>
              }
            >
              <ReaderOverview infoData={publication?.infoData} />
            </WithSkeleton>
          </MaxWidthContainer>
        </MainLayout>
      )}
    </>
  );
};
