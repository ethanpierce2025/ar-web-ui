import { Close } from '@/assets/icons/Close';
import { Button } from '@/components/ui/Button';
import { Image } from '@/components/ui/Image';
import { useGetPublication } from '@/hooks/api';
import { useNavigateToListenUrl, useSelectPassageUrlParams } from '@/hooks/url';
import { MainLayout } from '@/layouts/MainLayout';
import { routes } from '@/routes/routes';
import { replaceUrlParams } from '@/utils/api-client';
import { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';

export const SelectPassagePage: FunctionComponent = () => {
  const { publicationSlug, publicationVersion, language, level } = useSelectPassageUrlParams();
  const { data: publication } = useGetPublication({ publicationSlug, publicationVersion });
  const navigateToListenUrl = useNavigateToListenUrl();
  const [selectedPassage, setSelectedPassage] = useState<number | undefined>();
  const [error, setError] = useState<string>('');

  const edition = publication?.editions.find((e) => e.language.code === language && e.level === level.toUpperCase());
  const maxPassage = edition?.passageCount || 1;

  const title = publication?.title ? `${publication?.title} | Adaptive Reader` : undefined;

  const handleStartListening = () => {
    if (!selectedPassage) {
      setError('Please enter a passage number');
      return;
    }

    if (selectedPassage < 1 || selectedPassage > maxPassage) {
      setError(`Please enter a number between 1 and ${maxPassage}`);
      return;
    }
    navigateToListenUrl({
      autoPlay: true,
      publicationSlug,
      publicationVersion,
      position: selectedPassage,
      language,
      level,
    });
  };

  const handlePassageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError('');

    const num = parseInt(value);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    if (num < 1 || num > maxPassage) {
      setError(`Please enter a number between 1 and ${maxPassage}`);
      return;
    }

    setSelectedPassage(num);
  };

  return (
    <MainLayout
      hideGroupCodeBanner
      title={title}
      showFooter={false}
      navbarProps={{
        author: publication?.author,
        disableBrandLink: true,
        displayItems: false,
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
    >
      <div className="flex flex-col w-full h-full max-w-[500px] px-4 py-8 space-y-8 justify-center items-center m-auto">
        <div className="sm:w-48 sm:h-48 w-36 h-36 mx-auto">
          <Image
            url={publication?.thumbnailImageUrl}
            className="w-full h-full rounded-md bg-cover bg-center shadow-md"
          />
        </div>
        <div className="border-t border-gray-200 pt-8 w-full">
          <div className="space-y-4">
            <input
              type="number"
              id="passage"
              onChange={handlePassageChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleStartListening();
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#103A3A] focus:border-transparent"
              placeholder={`Enter passage number`}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <Button
          onClick={handleStartListening}
          disabled={!selectedPassage}
          className="w-full !rounded-md"
        >
          Start Listening
        </Button>
      </div>
    </MainLayout>
  );
};
