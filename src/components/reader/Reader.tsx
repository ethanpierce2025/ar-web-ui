import { highlightDefault } from '@/constants';
import { useApp } from '@/context/app.context';
import { useGetPublication } from '@/hooks/api';
import { Event, useTrackEvent } from '@/hooks/events';
import { useOnPressKey } from '@/hooks/keyboard';
import { useScrollToTop } from '@/hooks/scroll';
import { useBreakpoints } from '@/hooks/tailwinds';
import { useNavigateToReaderUrl, useReaderUrlParams } from '@/hooks/url';
import { useOnDemandSourceCreation } from '@/hooks/useOnDemandSourceCreation';
import { queryClient } from '@/queries/client';
import { queryKeys } from '@/queries/keys';
import {
  GetPassageAudioResult,
  GetPassageResult,
  useGetPassage,
  useGetPassageAudio,
  useGetPassageSpeechMarks,
} from '@/queries/passages.query';
import { createOnDemandSourceForPublication } from '@/queries/publications.query';
import { EditionSelectDto, SpeechMarksResponseDto } from '@/types/api.types';
import { Feature } from '@/types/features.types';
import { PublicationRenderingMode, PublicationShortcut } from '@/types/publication.types';
import { ApiErrors } from '@/utils/api-client';
import { slugifyEditionLevel } from '@/utils/edition';
import { hasLanguageFreeAudio } from '@/utils/feature';
import { BrowserStorage } from '@/utils/storage';
import { FunctionComponent, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { MaxWidthContainer } from '../ui/MaxWidthContainer';
import { Page, PaginatorProps } from '../ui/Paginator';
import { AudioState, CurrentTime } from './AudioPlayer';
import { BottomToolbar } from './BottomToolbar';
import { IllustratedImage } from './IllustratedImage';
import { PageReader } from './PageReader';
import { PremiumFeatureModal } from './PremiumFeatureModal';
import { ColumnItem, columnsOptions } from './ReaderColumnsDropdown';
import { defaultFontSize, defaultIllustratedFontSize, fontsizeOptions } from './ReaderFontSizeDropdown';
import { TopToolbar } from './TopToolbar';

export const ReaderTextContainer = styled.div<{ fontSize?: string }>`
  color: var(--text-font-color);
  font-family: var(--font-family-primary);
  font-size: ${({ fontSize }) => fontSize ?? 'var(--font-size-medium)'};
  padding-bottom: 0;
  position: relative;
  &::after {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 100%);
    bottom: 0;
    content: '';
    height: 40px;
    position: absolute;
    width: 100%;
    z-index: 2;
  }
`;

export const TextSkeleton: FunctionComponent = () => (
  <div className="flex flex-1 flex-col pt-11 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-200 w-full mb-4" />
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-300 w-2/3 mb-4" />
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-200 w-full mb-4" />
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-300 w-full mb-4" />
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-200 w-full mb-4" />
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-300 w-4/5 mb-4" />
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-300 w-full mb-4" />
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-200 w-1/2 mb-4" />
  </div>
);

export const toolTipStyle = {
  backgroundColor: '#081735B3',
  borderRadius: '4px',
  color: 'white',
  fontSize: '10px',
  padding: '2px 4px',
  text: 'var(--tooltip-text)',
  zIndex: 9999,
};

export const Reader: FunctionComponent = () => {
  const { groupCode } = useApp();
  const location = useLocation();
  const navigateToReaderUrl = useNavigateToReaderUrl();
  const { language, level, position, publicationSlug, publicationVersion, secondaryLanguage, secondaryLevel } =
    useReaderUrlParams();
  const { data: publication, error: publicationError } = useGetPublication({ publicationSlug, publicationVersion });

  const [primaryEdition, setPrimaryEdition] = useState<EditionSelectDto | undefined>(undefined);
  const [secondaryEdition, setSecondaryEdition] = useState<EditionSelectDto | undefined>(undefined);
  const [primaryEditionMissing, setPrimaryEditionMissing] = useState(false);
  const [secondaryEditionMissing, setSecondaryEditionMissing] = useState(false);

  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    primary: 0,
    secondary: 0,
  });

  const {
    data: primaryPassageData,
    error: primaryPassageError,
    isLoading: isLoadingPrimaryPassage,
  } = useGetPassage({
    editionId: primaryEdition?.id,
    position,
  });

  const {
    data: secondaryPassageData,
    error: secondaryPassageError,
    isLoading: isLoadingSecondaryPassage,
  } = useGetPassage({
    editionId: secondaryEdition?.id,
    position,
  });

  // Background requests for next and previous passage
  //
  const { isSuccess: isPrimaryNextSuccess } = useGetPassage({
    backgroundRequest: true,
    editionId: primaryEdition?.id,
    position: position + 1,
  });
  useGetPassage({ backgroundRequest: true, editionId: primaryEdition?.id, position: position - 1 });
  const { isSuccess: isSecondaryNextSuccess } = useGetPassage({
    backgroundRequest: true,
    editionId: secondaryEdition?.id,
    position: position + 1,
  });
  useGetPassage({ backgroundRequest: true, editionId: secondaryEdition?.id, position: position - 1 });

  const { isPending: isLoading, mutate: getPassageAudio } = useGetPassageAudio();

  const {
    mutate: getPassageSpeechMarks,
    isPending: isLoadingSpeechMarks,
    isError: isErrorSpeechMarks,
  } = useGetPassageSpeechMarks();

  const { mutate: createOnDemandSource, isPending: isCreatingOnDemandSource } = createOnDemandSourceForPublication();

  useOnDemandSourceCreation({
    editionMissing: primaryEditionMissing,
    createOnDemandSource,
    isCreatingOnDemandSource,
    language,
    level,
    publicationVersion: publication?.version ?? '',
  });

  useOnDemandSourceCreation({
    editionMissing: secondaryEditionMissing && Boolean(secondaryLanguage && secondaryLevel),
    createOnDemandSource,
    isCreatingOnDemandSource,
    language: secondaryLanguage ?? '',
    level: secondaryLevel ?? '',
    publicationVersion: publication?.version ?? '',
  });

  const trackEvent = useTrackEvent();
  const isLargePlus = useBreakpoints('lg');
  const isMediumPlus = useBreakpoints('md');

  const [selectedFontSizeIndex, setSelectedFontSizeIndex] = useState(getActiveFontSize);

  const [selectedColumnsIndex, setSelectedColumnsIndex] = useState(getActiveColumns);

  const fontSize = fontsizeOptions[selectedFontSizeIndex].value;
  const fontSizeLabel = fontsizeOptions[selectedFontSizeIndex].label;

  const audioSettings = BrowserStorage.getAudioSettings();

  const [audioState, setAudioState] = useState<AudioState>({
    audioControlState: audioSettings ? 'Paused' : 'Closed',
    editionSelected: audioSettings ? audioSettings.editionSelected : 'primary',
  });

  const hasAudioAccess = BrowserStorage.hasFeature(Feature.AUDIO);

  const decodeEnabled = BrowserStorage.getReaderSettings()?.decodeEnabled ?? false;
  const decodePermitted = BrowserStorage.hasFeature(Feature.DECODE);
  const decodeAvailable = Boolean(primaryEdition?.decodeEnabled || secondaryEdition?.decodeEnabled);
  const canDecode = Boolean(decodeAvailable && decodePermitted);

  const [decode, setDecode] = useState(canDecode && decodeEnabled);

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const handleDecodeToggle = (enabled: boolean) => {
    if (enabled && highlight) {
      setHighlight(false);
    }
    setDecode(enabled);
    BrowserStorage.setReaderSettings({
      ...BrowserStorage.getReaderSettings(),
      decodeEnabled: enabled,
    });
  };

  const handleHighlightChange = (enabled: boolean) => {
    if (enabled && decode) {
      setDecode(false);
    }
    setHighlight(enabled);

    if (audioSettings) {
      BrowserStorage.setAudioSettings({
        ...audioSettings,
        highlight: enabled,
      });
    }

    const speechMarksExist = currentPassage?.passage?.audio?.speechMarks;
    const speechMarksEmpty = Object.keys(speechMarksExist ?? {}).length === 0;
    if (
      enabled &&
      currentPassage?.passage?.audio &&
      currentSource?.highlightModeEnabled &&
      speechMarksEmpty &&
      !isLoadingSpeechMarks &&
      !isLoading &&
      !isErrorSpeechMarks
    ) {
      const position = currentPassage.passage.position;
      const editionId = currentSource.id;

      getPassageSpeechMarks(
        { passageId: currentPassage.passage.id },
        {
          onSuccess: (data: SpeechMarksResponseDto) => onSuccessfulGetPassageSpeechMarks(data, position, editionId),
        },
      );
    }
  };

  const isIllustratedMode = publication?.renderingMode === PublicationRenderingMode.ILLUSTRATED && isMediumPlus;

  const currentSource = audioState.editionSelected === 'primary' ? primaryEdition : secondaryEdition;

  const currentPassage = audioState.editionSelected === 'primary' ? primaryPassageData : secondaryPassageData;

  const highlightAvailable = Boolean(currentSource?.highlightModeEnabled && !isLoadingSpeechMarks);

  const highlightPreferred = BrowserStorage.getAudioSettings()?.highlight ?? highlightDefault;

  const [highlight, setHighlight] = useState(highlightAvailable && highlightPreferred);

  useEffect(() => {
    setHighlight(highlightAvailable && highlightPreferred);
  }, [highlightAvailable, highlightPreferred]);

  const decodeTooltipMessage = (() => {
    if (!BrowserStorage.hasFeature(Feature.DECODE)) {
      return 'Decode Mode requires a school license.';
    }

    if (!primaryEdition?.decodeEnabled) {
      return 'Decode Mode not available';
    }

    return 'Decode Mode visually reinforces phonics with NoahText. English only.';
  })();

  const highlightTooltipMessage = (() => {
    return 'Highlight text as audio plays';
  })();

  useEffect(() => {
    setDecode(Boolean(decodeAvailable && decodeEnabled && decodePermitted));
  }, [decodeAvailable, decodeEnabled, decodePermitted]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    if (isIllustratedMode) {
      setSelectedFontSizeIndex(getActiveFontSize);
    }
    const primaryEdition = publication?.editions.find(
      (edition) => edition.language.code === language && edition.level === level,
    );
    const secondaryEdition =
      secondaryLanguage && secondaryLevel
        ? publication?.editions.find(
            (edition) => edition.language.code === secondaryLanguage && edition.level === secondaryLevel,
          )
        : undefined;

    // Redirect to the last passage if the position is greater than the total number of passages
    if (primaryEdition && position > primaryEdition?.passageCount) {
      navigateToReaderUrl({
        language,
        level,
        position: primaryEdition.passageCount,
        publicationSlug,
        publicationVersion,
        secondaryLanguage,
        secondaryLevel,
      });
    }

    if (publication && !primaryEdition) setPrimaryEditionMissing(true);
    else setPrimaryEditionMissing(false);
    if (publication && !secondaryEdition) setSecondaryEditionMissing(true);
    else setSecondaryEditionMissing(false);

    // TODO - "EditionSelectDto" is the real type directly from the API, but "publication" needs to be
    //   refactored first to use the correct type, so doing this override here
    //
    setPrimaryEdition(primaryEdition as unknown as EditionSelectDto);
    setSecondaryEdition(secondaryEdition as unknown as EditionSelectDto);
  }, [publication]);

  const sendGenericReaderEvent = (event: Event) => {
    trackEvent(event, {
      ...(audioSettings?.autoPlay && {
        audio: true,
        audioAutoplay: audioSettings.autoPlay,
        audioSpeed: audioSettings.playbackSpeed,
      }),
      fontSize: fontSizeLabel,
      passage: Number(position),
      primaryEdition: `${language}-${slugifyEditionLevel(level)}`,
      primaryLanguage: language,
      primaryLevel: level,
      publication: publicationSlug,
      secondaryEdition:
        secondaryLanguage && secondaryLevel ? `${secondaryLanguage}-${slugifyEditionLevel(secondaryLevel)}` : undefined,
      secondaryLanguage: secondaryLanguage,
      secondaryLevel: secondaryLevel,
    });
  };

  const onAudioPlayerAudioChanged = (newAudioState: AudioState) => {
    setAudioState(newAudioState);

    const newAudioControlState = newAudioState.audioControlState;
    const previousAudioControlState = audioState.audioControlState;

    let event: Event | undefined;
    if (previousAudioControlState === 'Now Playing' && newAudioControlState === 'Paused') {
      event = Event.PausedAudio;
    } else if (previousAudioControlState === 'Paused' && newAudioControlState === 'Now Playing') {
      event = Event.ResumedAudio;
    } else {
      event = undefined;
    }

    if (event) {
      sendGenericReaderEvent(event);
    }
  };

  const onPageReaderAudioChange = (newAudioState: AudioState) => {
    setAudioState(newAudioState);

    const newAudioControlState = newAudioState.audioControlState;
    const previousAudioControlState = audioState.audioControlState;

    let event: Event | undefined;
    if (previousAudioControlState !== 'Closed' && newAudioControlState === 'Closed') {
      event = Event.ClosedAudioPlayer;
    } else if (previousAudioControlState === 'Closed' && newAudioControlState !== 'Closed') {
      event = Event.OpenedAudioPlayer;
    } else {
      event = undefined;
    }

    if (event) {
      sendGenericReaderEvent(event);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    BrowserStorage.setReaderParamsForPublication({
      language,
      level,
      position,
      publicationSlug,
      publicationVersion,
      secondaryLanguage,
      secondaryLevel,
    });
    sendGenericReaderEvent(Event.ViewedPassage);
  }, [location]);

  const currentPosition = position;

  const totalPages = Math.max(...(publication?.editions.map((edition) => edition.passageCount) ?? [0]));

  useOnPressKey(onKeyPress);

  function onKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        onPreviousPage();
        break;
      case 'ArrowRight':
        onNextPage();
        break;
      default:
        break;
    }
  }

  const onChangePosition = (newPosition: number) => {
    navigateToReaderUrl({
      language,
      level,
      position: newPosition,
      publicationSlug,
      publicationVersion,
      secondaryLanguage,
      secondaryLevel,
    });
  };

  const onChangeEdition = (selectedEdition: EditionSelectDto) => {
    navigateToReaderUrl({
      language: selectedEdition.language.code,
      level: selectedEdition.level,
      position,
      publicationSlug,
      publicationVersion,
      secondaryLanguage,
      secondaryLevel,
    });
  };

  const onChangeSecondaryEdition = (selectedEdition: EditionSelectDto) => {
    navigateToReaderUrl({
      language,
      level,
      position,
      publicationSlug,
      publicationVersion,
      secondaryLanguage: selectedEdition.language.code,
      secondaryLevel: selectedEdition.level,
    });
  };

  const onNextPage = () => {
    setCurrentTime({
      primary: 0,
      secondary: 0,
    });
    onChangePosition(Math.min(currentPosition + 1, totalPages));
  };

  const onPreviousPage = () => {
    setCurrentTime({
      primary: 0,
      secondary: 0,
    });
    onChangePosition(Math.max(1, currentPosition - 1));
  };

  const onRenderPaginatorPage: PaginatorProps['onRenderPageNumber'] = (params) => {
    const { currentPage, page } = params;

    return (
      <Page
        active={currentPage === page}
        key={`page_${page}`}
      >
        <div
          onClick={() =>
            navigateToReaderUrl({
              language,
              level,
              position: page,
              publicationSlug,
              publicationVersion,
              secondaryLanguage,
              secondaryLevel,
            })
          }
        >
          {page}
        </div>
      </Page>
    );
  };

  function getActiveFontSize() {
    const isIllustratedMode = publication?.renderingMode === PublicationRenderingMode.ILLUSTRATED;

    const activeColumn = getActiveColumns();
    if (isIllustratedMode && activeColumn === 0) {
      const illustratedFontSize =
        BrowserStorage.getReaderSettings()?.illustratedModeFontSize ?? defaultIllustratedFontSize;
      return fontsizeOptions.findIndex(({ id }) => id === illustratedFontSize);
    }
    const activeFontSize = BrowserStorage.getReaderSettings()?.fontSize ?? defaultFontSize;
    return fontsizeOptions.findIndex(({ id }) => id === activeFontSize);
  }

  function getActiveColumns() {
    const activeColumns: ColumnItem['id'] = secondaryLanguage && secondaryLevel ? 'two-column' : 'one-column';

    return columnsOptions.findIndex(({ id }) => id === activeColumns);
  }

  const onSelectFontSizeIndex = (index: number) => {
    if (isIllustratedMode) {
      BrowserStorage.setReaderSettings({
        illustratedModeFontSize: fontsizeOptions[index].id,
      });
    } else {
      BrowserStorage.setReaderSettings({
        fontSize: fontsizeOptions[index].id,
      });
    }
    setSelectedFontSizeIndex(index);
  };

  const onSelectColumnIndex = (index: number) => {
    const columnsOptionId = columnsOptions[index].id;

    if (!publication || !primaryEdition) {
      return;
    }

    if (columnsOptionId === 'one-column') {
      navigateToReaderUrl({
        language,
        level,
        position,
        publicationSlug,
        publicationVersion,
      });
    } else {
      navigateToReaderUrl({
        language,
        level,
        position,
        publicationSlug,
        publicationVersion,
        secondaryLanguage: language,
        secondaryLevel: level,
      });
    }

    setSelectedFontSizeIndex(getActiveFontSize);

    setSelectedColumnsIndex(index);
  };

  const onSuccessfulGetPassageAudio = (data: GetPassageAudioResult) => {
    const passageData = audioState.editionSelected === 'primary' ? primaryPassageData : secondaryPassageData;
    const selectedEdition = audioState.editionSelected === 'primary' ? primaryEdition : secondaryEdition;
    if (!passageData?.passage?.position || !selectedEdition) return;
    if (!data?.audio) return;
    passageData.passage.audio = data?.audio;
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[1] === selectedEdition.id && query.queryKey[2] === passageData?.passage?.position,
      queryKey: ['getPassage'],
    });
  };

  const audioAvailable = useMemo(() => {
    const editionToCheck = audioState.editionSelected === 'primary' ? primaryEdition : secondaryEdition;
    const passageData = audioState.editionSelected === 'primary' ? primaryPassageData : secondaryPassageData;

    if (!passageData || !editionToCheck) return false;

    const isFreeLanguage = hasLanguageFreeAudio(editionToCheck.language.code);

    if (!hasAudioAccess && !isFreeLanguage) return false;

    if (editionToCheck.audioEnabled && !isLoading && !passageData.passage?.audio) {
      getPassageAudio(
        {
          backgroundRequest: true,
          passageId: passageData.passage?.id,
          sourceId: editionToCheck.id,
        },
        { onSuccess: onSuccessfulGetPassageAudio },
      );
    }
    return editionToCheck.audioEnabled;
  }, [audioState.editionSelected, primaryEdition, secondaryEdition, primaryPassageData, secondaryPassageData]);

  useEffect(() => {
    if (highlightAvailable && highlightPreferred) {
      handleHighlightChange(true);
    }
  }, [highlightAvailable, highlightPreferred, primaryPassageData, secondaryPassageData]);

  const onSuccessfulGetPassageSpeechMarks = (data: SpeechMarksResponseDto, position?: number, editionId?: number) => {
    const capturedPosition = position ?? currentPassage?.passage?.position;
    const capturedEditionId = editionId ?? currentSource?.id;

    if (!capturedPosition || !capturedEditionId) return;
    if (!data?.speechMarks || !currentPassage?.passage?.audio) return;

    const key = queryKeys.passages.getPassage({
      editionId: capturedEditionId,
      position: capturedPosition,
      groupCode,
    });

    queryClient.setQueryData<GetPassageResult>(key, (prev) => {
      if (!prev?.passage?.audio) return prev;
      return {
        ...prev,
        passage: {
          ...prev.passage,
          audio: {
            ...prev.passage.audio,
            speechMarks: data.speechMarks,
          },
        },
      } as GetPassageResult;
    });

    queryClient.invalidateQueries({
      queryKey: key,
      refetchType: 'active',
    });
  };

  const isSectionStarter = Boolean(publication?.shortcuts?.find((shortcut) => shortcut.passage === currentPosition));

  const isGroupCodeRequired = Boolean(primaryPassageData?.groupCodeRequired || secondaryPassageData?.groupCodeRequired);

  const isTwoColumns = columnsOptions[selectedColumnsIndex].id === 'two-column';

  const showTwoColumns = isLargePlus && isTwoColumns && !isGroupCodeRequired;

  useScrollToTop([position]);

  const primaryEditionError =
    !isCreatingOnDemandSource &&
    ((primaryEditionMissing && new ApiErrors({ errors: [{ code: 404, message: 'Passage not found' }] })) ||
      primaryPassageError ||
      publicationError);

  const secondaryEditionError =
    !isCreatingOnDemandSource &&
    ((secondaryEditionMissing && new ApiErrors({ errors: [{ code: 404, message: 'Passage not found' }] })) ||
      secondaryPassageError ||
      publicationError);

  const shortcuts = (primaryEdition?.shortcuts?.length ?? 0) > 0 ? primaryEdition?.shortcuts : publication?.shortcuts;

  return (
    <>
      <div
        // Adds padding to the bottom of the page when the audio player is open due to the audio player being sticky
        className={`flex flex-col w-full ${!isGroupCodeRequired && audioState.audioControlState !== 'Closed' ? 'pb-24' : 'pb-4'}`}
      >
        <TopToolbar
          canDecode={canDecode}
          currentPosition={currentPosition}
          decode={decode}
          decodeTooltipMessage={decodeTooltipMessage}
          fontsizeOptions={fontsizeOptions}
          isMediumPlus={isMediumPlus}
          isLargePlus={isLargePlus}
          onDecodeClick={() => {
            if (!BrowserStorage.hasFeature(Feature.DECODE)) {
              setIsPremiumModalOpen(true);
            }
          }}
          onInputPageChange={onChangePosition}
          onSelectFontSizeIndex={onSelectFontSizeIndex}
          onSelectColumnIndex={onSelectColumnIndex}
          onToggleDecode={handleDecodeToggle}
          shortcuts={(shortcuts as unknown as PublicationShortcut[]) ?? []}
          selectedColumnsIndex={selectedColumnsIndex}
          selectedFontSizeIndex={selectedFontSizeIndex}
          totalPages={totalPages}
        />

        <MaxWidthContainer className="flex flex-col md:p-8 pt-4">
          <Card className="px-8 pt-4 pb-4 mx-auto border">
            {showTwoColumns && (
              <div className="flex">
                <PageReader
                  decodeEnabled={decode}
                  currentPosition={currentPosition}
                  edition={primaryEdition}
                  error={primaryEditionError as ApiErrors | null}
                  passageData={primaryPassageData?.passage}
                  fontSize={fontSize}
                  groupCodeRequired={isGroupCodeRequired}
                  highlight={Boolean(highlight)}
                  isLoading={isLoadingPrimaryPassage || isCreatingOnDemandSource}
                  isIllustratedMode={isIllustratedMode}
                  isSectionStarter={isSectionStarter}
                  licenseRequired={Boolean(primaryPassageData?.licenseRequired)}
                  onChangeEdition={onChangeEdition}
                  publication={publication}
                  totalPages={totalPages}
                  audioState={audioState}
                  setAudioState={onPageReaderAudioChange}
                  currentTime={currentTime}
                  isSecondaryEdition={false}
                  hasAudioAccess={hasAudioAccess}
                />
                <div className="min-h-0 self-stretch w-[1px] bg-[#E6E8F0] relative mx-8" />
                <PageReader
                  decodeEnabled={decode}
                  currentPosition={currentPosition}
                  edition={secondaryEdition}
                  error={secondaryEditionError as ApiErrors | null}
                  passageData={secondaryPassageData?.passage}
                  fontSize={fontSize}
                  groupCodeRequired={isGroupCodeRequired}
                  highlight={Boolean(highlight)}
                  isLoading={isLoadingSecondaryPassage || isCreatingOnDemandSource}
                  isIllustratedMode={isIllustratedMode}
                  isSectionStarter={isSectionStarter}
                  licenseRequired={Boolean(secondaryPassageData?.licenseRequired)}
                  onChangeEdition={onChangeSecondaryEdition}
                  publication={publication}
                  totalPages={totalPages}
                  audioState={audioState}
                  setAudioState={onPageReaderAudioChange}
                  isSecondaryEdition={true}
                  currentTime={currentTime}
                  hasAudioAccess={hasAudioAccess}
                />
              </div>
            )}
            {!showTwoColumns && !isIllustratedMode && (
              <div className={`lg:p-7 lg:mx-52 lg:pb-12 lg:pr-16`}>
                <div className="gap-3 flex flex-col">
                  <PageReader
                    decodeEnabled={decode}
                    currentPosition={currentPosition}
                    edition={primaryEdition}
                    error={primaryEditionError as ApiErrors | null}
                    passageData={primaryPassageData?.passage}
                    fontSize={fontSize}
                    groupCodeRequired={isGroupCodeRequired}
                    highlight={Boolean(highlight)}
                    isLoading={isLoadingPrimaryPassage}
                    isIllustratedMode={isIllustratedMode}
                    isSectionStarter={isSectionStarter}
                    licenseRequired={Boolean(primaryPassageData?.licenseRequired)}
                    onChangeEdition={onChangeEdition}
                    publication={publication}
                    totalPages={totalPages}
                    audioState={audioState}
                    setAudioState={onPageReaderAudioChange}
                    isSecondaryEdition={false}
                    currentTime={currentTime}
                    hasAudioAccess={hasAudioAccess}
                  />
                </div>
              </div>
            )}
            {isIllustratedMode && !showTwoColumns && (
              <div className="flex flex-row gap-3 ">
                <div className="w-1/2">
                  <IllustratedImage imageUrl={primaryPassageData?.passage?.imageUrl} />
                </div>
                <PageReader
                  decodeEnabled={decode}
                  currentPosition={currentPosition}
                  edition={primaryEdition}
                  error={primaryEditionError as ApiErrors | null}
                  passageData={primaryPassageData?.passage}
                  fontSize={fontSize}
                  groupCodeRequired={isGroupCodeRequired}
                  highlight={Boolean(highlight)}
                  isLoading={isLoadingPrimaryPassage}
                  isIllustratedMode={isIllustratedMode}
                  isSectionStarter={isSectionStarter}
                  licenseRequired={Boolean(primaryPassageData?.licenseRequired)}
                  onChangeEdition={onChangeEdition}
                  publication={publication}
                  totalPages={totalPages}
                  audioState={audioState}
                  setAudioState={onPageReaderAudioChange}
                  isSecondaryEdition={false}
                  currentTime={currentTime}
                  hasAudioAccess={hasAudioAccess}
                  hideImage={true}
                  centerText={true}
                />
              </div>
            )}
          </Card>
          <BottomToolbar
            audioAvailable={audioAvailable}
            audioState={audioState}
            canHighlight={highlightAvailable}
            currentPosition={currentPosition}
            currentTime={currentTime}
            highlight={Boolean(highlight)}
            highlightTooltipMessage={highlightTooltipMessage}
            isGroupCodeRequired={isGroupCodeRequired}
            isLoading={isLoading || isLoadingSpeechMarks}
            isLoadingSpeechMarks={isLoadingSpeechMarks}
            isLastPage={currentPosition === totalPages}
            isPrimaryNextSuccess={isPrimaryNextSuccess}
            isSecondaryNextSuccess={isSecondaryNextSuccess}
            onHighlightChange={handleHighlightChange}
            onInputPageChange={onChangePosition}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            onRenderPaginatorPage={onRenderPaginatorPage}
            onSetAudioState={onAudioPlayerAudioChanged}
            onSetCurrentTime={setCurrentTime}
            primaryPassage={primaryPassageData?.passage}
            secondaryPassage={secondaryPassageData?.passage}
            totalPages={totalPages}
          />
        </MaxWidthContainer>
      </div>
      <Tooltip
        style={toolTipStyle}
        noArrow={true}
        id="reader-tooltip"
        place="top-start"
      />
      <Tooltip
        style={toolTipStyle}
        noArrow={true}
        id="page-reader-tooltip"
        place="top-start"
      />
      <PremiumFeatureModal
        onClose={() => setIsPremiumModalOpen(false)}
        open={isPremiumModalOpen}
        feature="Decode"
      />
    </>
  );
};
