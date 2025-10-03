import { Pause as PauseIcon } from '@/assets/icons/Pause';
import { Play } from '@/assets/icons/Play';
import { autoPlayPageChangePauseMs, autoPlayTransitionMaxDelayMs, autoPlayTransitionMinDelayMs } from '@/constants';
import { Event, useTrackEvent } from '@/hooks/events';
import { usePlaybackSpeedMapUrlParam } from '@/hooks/url';
import { EditionPassageDto } from '@/types/api.types';
import { BrowserStorage } from '@/utils/storage';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { Loader } from '../ui/Loader';
import { MaxWidthContainer } from '../ui/MaxWidthContainer';
import { TooltipWrapper } from '../ui/TooltipWrapper';
import { AudioControlsMenu } from './AudioControlsMenu';
import { CenteredAudioScrubber } from './CenteredAudioScrubber';
import { PlaybackSpeed, PlaybackSpeedDropdown } from './PlaybackSpeedDropdown';
import { Timer } from './Timer';

type AudioPlayerProps = {
  primaryPassage: EditionPassageDto | undefined;
  secondaryPassage: EditionPassageDto | undefined;
  closable?: boolean;
  audioState: AudioState;
  isLoading: boolean;
  setAudioState: (audioState: AudioState) => void;
  onNext: () => void;
  currentTime: CurrentTime;
  setCurrentTime: (currentTime: CurrentTime) => void;
  highlight?: boolean;
  onHighlightChange?: (highlight: boolean) => void;
  canHighlight?: boolean;
  highlightTooltipMessage?: string;
  isPrimaryNextSuccess?: boolean;
  isSecondaryNextSuccess?: boolean;
  isLastPage?: boolean;
  isLoadingSpeechMarks?: boolean;
};

export type AudioControlState = 'Now Playing' | 'Paused' | 'Not Started' | 'Closed' | 'Finished' | 'Loading Next';

export type AudioState = {
  audioControlState: AudioControlState;
  editionSelected: 'primary' | 'secondary';
};

export type CurrentTime = {
  primary: number;
  secondary: number;
};

export const AudioPlayer: FunctionComponent<AudioPlayerProps> = (props) => {
  const {
    audioState,
    canHighlight = true,
    currentTime,
    highlightTooltipMessage = '',
    isLoading,
    isLoadingSpeechMarks = false,
    isPrimaryNextSuccess,
    isSecondaryNextSuccess,
    isLastPage = false,
    onNext,
    primaryPassage,
    secondaryPassage,
    setAudioState,
    setCurrentTime,
    highlight,
    onHighlightChange,
  } = props;

  const playbackSpeedMap = usePlaybackSpeedMapUrlParam();

  const audioSettings = BrowserStorage.getAudioSettings();

  const [autoPlay, setAutoPlay] = useState<boolean>(audioSettings?.autoPlay || false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(audioSettings?.playbackSpeed || 1);
  const [durations, setDurations] = useState<{
    primary: number;
    secondary: number;
  }>({
    primary: 0.00001,
    secondary: 0.00001,
  });
  const trackEvent = useTrackEvent();

  const allowablePlaybackSpeeds: PlaybackSpeed[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTransitionRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayMinDelayRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayMaxDelayRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayPauseRef = useRef<NodeJS.Timeout | null>(null);

  const audioToolTipStyle = {
    backgroundColor: '#081735B3',
    borderRadius: '4px',
    color: 'white',
    fontSize: '10px',
    padding: '2px 4px',
    text: 'var(--tooltip-text)',
  };

  audioRef.current.volume = 1.0;

  audioRef.current.preload = 'auto';

  const togglePause = () => {
    if (audioState.audioControlState === 'Finished') {
      setCurrentTime({
        ...currentTime,
        [audioState.editionSelected]: 0,
      });
    }
    const toggle = audioState.audioControlState === 'Now Playing' ? 'Paused' : 'Now Playing';
    setAudioState({
      ...audioState,
      audioControlState: toggle,
    });
  };

  const returnToStart = () => {
    audioRef.current.currentTime = 0;
    setCurrentTime({
      ...currentTime,
      [audioState.editionSelected]: audioRef.current.currentTime,
    });
  };

  const destroyAudio = () => {
    audioRef.current.pause();
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
    if (autoPlayTransitionRef.current) {
      clearTimeout(autoPlayTransitionRef.current);
      autoPlayTransitionRef.current = null;
    }
    if (autoPlayMinDelayRef.current) {
      clearTimeout(autoPlayMinDelayRef.current);
      autoPlayMinDelayRef.current = null;
    }
    if (autoPlayMaxDelayRef.current) {
      clearTimeout(autoPlayMaxDelayRef.current);
      autoPlayMaxDelayRef.current = null;
    }
    if (autoPlayPauseRef.current) {
      clearTimeout(autoPlayPauseRef.current);
      autoPlayPauseRef.current = null;
    }
  };

  const updateAudioTimeFromScrubber = (newTime: number) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime({
      ...currentTime,
      [audioState.editionSelected]: newTime,
    });
  };

  const updateAudioTimeFromWindowScrubber = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    const x = e.clientX;
    const windowWidth = window.innerWidth;
    const percentage = x / windowWidth;
    const effectiveDuration = currentPassage?.audio?.audioLength || durations[audioState.editionSelected];
    const newTime = percentage * effectiveDuration;
    updateAudioTimeFromScrubber(newTime);
  };

  const startAutoPlayTransition = () => {
    if (!autoPlay) return;
    if (isLastPage) return;

    setAudioState({
      ...audioState,
      audioControlState: 'Loading Next',
    });

    autoPlayMinDelayRef.current = setTimeout(() => {
      autoPlayMinDelayRef.current = null;
      checkAutoPlayTransitionReady();
    }, autoPlayTransitionMinDelayMs);

    autoPlayMaxDelayRef.current = setTimeout(() => {
      autoPlayMaxDelayRef.current = null;
      completeAutoPlayTransition();
    }, autoPlayTransitionMaxDelayMs);
  };

  const checkAutoPlayTransitionReady = () => {
    if (autoPlayMinDelayRef.current) return;

    const isNextPassageSuccess =
      audioState.editionSelected === 'primary' ? isPrimaryNextSuccess : isSecondaryNextSuccess;

    if (isNextPassageSuccess) {
      completeAutoPlayTransition();
    }
  };

  const completeAutoPlayTransition = () => {
    if (autoPlayMinDelayRef.current) {
      clearTimeout(autoPlayMinDelayRef.current);
      autoPlayMinDelayRef.current = null;
    }
    if (autoPlayMaxDelayRef.current) {
      clearTimeout(autoPlayMaxDelayRef.current);
      autoPlayMaxDelayRef.current = null;
    }

    setCurrentTime({
      primary: 0,
      secondary: 0,
    });
    onNext();
    setAudioState({
      ...audioState,
      audioControlState: 'Now Playing',
    });
  };

  useEffect(() => {
    if (audioState.audioControlState === 'Now Playing' && audioRef.current.paused) {
      audioRef.current.play();
    }
    if (audioState.audioControlState === 'Paused') {
      audioRef.current.pause();
    }
    if (audioState.audioControlState === 'Closed') audioRef.current.pause();
  }, [audioState.audioControlState]);

  useEffect(() => {
    audioRef.current.src =
      audioState.editionSelected === 'primary' ? primaryPassage?.audio?.url! : secondaryPassage?.audio?.url!;
  }, [primaryPassage?.audio, secondaryPassage?.audio, audioState.editionSelected]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeedMap[playbackSpeed];
  }, [audioState.editionSelected, playbackSpeed, playbackSpeedMap]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setCurrentTime({
      primary: 0,
      secondary: 0,
    });
    if (
      autoPlay &&
      audioState.audioControlState !== 'Paused' &&
      audioState.audioControlState !== 'Closed' &&
      audioState.audioControlState !== 'Loading Next'
    ) {
      audioRef.current.play();
    }
  }, [primaryPassage, secondaryPassage]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const updateCurrentTimeFixedupdateWord = () => {
      setCurrentTime({
        ...currentTime,
        [audioState.editionSelected]: audioRef.current.currentTime,
      });
    };
    // We need to update the current time every 25ms to keep the word highlighting in sync
    const intervalId = setInterval(updateCurrentTimeFixedupdateWord, 25);
    return () => clearInterval(intervalId);
  }, [currentTime, audioState.editionSelected]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return () => {
      destroyAudio();
    };
  }, []);

  useEffect(() => {
    if (isLoading || isLoadingSpeechMarks) return;
    BrowserStorage.setAudioSettings({
      audioControlState: audioState.audioControlState,
      autoPlay,
      currentTime,
      editionSelected: audioState.editionSelected,
      highlight: Boolean(highlight),
      playbackSpeed,
      playbackSpeedMap,
    });
  }, [
    audioState.audioControlState,
    autoPlay,
    currentTime,
    audioState.editionSelected,
    highlight,
    playbackSpeed,
    playbackSpeedMap,
  ]);

  // Check if assets are loaded when passage changes during auto play transition
  useEffect(() => {
    if (audioState.audioControlState === 'Loading Next') {
      checkAutoPlayTransitionReady();
    }
  }, [audioState.audioControlState, isPrimaryNextSuccess, isSecondaryNextSuccess]);

  audioRef.current.ontimeupdate = () => {
    if (audioRef.current.currentTime === 0) {
      audioRef.current.currentTime = currentTime[audioState.editionSelected];
    }
    setCurrentTime({
      ...currentTime,
      [audioState.editionSelected]: audioRef.current.currentTime,
    });
  };

  audioRef.current.ondurationchange = () => {
    setDurations({
      ...durations,
      [audioState.editionSelected]: audioRef.current.duration,
    });
  };

  audioRef.current.onended = () => {
    setAudioState({
      ...audioState,
      audioControlState: 'Finished',
    });
    if (autoPlay) {
      autoPlayPauseRef.current = setTimeout(() => {
        autoPlayPauseRef.current = null;
        startAutoPlayTransition();
      }, autoPlayPageChangePauseMs);
    }
  };

  audioRef.current.onloadeddata = () => {
    if (audioState.audioControlState === 'Closed') return;
    if (audioState.audioControlState === 'Loading Next') return;
    if (autoPlay && audioState.audioControlState !== 'Paused') {
      setAudioState({
        ...audioState,
        audioControlState: 'Now Playing',
      });
    }
    if (audioState.audioControlState === 'Now Playing') {
      audioRef.current.play();
    }
  };

  const currentPassage = audioState.editionSelected === 'primary' ? primaryPassage : secondaryPassage;

  const setHighlight = (val: boolean) => {
    if (onHighlightChange) onHighlightChange(val);
  };

  return (
    <>
      {audioState.audioControlState !== 'Closed' && (
        <div className="flex w-full bg-white h-16 items-center text-[14px]">
          <MaxWidthContainer>
            <div className="flex flex-row justify-between w-full p-4">
              {(isLoading && !currentPassage?.audio) || audioState.audioControlState === 'Loading Next' ? (
                <div className="flex items-center w-full justify-start gap-[50px]">
                  <div>
                    {audioState.audioControlState === 'Loading Next' ? 'Loading next passage...' : 'Loading...'}
                  </div>
                  <div
                    className="w-14 h-10 flex items-center"
                    style={{ transform: 'scale(0.5)' }}
                  >
                    <Loader />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full gap-4">
                  <div
                    onClick={togglePause}
                    className="flex justify-center items-center border border-[#96AAAA] rounded-full w-8 h-8 hover:bg-audioButtonHover hover:cursor-pointer"
                  >
                    {audioState.audioControlState === 'Now Playing' ? (
                      <TooltipWrapper
                        message={'Pause audio'}
                        tooltipId={'audio-tooltip'}
                      >
                        <PauseIcon />
                      </TooltipWrapper>
                    ) : (
                      <TooltipWrapper
                        message={'Play audio'}
                        tooltipId={'audio-tooltip'}
                      >
                        <Play />
                      </TooltipWrapper>
                    )}
                  </div>

                  <div className="hidden sm:block">
                    <Timer currentTime={currentTime[audioState.editionSelected]} />
                  </div>

                  <div className="flex-1 max-w-xs">
                    <CenteredAudioScrubber
                      currentTime={currentTime[audioState.editionSelected]}
                      duration={durations[audioState.editionSelected]}
                      audioControlState={audioState.audioControlState}
                      updateAudioTimeFromScrubber={updateAudioTimeFromScrubber}
                    />
                  </div>

                  <div className="hidden sm:block w-12 text-center">
                    {durations[audioState.editionSelected] > 0 ? (
                      <Timer currentTime={durations[audioState.editionSelected]} />
                    ) : (
                      <span>00:00</span>
                    )}
                  </div>

                  <div className="hidden md:block">
                    <PlaybackSpeedDropdown
                      activePlaybackSpeed={playbackSpeed}
                      playbackSpeeds={allowablePlaybackSpeeds}
                      showAbove={true}
                      onSelect={(playbackSpeed) => {
                        setPlaybackSpeed(playbackSpeed);
                        audioRef.current.playbackRate = playbackSpeed;
                        trackEvent(Event.ChangedAudioSettings, {
                          audioAutoplay: autoPlay,
                          audioSpeed: playbackSpeed,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <AudioControlsMenu
                      currentPassage={currentPassage}
                      highlight={Boolean(highlight)}
                      setHighlight={setHighlight}
                      canHighlight={canHighlight}
                      highlightTooltipMessage={highlightTooltipMessage}
                      playbackSpeed={playbackSpeed}
                      setPlaybackSpeed={setPlaybackSpeed}
                      autoPlay={autoPlay}
                      setAutoPlay={setAutoPlay}
                      allowablePlaybackSpeeds={allowablePlaybackSpeeds}
                      position="bottom"
                      trackEvent={trackEvent}
                      isLoadingSpeechMarks={isLoadingSpeechMarks}
                    />
                  </div>
                </div>
              )}
            </div>
          </MaxWidthContainer>
        </div>
      )}
      <Tooltip
        style={audioToolTipStyle}
        noArrow={true}
        id="audio-tooltip"
        place="top-start"
      />
    </>
  );
};
