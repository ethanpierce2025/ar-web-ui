import { routes } from '@/routes/routes';
import { Publication } from '@/types/publication.types';
import { replaceUrlParams } from '@/utils/api-client';
import { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import { PremiumModal } from '../reader/PremiumModal';
import { Badge } from '../ui/Badge';
import { Image } from '../ui/Image';
import { Page, Paginator, PaginatorProps } from '../ui/Paginator';
import { WithSkeleton } from '../ui/Skeleton';
import { Subtitle, Title } from '../ui/Text';

export type CatalogCardProps = {
  isDisabled?: boolean;
  isLoading?: boolean;
  title: string;
  subtitle: string;
  imageUrl: string;
} & Pick<Publication, 'badges'>;

export const CatalogCard: FunctionComponent<CatalogCardProps> = (props) => {
  const { badges, imageUrl, isDisabled, isLoading, subtitle, title } = props;
  const hasBadges = badges && badges.length > 0;
  return (
    <div
      className={`${
        isDisabled ? 'opacity-60' : 'hover:shadow-lg'
      } bg-white flex flex-row gap-4 md:items-start md:gap-0 md:flex-col rounded-2xl px-5 py-4 md:p-0 md:rounded-lg overflow-hidden flex-1`}
    >
      <Image
        url={imageUrl}
        className="min-w-[85px] h-[85px] md:min-h-[150px] rounded-tr-[180px] rounded-tl-[180px] rounded-bl-2xl rounded-br-2xl md:rounded-none lg:min-h-[200px] md:w-full bg-cover bg-center"
      />
      <div className="flex flex-col-reverse md:flex-col md:p-5 md:gap-[5px] gap-[10px]">
        <div className="md:h-[90px] flex flex-col-reverse md:flex-col gap-[3px]">
          <WithSkeleton
            showSkeleton={isLoading}
            skeleton={<div className="animate-pulse h-5 bg-gray-200 rounded-full w-36 mb-4" />}
          >
            <Title className=" font-bold !text-[20px] w-full text-ellipsis md:line-clamp-2 line-clamp-1 mb-1">
              {title}
            </Title>
          </WithSkeleton>
          <WithSkeleton
            showSkeleton={isLoading}
            skeleton={<div className="animate-pulse h-4 bg-gray-200 rounded-full w-20 mb-4" />}
          >
            <Subtitle className="uppercase !text-[12px] mt-0 overflow-hidden line-clamp-1">{subtitle}</Subtitle>
          </WithSkeleton>
        </div>
        <div className={hasBadges ? '' : 'invisible'}>
          <Badge {...badges?.at(0)!} />
        </div>
      </div>
    </div>
  );
};

type CatalogProps = {
  currentPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  data?: { publications: Publication[]; totalPages: number };
  isLoading: boolean;
  setCurrentPage: (page: number) => void;
};

export const Catalog: FunctionComponent<CatalogProps> = (props) => {
  const { currentPage, data, isLoading, onNextPage, onPreviousPage, setCurrentPage } = props;

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const onRenderPaginatorPage: PaginatorProps['onRenderPageNumber'] = (params) => {
    const { currentPage, page } = params;
    return (
      <Page
        active={currentPage === page}
        key={`page_${page}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </Page>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-6 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CatalogCard
            imageUrl=""
            subtitle=""
            title=""
            key={`loading_${index}`}
            isLoading
          />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="font-primary text-lg">Seems we don't have content yet. Stay tuned</p>;
  }

  const { publications, totalPages } = data;

  return (
    <>
      <PremiumModal
        open={isPremiumModalOpen}
        onClose={(value) => setIsPremiumModalOpen(value)}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-6 lg:grid-cols-4 lg:gap-6">
        {publications.map(({ author, badges, slug, thumbnailImageUrl, title, version }) => {
          const catalog = (
            <CatalogCard
              badges={badges}
              isDisabled={false}
              imageUrl={thumbnailImageUrl}
              subtitle={author}
              title={title}
              key={slug}
            />
          );

          return (
            <Link
              to={replaceUrlParams({
                path: routes.publication.path,
                pathParams: {
                  publicationSlug: slug,
                  publicationVersion: version,
                },
              })}
              key={slug}
            >
              {catalog}
            </Link>
          );
        })}
      </div>
      {totalPages > 1 && (
        <Paginator
          className="mt-12"
          currentPage={currentPage}
          onNext={onNextPage}
          onPrevious={onPreviousPage}
          totalPages={totalPages}
          onRenderPageNumber={onRenderPaginatorPage}
        />
      )}
    </>
  );
};
