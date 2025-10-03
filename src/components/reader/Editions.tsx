import { useGetPublication } from '@/hooks/api';
import { usePublicationUrlParams } from '@/hooks/url';
import { FunctionComponent, useState } from 'react';
import { ButtonGroup, TransparentButton } from '../ui/Button';
import { Subtitle, Title } from '../ui/Text';
import { ReaderRate } from './ReaderRate';

export const EnglishEditions: FunctionComponent = () => {
  const { publicationSlug, publicationVersion } = usePublicationUrlParams();
  const { data: publication } = useGetPublication({ publicationSlug, publicationVersion });
  const [activeIndex, setActiveIndex] = useState(0);
  const englishEditions = publication?.englishEditions ?? [];

  function onSelect(index: number) {
    setActiveIndex(index);
  }

  const activeEdition = englishEditions.at(activeIndex);

  return (
    <div className="flex flex-col gap-6">
      <ButtonGroup
        className={`flex overflow-x-auto ${
          englishEditions.length > 2 ? 'justify-between w-full sm:w-fit sm:justify-start' : 'w-fit sm:justify-start'
        } `}
      >
        {englishEditions.map((edition, index) => (
          <TransparentButton
            key={edition.level}
            active={index === activeIndex}
            onClick={() => onSelect(index)}
          >
            {edition.level}
          </TransparentButton>
        ))}
      </ButtonGroup>

      <div className="flex gap-0 md:gap-[73px] justify-between md:justify-start">
        <div className="flex flex-col">
          <Subtitle className="uppercase text-[11px] text-sm">Total words</Subtitle>
          <Title className="!font-primary !text-[16px]">{activeEdition?.metadata?.totalWords?.toLocaleString()}</Title>
        </div>
        <div className="flex flex-col">
          <Subtitle className="uppercase text-[11px] sm:text-sm">Unique Words</Subtitle>
          <Title className="!font-primary !text-[16px]">{activeEdition?.metadata?.uniqueWords?.toLocaleString()}</Title>
        </div>
        {activeEdition?.lexileLevelFormatted && (
          <div className="flex flex-col">
            <Subtitle className="uppercase text-[11px] text-sm">Lexile Level</Subtitle>
            <Title className="!font-primary !text-[16px]">{activeEdition?.lexileLevelFormatted.toLocaleString()}</Title>
          </div>
        )}
        <div className="flex flex-col">
          <Subtitle className="uppercase text-[11px] text-sm">Reading Ease</Subtitle>
          <ReaderRate
            fill={activeEdition?.metadata?.readingEase ?? 0}
            total={5}
          />
        </div>
      </div>
    </div>
  );
};
