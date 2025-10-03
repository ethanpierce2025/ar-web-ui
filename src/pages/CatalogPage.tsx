import { Catalog } from '@/components/catalog/Catalog';
import { PublicationAvailabilityDropdown } from '@/components/catalog/CatalogAvailabilityDropdown';
import { CatalogSearch } from '@/components/catalog/CatalogSearch';
import { Link } from '@/components/ui/Link';
import { MaxWidthContainer } from '@/components/ui/MaxWidthContainer';
import { config } from '@/config';
import { requestContentLink, userUploadLink } from '@/constants';
import { Event, useTrackEvent } from '@/hooks/events';
import { useCatalogSearchParams } from '@/hooks/url';
import { MainLayout } from '@/layouts/MainLayout';
import { useGetPublications } from '@/queries/publications.query';
import { useGetCurrentUser } from '@/queries/users.query';
import { UrlKey, routes } from '@/routes/routes';
import { UserSelectDtoRoleEnum } from '@/types/api.types';
import { Feature } from '@/types/features.types';
import { PublicationAvailability } from '@/types/publication.types';
import { BrowserStorage } from '@/utils/storage';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const labelMap = {
  [PublicationAvailability.FREE]: 'Available',
};

const availabilityOptions = [
  { label: 'All Titles', value: '' },
  ...Object.values(PublicationAvailability).map((value) => ({
    label: labelMap[value],
    value,
  })),
];

export const CatalogPage: FunctionComponent = () => {
  const [availabilityIndex, setAvailabilityIndex] = useState(0);
  const availability = availabilityOptions[availabilityIndex].value as PublicationAvailability;

  const { page, search } = useCatalogSearchParams();

  const [searchValue, setSearchValue] = useState(search);

  const location = useLocation();

  const {
    query: { data, isLoading },
  } = useGetPublications();

  const hasUserUploadFeature = BrowserStorage.hasFeature(Feature.USER_UPLOAD);

  const [currentPage, setCurrentPage] = useState(Number(page));

  const trackEvent = useTrackEvent();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (currentPage) {
      trackEvent(Event.ViewedCatalog, {
        availability: availability || 'ALL',
        page: currentPage,
      });
      scrollToTop();
    }
  }, [availability, currentPage]);

  useEffect(() => {
    if (location.pathname === routes.catalog.path && !location.search) {
      setSearchValue('');
      setCurrentPage(1);
    }
  }, [location]);

  const onChangeAvailability = (index: number) => {
    setAvailabilityIndex(index);
    setCurrentPage(1);
  };

  const scrollToTop = () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  };

  const nextPage = () => {
    const query = new URLSearchParams(window.location.search);
    query.set(UrlKey.CATALOG_PAGE, (currentPage + 1).toString());
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    const query = new URLSearchParams(window.location.search);
    query.set(UrlKey.CATALOG_PAGE, (currentPage - 1).toString());
    setCurrentPage(currentPage - 1);
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const filteredData = data?.publications.filter((publication) => {
    const searchWords = searchValue.toLowerCase().split(/\s+/).filter(Boolean);
    // Split the title and author into words and check if any of the words start with the search word
    const titleWords = publication.title.toLowerCase().split(/\s+/);
    const authorWords = publication.author.toLowerCase().split(/\s+/);

    const matchesSearch = searchWords.every(
      (searchWord) =>
        titleWords.some((titleWord) => titleWord.startsWith(searchWord)) ||
        authorWords.some((authorWord) => authorWord.startsWith(searchWord)) ||
        publication.badges?.some((badge) => badge.label.toLowerCase().startsWith(searchWord)),
    );
    return matchesSearch && (availability ? publication.availability === availability : true);
  });

  const totalPages = filteredData?.length ? Math.ceil(filteredData.length / config.app.itemsPerPage) : 0;

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  if (currentPage <= 0) {
    setCurrentPage(1);
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (searchValue) {
      query.set(UrlKey.CATALOG_SEARCH, searchValue);
    } else {
      query.delete(UrlKey.CATALOG_SEARCH);
    }
    query.set(UrlKey.CATALOG_PAGE, currentPage.toString());
    const newUrl = `${window.location.pathname}?${query.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [currentPage, searchValue]);

  return (
    <MainLayout title="Our Novels | Adaptive Reader">
      <MaxWidthContainer className="flex flex-col flex-1 gap-8 w-full p-8 md:pt-16">
        <div className="flex w-full justify-between md:items-center flex-col md:flex-row gap-2">
          <h1 className="font-secondary font-semibold text-lg mb-2 whitespace-nowrap">Our Novels</h1>
          <div className="flex gap-2">
            <CatalogSearch
              onChange={onSearch}
              value={searchValue}
            ></CatalogSearch>
            <div className="w-[50%]">
              <PublicationAvailabilityDropdown
                activeIndex={availabilityIndex}
                onSelect={onChangeAvailability}
                options={availabilityOptions}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <Catalog
            currentPage={currentPage}
            data={{
              publications:
                filteredData?.slice(
                  (currentPage - 1) * config.app.itemsPerPage,
                  (currentPage - 1) * config.app.itemsPerPage + config.app.itemsPerPage,
                ) || [],
              totalPages,
            }}
            isLoading={isLoading}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
            setCurrentPage={setCurrentPage}
          />
          {filteredData?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center font-secondary md:mt-[60px] mt-[85px]">
              <div className="mb-4 text-lg">No results found</div>
              <Link
                to={requestContentLink}
                target="_blank"
              >
                <span className="font-primary font-bold text-[16px] leading-loose hover:underline text-[--share-link-bg]">
                  Request Content
                </span>
              </Link>
            </div>
          )}
        </div>
      </MaxWidthContainer>
    </MainLayout>
  );
};
