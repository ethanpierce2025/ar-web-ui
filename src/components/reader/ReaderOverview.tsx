import { useGetPublication } from '@/hooks/api';
import { usePublicationUrlParams } from '@/hooks/url';
import { InfoData } from '@/types/publication.types';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Card } from '../ui/Card';
import { Tab } from '../ui/Tab';
import { Toolbar } from '../ui/Toolbar';
import { EnglishEditions } from './Editions';
import { Languages } from './Languages';

export type ReaderOverviewProps = {
  infoData?: InfoData[];
};

function getSectionId(index: number) {
  return `info-data-${index}`;
}

type ContentBlockProps = {
  index: number;
  title: string;
};

const ContentBlock: FunctionComponent<PropsWithChildren<ContentBlockProps>> = (props) => {
  const { children, index, title } = props;
  return (
    <div
      id={getSectionId(index)}
      key={title}
      className="flex flex-col gap-6"
    >
      <span className="font-secondary text-lg">{title}</span>
      {children}
    </div>
  );
};

export const ReaderOverview: FunctionComponent<ReaderOverviewProps> = (props) => {
  const { infoData = [] } = props;
  const { publicationSlug, publicationVersion } = usePublicationUrlParams();
  const { data: publication } = useGetPublication({ publicationSlug, publicationVersion });
  const otherLanguagesEditions = publication?.otherLanguagesEditions ?? [];
  const [activeSection, setActiveSection] = useState(0);

  const onScrollToSection = (index: number) => {
    setActiveSection(index);
    const section = document.querySelector(`#${getSectionId(index)}`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showLanguages = otherLanguagesEditions.length > 0;

  const indexStart = showLanguages ? 2 : 1;

  const dataElements: { title: string; element: React.ReactElement }[] = [
    {
      element: (
        <ContentBlock
          index={0}
          key="Reading Levels"
          title="Reading Levels"
        >
          <EnglishEditions />
        </ContentBlock>
      ),
      title: 'Reading Levels',
    },
    ...(showLanguages
      ? [
          {
            element: (
              <ContentBlock
                index={1}
                key="Languages"
                title="Languages"
              >
                <Languages />
              </ContentBlock>
            ),
            title: 'Languages',
          },
        ]
      : []),
    ...infoData.map(({ body, title }, index) => ({
      element: (
        <ContentBlock
          key={title}
          index={index + indexStart}
          title={title}
        >
          <div
            className="flex flex-col font-primary text-md gap-2"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </ContentBlock>
      ),
      title,
    })),
  ];

  return (
    <Card className="!rounded-none md:!rounded-[var(--card-border-radius)] px-4 pb-4 pt-7 lg:p-7">
      <Toolbar
        className="overflow-x-auto"
        showBorder={false}
      >
        <div className="min-w-max">
          {dataElements.map(({ title }, index) => (
            <Tab
              key={title}
              active={index === activeSection}
              className="font-bold"
              onClick={() => onScrollToSection(index)}
            >
              {title}
            </Tab>
          ))}
        </div>
      </Toolbar>
      <div className="pt-8 lg:pt-16 lg:mx-52 lg:pb-12 lg:pr-16">
        <div className="flex flex-col pt-11 gap-[52px]">{dataElements.map(({ element }) => element)}</div>
      </div>
    </Card>
  );
};
