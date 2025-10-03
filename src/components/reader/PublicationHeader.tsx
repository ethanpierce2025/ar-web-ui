import { Image } from '@/components/ui/Image';
import { config } from '@/config';
import { useGetPublication } from '@/hooks/api';
import { usePublicationUrlParams } from '@/hooks/url';
import { UrlKey, routes } from '@/routes/routes';
import { replaceUrlParams } from '@/utils/api-client';
import { FunctionComponent } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { WithSkeleton } from '../ui/Skeleton';
import { Subtitle, Title } from '../ui/Text';

type PublicationHeaderProps = {
  isLoading: boolean;
};

export const PublicationHeader: FunctionComponent<PublicationHeaderProps> = (props) => {
  const { isLoading } = props;
  const { publicationSlug, publicationVersion } = usePublicationUrlParams();
  const { data: publication } = useGetPublication({ publicationSlug, publicationVersion });

  const showPublicationSkeleton = !publicationSlug || isLoading;
  const hasBadges = publication?.badges && publication.badges.length > 0;

  const firstBadge = publication?.badges?.at(0);

  return (
    <Card
      className={`!rounded-none md:!rounded-[var(--card-border-radius)] relative flex ${
        hasBadges ? 'h-[378px]' : 'h-[320px]'
      } mt-[40px] sm:pt-0 sm:pb-0 sm:pr-[42px] sm:pl-[300px] lg:pl-[352px] sm:h-[196px] sm:mt-[90px] lg:mb-0`}
    >
      <div className="flex flex-col flex-1 items-end w-full lg:flex-row lg:items-center">
        <div
          className={`absolute  w-[200px] h-[200px] ${
            hasBadges ? 'bottom-[218px]' : 'bottom-[160px]'
          } left-[calc((100%-200px)/2)] sm:w-[270px] sm:h-[270px] sm:bottom-0 sm:left-0 sm:m-4 lg:m-7 sm:top-[inherit]`}
        >
          <WithSkeleton
            skeleton={
              <div>
                <div className="rounded-b-2xl rounded-t-[180px] w-[200px] h-[200px] sm:w-[270px] sm:h-[270px] bg-cover bg-gray-300 animate-pulse" />
              </div>
            }
            showSkeleton={showPublicationSkeleton}
          >
            <Image
              url={publication?.thumbnailImageUrl}
              className="rounded-b-2xl rounded-t-[180px] h-full w-full bg-cover bg-center"
            />
          </WithSkeleton>
        </div>
        <div className="flex flex-1 items-end justify-center w-full sm:justify-between sm:items-center">
          <div className="flex sm:w-full flex-col gap-2 pb-4 sm:pb-0">
            <WithSkeleton
              showSkeleton={showPublicationSkeleton}
              skeleton={
                <div>
                  <div className="animate-pulse h-7 bg-gray-300 rounded-full w-36 mb-4" />
                  <div className="animate-pulse h-6 bg-gray-200 rounded-full w-28 mb-4" />
                </div>
              }
            >
              <div className="flex flex-col gap-6 w-full justify-between items-center sm:items-start md:gap-0 md:flex-row ">
                <div className="flex flex-col">
                  {hasBadges && config.app.renderAllBadges && (
                    <div className="flex flex-wrap gap-2 overflow-hidden md:mb-5 max-h-[30px] md:max-h-[60px]">
                      {publication?.badges?.map((badge) => (
                        <div
                          className="flex mx-auto sm:mx-0 sm:flex-row"
                          key={badge?.label}
                        >
                          {badge && <Badge {...badge} />}
                        </div>
                      ))}
                    </div>
                  )}
                  {hasBadges && !config.app.renderAllBadges && firstBadge && (
                    <div className="flex mx-auto sm:mx-0 sm:flex-row mb-5 ">
                      <Badge {...firstBadge} />
                    </div>
                  )}
                  <Title className="text-[24px] text-center leading-8 sm:text-xl sm:text-left">
                    {publication?.title}
                  </Title>
                  <Subtitle className="uppercase text-md text-center sm:text-left">by {publication?.author}</Subtitle>
                </div>
                <div className="flex flex-row gap-3 md:flex-col md:items-end my-auto ml-2">
                  <Button
                    as="a"
                    className="w-fit"
                    href={replaceUrlParams({
                      path: routes.read.path,
                      pathParams: {
                        [UrlKey.PUBLICATION_SLUG]: publicationSlug,
                        [UrlKey.PUBLICATION_VERSION]: publicationVersion,
                      },
                      search: location.search,
                    })}
                    rel="noopener noreferrer"
                  >
                    Read Online
                  </Button>

                  {/* {publication?.shopifyStoreUrl && (
                    <TrackingLink
                      href={publication?.shopifyStoreUrl}
                      target="_blank"
                      trackingLabel="Order Paperback"
                      className="min-w-[160px]"
                    >
                      <OutlineButton as="div">Order paperback</OutlineButton>
                    </TrackingLink>
                  )} */}
                </div>
              </div>
            </WithSkeleton>
          </div>
        </div>
      </div>
    </Card>
  );
};
