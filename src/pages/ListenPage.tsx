import { Close } from '@/assets/icons/Close';
import { PassageInfo } from '@/components/listen/PassageInfo';
import { PassageNavigation } from '@/components/listen/PassageNavigation';
import { PassageTextPreview } from '@/components/listen/PassageTextPreview';
import { ShortcutNavigation } from '@/components/listen/ShortcutNavigation';
import { AudioPlayer, AudioState } from '@/components/reader/AudioPlayer';
import { Button } from '@/components/ui/Button';
import { GroupCodeInput } from '@/components/ui/GroupCodeInput';
import { useApp } from '@/context/app.context';
import { useGetPublication } from '@/hooks/api';
import { useListenUrlParams, useNavigateToListenUrl, useNavigateToReaderUrl } from '@/hooks/url';
import { MainLayout } from '@/layouts/MainLayout';
import { queryClient } from '@/queries/client';
import {
  GetPassageAudioResult,
  useGetAudioOnlyPassage,
  useGetAudioOnlyPassageOnDemand,
} from '@/queries/passages.query';
import { routes } from '@/routes/routes';
import { replaceUrlParams } from '@/utils/api-client';
import { formatSeconds } from '@/utils/time';
import { useUser } from '@clerk/clerk-react';
import { FunctionComponent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export const ListenPage: FunctionComponent = () => {
  const { autoPlay, language, level, publicationSlug, publicationVersion, position } = useListenUrlParams();
  const navigateToListenUrl = useNavigateToListenUrl();
  const navigateToReaderUrl = useNavigateToReaderUrl();
  const { data: publication } = useGetPublication({ publicationSlug, publicationVersion });
  const title = publication?.title ? `${publication?.title} | Adaptive Reader` : undefined;
  const { isSignedIn } = useUser();
  const { groupCode } = useApp();

  const [audioState, setAudioState] = useState<AudioState>({
    audioControlState: autoPlay ? 'Now Playing' : 'Paused',
    editionSelected: 'primary',
  });

  const [currentTime, setCurrentTime] = useState({ primary: 0, secondary: 0 });

  const edition = publication?.editions.find((e) => e.language.code === language && e.level === level.toUpperCase());

  const { data: passageData, isLoading: isPassageLoading } = useGetAudioOnlyPassage({
    editionId: edition?.id,
    position,
  });

  const { isSuccess: isPrimaryNextSuccess } = useGetAudioOnlyPassage({
    backgroundRequest: true,
    editionId: edition?.id,
    position: position + 1,
  });

  const totalAudioTime = formatSeconds(edition?.audioTotalLength);

  const readerUrl = `${window.location.origin}/${publicationSlug}/${publicationVersion}/${language}:${level}/${position}`;

  const { isPending: isLoading, mutate: getPassageAudio } = useGetAudioOnlyPassageOnDemand();

  const onSuccessfulGetPassageAudio = (data: GetPassageAudioResult) => {
    if (!passageData?.passage?.position || !edition) return;
    if (!data?.audio) return;
    passageData.passage.audio = data?.audio;
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[1] === edition.id && query.queryKey[2] === passageData?.passage?.position,
      queryKey: ['getAudioOnlyPassage'],
    });
  };

  const audioAvailable = useMemo(() => {
    if (!passageData || !edition) return false;

    if (edition.audioEnabled && !isPassageLoading && !passageData.passage?.audio) {
      getPassageAudio(
        {
          backgroundRequest: true,
          passageId: passageData.passage?.id,
          sourceId: edition.id,
        },
        { onSuccess: onSuccessfulGetPassageAudio },
      );
    }

    return edition.audioEnabled;
  }, [audioState.editionSelected, edition, passageData]);

  const onChangePosition = (newPosition: number) => {
    setCurrentTime({
      primary: 0,
      secondary: 0,
    });
    navigateToListenUrl({
      autoPlay: false,
      language,
      level,
      position: newPosition,
      publicationSlug,
      publicationVersion,
    });
  };

  const handlePassageNavigation = (direction: 'next' | 'previous') => {
    if (position) {
      const newPosition = direction === 'next' ? position + 1 : position - 1;
      if (newPosition > 0 && (!edition?.passageCount || newPosition <= edition.passageCount)) {
        onChangePosition(newPosition);
      }
    }
  };

  return (
    <MainLayout
      className="!px-0 !py-0 !justify-start !gap-0"
      hideGroupCodeBanner
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
      showFooter={false}
      title={title}
    >
      <div className="flex-1 mx-auto w-full max-w-[500px] px-4 py-8 pb-32 space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <PassageInfo
            title={publication?.title}
            author={publication?.author}
            thumbnailImageUrl={publication?.thumbnailImageUrl}
            languageName={edition?.language.name}
            level={level}
            publicationVersion={publicationVersion}
            position={position}
            totalPassages={edition?.passageCount}
            totalAudioTime={totalAudioTime}
          />
          <div className="border-t border-gray-200"></div>
          <ShortcutNavigation
            shortcuts={publication?.shortcuts}
            position={position || 1}
            onSelect={({ passage }) => onChangePosition(passage)}
          />
          <PassageTextPreview
            text={passageData?.passage?.text}
            loading={isPassageLoading}
          />
          <PassageNavigation
            position={position}
            totalPassages={edition?.passageCount}
            onPrevious={() => handlePassageNavigation('previous')}
            onNext={() => handlePassageNavigation('next')}
            onChangePosition={onChangePosition}
          />
        </div>
        <div className="text-center space-y-4">
          <p>Want to read along, switch levels, or explore more?</p>
          <div className="inline-grid grid-cols-1 gap-2">
            {isSignedIn || groupCode ? (
              <Link to={readerUrl}>
                <Button className="!font-bold !text-black !bg-white !border !border-gray-300 !rounded-md hover:!bg-gray-100">
                  Open in Reader
                </Button>
              </Link>
            ) : (
              <>
                <Link to={`${routes.signIn.path}?redirectUrl=${readerUrl}`}>
                  <Button className="!font-bold !text-black !bg-white !border !border-gray-300 !rounded-md hover:!bg-gray-100">
                    Sign In
                  </Button>
                </Link>
                <GroupCodeInput
                  editionId={edition?.id ?? 0}
                  onSuccess={() => {
                    navigateToReaderUrl({
                      language,
                      level,
                      position,
                      publicationSlug,
                      publicationVersion,
                    });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white">
        <AudioPlayer
          primaryPassage={passageData?.passage}
          secondaryPassage={undefined}
          audioState={audioState}
          closable={false}
          isLoading={isPassageLoading || isLoading}
          onNext={() => handlePassageNavigation('next')}
          setAudioState={setAudioState}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          isPrimaryNextSuccess={isPrimaryNextSuccess}
          isSecondaryNextSuccess={true}
          isLastPage={position === edition?.passageCount}
        />
      </div>
    </MainLayout>
  );
};
