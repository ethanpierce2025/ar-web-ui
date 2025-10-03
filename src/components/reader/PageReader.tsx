import { SoundNotAvailable } from '@/assets/icons/SoundNotAvailable';
import { SoundNotPlay } from '@/assets/icons/SoundNotPlay';
import { SoundPlay } from '@/assets/icons/SoundPlay';
import { usePublicationLanguages } from '@/hooks/publications';
import { useBreakpoints } from '@/hooks/tailwinds';
import { useNavigateToReaderUrl, useReaderUrlParams } from '@/hooks/url';
import { useDecodePassage } from '@/queries/passages.query';
import { EditionLanguageDto, EditionPassageDto, EditionSelectDto, SourceLevel } from '@/types/api.types';
import { Feature } from '@/types/features.types';
import { Publication } from '@/types/publication.types';
import { ApiErrors } from '@/utils/api-client';
import { hasLanguageFreeAudio } from '@/utils/feature';
import { BrowserStorage } from '@/utils/storage';
import { FunctionComponent, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { WithSkeleton } from '../ui/Skeleton';
import { Subtitle, Title } from '../ui/Text';
import { TooltipWrapper } from '../ui/TooltipWrapper';
import { AudioState, CurrentTime } from './AudioPlayer';
import { Highlighter } from './Highlighter';
import { LanguagesDropdown } from './LanguagesDropdown';
import { LevelsDropdown } from './LevelsDropdown';
import { PassageError } from './PassageErrors';
import { PassageLoader } from './PassageLoader';
import { PremiumFeatureModal } from './PremiumFeatureModal';
import { ReaderTextContainer, TextSkeleton } from './Reader';
import { ReaderLicenseRequired } from './ReaderLicenseRequired';
import { ReaderUnauthorized } from './ReaderUnauthorized';

export type PageProps = {
  centerText?: boolean;
  currentPosition: number;
  edition?: EditionSelectDto;
  error: ApiErrors | null;
  passageData?: EditionPassageDto;
  fontSize: string;
  groupCodeRequired?: boolean;
  hideImage?: boolean;
  highlight?: boolean;
  isLoading: boolean;
  isIllustratedMode?: boolean;
  isSectionStarter: boolean;
  licenseRequired: boolean;
  onChangeEdition: (edition: EditionSelectDto) => void;
  publication?: Publication;
  totalPages: number;
  audioState: AudioState;
  setAudioState: (audioState: AudioState) => void;
  isSecondaryEdition: boolean;
  currentTime: CurrentTime;
  hasAudioAccess?: boolean;
  decodeEnabled: boolean;
};

export const TriggerText = styled(Subtitle)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PageReader: FunctionComponent<PageProps> = (props) => {
  const {
    audioState,
    centerText,
    currentPosition: position,
    currentTime,
    decodeEnabled,
    edition,
    error,
    fontSize,
    groupCodeRequired,
    hideImage,
    highlight,
    isLoading,
    isIllustratedMode,
    isSecondaryEdition,
    isSectionStarter,
    licenseRequired,
    onChangeEdition,
    passageData,
    publication,
    setAudioState,
  } = props;

  const { editonsByLanguage } = usePublicationLanguages(publication);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [spinnerTimer, setSpinnerTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [resetButtonTimer, setResetButtonTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const navigate = useNavigate();
  const navigateToReaderUrl = useNavigateToReaderUrl();
  const { mutate: decodePassage, isPending: isDecoding } = useDecodePassage();

  const hasAudioFeature = BrowserStorage.hasFeature(Feature.AUDIO);
  const hasError = error !== null;
  const spinnerIsShowing =
    (!passageData && !groupCodeRequired && !licenseRequired && !hasError && showSpinner) || isDecoding;

  const { language: currentLanguage, level: currentLevel, secondaryLanguage, secondaryLevel } = useReaderUrlParams();

  const isSmallPlus = useBreakpoints('sm');
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (spinnerTimer) clearTimeout(spinnerTimer);
    if (resetButtonTimer) clearTimeout(resetButtonTimer);

    const newSpinnerTimer = setTimeout(() => {
      setShowSpinner(true);
    }, 1500); // 1.5 seconds
    setSpinnerTimer(newSpinnerTimer);
    setShowSpinner(false);

    const newResetButtonTimer = setTimeout(() => {
      setShowResetButton(true);
    }, 10000); // 10 seconds
    setResetButtonTimer(newResetButtonTimer);
    setShowResetButton(false);

    return () => {
      if (newSpinnerTimer) clearTimeout(newSpinnerTimer);
      if (newResetButtonTimer) clearTimeout(newResetButtonTimer);
    };
  }, [passageData]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to close the audio when the license is required
  useEffect(() => {
    if (licenseRequired) {
      setAudioState({
        ...audioState,
        audioControlState: 'Closed',
      });
    }
  }, [licenseRequired]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to decode when the toggle is enabled
  useEffect(() => {
    if (decodeEnabled && passageData && !passageData.textDecoded && edition?.language.code === 'en') {
      decodePassage({
        passageId: passageData.id,
        editionId: edition.id,
        position: position,
      });
    }
  }, [decodeEnabled, passageData?.id, edition?.language.code]);

  const [selectedLanguage, setSelectedLanguage] = useState(edition?.language);

  const onMissingEdition = (language?: EditionLanguageDto, level?: SourceLevel) => {
    if (!language && !level) return;
    const selectedLevel = level ?? edition?.level ?? SourceLevel.ORIGINAL;
    const selectedLanguage = language?.code ?? edition?.language.code ?? 'en';
    navigateToReaderUrl({
      language: isSecondaryEdition ? currentLanguage : selectedLanguage,
      level: isSecondaryEdition ? currentLevel : selectedLevel,
      position,
      publicationSlug: publication?.slug ?? '',
      publicationVersion: publication?.version ?? '',
      secondaryLanguage: isSecondaryEdition ? selectedLanguage : secondaryLanguage,
      secondaryLevel: isSecondaryEdition ? selectedLevel : secondaryLevel,
    });
  };

  const onChangeLanguage = (language: EditionLanguageDto) => {
    setSelectedLanguage(language);
    const editionExists = publication?.editions.find(
      (e) => e.language.code === language.code && e.level === edition?.level,
    );
    if (!editionExists) {
      onMissingEdition(language);
      return;
    }
    const newEdition = editonsByLanguage[language.code].find((e) => e.level === edition?.level);
    if (newEdition) {
      onChangeEdition(newEdition);
    } else {
      onChangeEdition(editonsByLanguage[language.code][0]);
    }
  };

  const onChangeLevel = (level: SourceLevel) => {
    if (!edition) return;
    const newEdition = publication?.editions.find(
      (e) => e.language.code === edition.language.code && e.level === level,
    );
    if (!newEdition) {
      onMissingEdition(edition.language, level);
      return;
    }
    onChangeEdition(newEdition as unknown as EditionSelectDto);
  };

  useLayoutEffect(() => {
    setSelectedLanguage(edition?.language);
  }, [edition]);

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const readEditionPassage = () => {
    if (!hasAudioAccessOrFreeLanguage) {
      setIsPremiumModalOpen(true);
      return;
    }

    const editionSelected = isSecondaryEdition ? 'secondary' : 'primary';
    const audioControlState = 'Now Playing';
    setAudioState({
      ...audioState,
      audioControlState: audioControlState,
      editionSelected,
    });
  };

  const hasAudioAccessOrFreeLanguage =
    (hasAudioFeature || hasLanguageFreeAudio(edition?.language.code ?? '')) && !licenseRequired;

  const audioAvailable = edition?.audioEnabled && hasAudioAccessOrFreeLanguage;

  const onClickRefresh = () => navigate(0);

  const PassageMarkerText: FunctionComponent<{ position: number }> = ({ position }) => (
    <div className="text-xs font-medium text-secondary">{position}</div>
  );

  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="gap-3 flex flex-col lg:pt-4">
          <div className={`flex justify-start items-center`}>
            <WithSkeleton
              showSkeleton={!edition && isLoading}
              skeleton={<div className="animate-pulse h-6 bg-gray-200 rounded-full dark:bg-gray-400 w-48 mb-4" />}
            >
              <div className="flex w-full place-content-between min-h-[32px] items-center">
                <div className="flex items-center justify-start gap-2">
                  <LanguagesDropdown
                    activeLanguage={selectedLanguage!}
                    editionsByLanguage={editonsByLanguage}
                    languages={publication?.languages ?? []}
                    onSelect={onChangeLanguage}
                    placeholder="LANGUAGE"
                  />

                  <LevelsDropdown
                    activeLevel={edition?.level}
                    levels={publication?.levels ?? []}
                    onSelect={onChangeLevel}
                    placeholder="LEVEL"
                  />
                </div>

                {audioAvailable && (
                  <div className="flex items-center gap-3">
                    {isSmallPlus && (
                      <TriggerText className="uppercase px-0 !text-[14px] hover:cursor-default">Listen</TriggerText>
                    )}
                    <div
                      onClick={readEditionPassage}
                      className="hover:bg-[#E6E8F0] hover:cursor-pointer rounded-full"
                    >
                      {audioState.audioControlState === 'Closed' ||
                      audioState.editionSelected !== (isSecondaryEdition ? 'secondary' : 'primary') ? (
                        <SoundNotPlay />
                      ) : (
                        <SoundPlay />
                      )}
                    </div>
                  </div>
                )}
                {!audioAvailable && (
                  <TooltipWrapper
                    message={
                      hasAudioAccessOrFreeLanguage
                        ? 'Audio not available'
                        : 'Upgrade to access additional audio features'
                    }
                    tooltipId={'page-reader-tooltip'}
                    className="flex items-center gap-3"
                  >
                    <TriggerText className="uppercase px-0 !text-[14px] color-[#E6E8F0] hover:cursor-default">
                      Listen
                    </TriggerText>
                    <div
                      className={
                        hasAudioAccessOrFreeLanguage
                          ? 'hover:cursor-disabled rounded-full'
                          : 'hover:cursor-pointer rounded-full'
                      }
                      onClick={hasAudioAccessOrFreeLanguage ? undefined : readEditionPassage}
                    >
                      <SoundNotAvailable />
                    </div>
                  </TooltipWrapper>
                )}
              </div>
            </WithSkeleton>
          </div>
          {isSectionStarter && !spinnerIsShowing && (
            <WithSkeleton
              showSkeleton={isLoading}
              skeleton={<div className="animate-pulse h-6 bg-gray-200 rounded-full dark:bg-gray-400 w-48 mb-4" />}
            >
              <div className="flex flex-row justify-between items-center">
                <Title>{[passageData?.partName, passageData?.sectionName].filter((value) => value).join(' // ')}</Title>
              </div>
            </WithSkeleton>
          )}
        </div>
        <WithSkeleton
          showSkeleton={isLoading && !spinnerIsShowing}
          skeleton={<TextSkeleton />}
        >
          {hasError && <PassageError error={error} />}
          {spinnerIsShowing && (
            <PassageLoader
              onClickRefresh={onClickRefresh}
              showResetButton={showResetButton}
            />
          )}
          {groupCodeRequired && edition && (
            <div className="mt-4">
              <ReaderUnauthorized
                editionId={edition.id}
                position={position}
              />
            </div>
          )}
          {licenseRequired && (
            <div className="mt-4">
              <ReaderLicenseRequired />
            </div>
          )}
          {!groupCodeRequired && !licenseRequired && !spinnerIsShowing && (
            <ReaderTextContainer
              fontSize={fontSize}
              className={`flex flex-col sm:pr-2 after:block lg:after:hidden gap-1 ${centerText ? 'my-auto' : ''} ${isIllustratedMode ? '' : 'sm:pt-4 pt-12'}`}
            >
              <div className="relative">
                <Highlighter
                  passageData={passageData}
                  currentTime={currentTime[audioState.editionSelected]}
                  enabled={
                    Boolean(highlight) &&
                    audioState.audioControlState !== 'Closed' &&
                    ((isSecondaryEdition && audioState.editionSelected === 'secondary') ||
                      (!isSecondaryEdition && audioState.editionSelected === 'primary'))
                  }
                  direction={edition?.language.rightToLeft ? 'rtl' : 'ltr'}
                  decodeEnabled={decodeEnabled}
                  hideImage={hideImage}
                ></Highlighter>
                {!isIllustratedMode && (
                  <div
                    className={`absolute pointer-events-none ${
                      passageData?.imageUrl && !hideImage ? 'top-[120px]' : 'top-[4px]'
                    } sm:top-[4px] -top-[24px] sm:left-[-24px] md:left-auto md:right-[-40px] md:mr-4`}
                  >
                    <PassageMarkerText position={position} />
                  </div>
                )}
              </div>
            </ReaderTextContainer>
          )}
        </WithSkeleton>
        {isIllustratedMode && (
          <div className="relative bottom-2 transform -translate-x-6 pointer-events-none">
            <PassageMarkerText position={position} />
          </div>
        )}
      </div>

      <PremiumFeatureModal
        onClose={() => setIsPremiumModalOpen(false)}
        open={isPremiumModalOpen}
        feature="Audio"
      />
    </>
  );
};
