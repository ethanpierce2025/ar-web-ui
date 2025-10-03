import { PauseAutoPlay } from '@/assets/icons/PauseAutoPlay';
import { PlayAutoPlay } from '@/assets/icons/PlayAutoPlay';
import { ThreeDotMenu } from '@/assets/icons/ThreeDotMenu';
import { Loader } from '@/components/ui/Loader';
import { Toggle } from '@/components/ui/Toggle';
import { TooltipWrapper } from '@/components/ui/TooltipWrapper';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { PlaybackSpeed, PlaybackSpeedDropdown } from './PlaybackSpeedDropdown';

type AudioControlsMenuProps = {
  currentPassage: any;
  highlight: boolean;
  setHighlight: (highlight: boolean) => void;
  canHighlight?: boolean;
  highlightTooltipMessage?: string;
  playbackSpeed: PlaybackSpeed;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  allowablePlaybackSpeeds: PlaybackSpeed[];
  position?: 'top' | 'bottom';
  trackEvent: (event: any, data: any) => void;
  isLoadingSpeechMarks?: boolean;
};

export const AudioControlsMenu: FunctionComponent<AudioControlsMenuProps> = ({
  currentPassage,
  highlight,
  setHighlight,
  canHighlight = true,
  highlightTooltipMessage,
  playbackSpeed,
  setPlaybackSpeed,
  autoPlay,
  setAutoPlay,
  allowablePlaybackSpeeds,
  position = 'top',
  trackEvent,
  isLoadingSpeechMarks = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      <button
        onClick={toggleMenu}
        className="flex justify-center items-center border border-[#96AAAA] rounded-full w-8 h-8 hover:bg-audioButtonHover hover:cursor-pointer"
        aria-label="Audio controls menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ThreeDotMenu />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
            position === 'bottom' ? 'bottom-full mb-2' : 'top-full'
          }`}
        >
          <div className={`p-4 space-y-4`}>
            {(canHighlight || isLoadingSpeechMarks) && (
              <div className="items-center justify-between flex">
                <TooltipWrapper
                  message={highlightTooltipMessage || 'Highlight text as audio plays'}
                  className="flex items-center"
                  tooltipId={'audio-tooltip'}
                >
                  <span className={`text-sm ${canHighlight ? '' : 'opacity-50'}`}>Highlight:</span>
                </TooltipWrapper>
                <TooltipWrapper
                  message={canHighlight ? '' : highlightTooltipMessage || 'Disable Decode Mode to use highlighting'}
                  className="flex items-center"
                  tooltipId={'audio-tooltip'}
                >
                  <div>
                    {isLoadingSpeechMarks ? (
                      <div className="flex items-center justify-center w-8 !h-8">
                        <Loader className="!h-6 !w-6" />
                      </div>
                    ) : (
                      <Toggle
                        disabled={!canHighlight}
                        setToggleValue={setHighlight}
                        name={'highlight'}
                        toggleValue={highlight}
                      />
                    )}
                  </div>
                </TooltipWrapper>
              </div>
            )}

            <div className="items-center justify-between flex md:hidden">
              <span className="text-sm text-gray-700">Speed:</span>
              <PlaybackSpeedDropdown
                activePlaybackSpeed={playbackSpeed}
                playbackSpeeds={allowablePlaybackSpeeds}
                showAbove={position === 'bottom'}
                onSelect={(speed) => {
                  setPlaybackSpeed(speed);
                  trackEvent('ChangedAudioSettings', {
                    audioAutoplay: autoPlay,
                    audioSpeed: speed,
                  });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Auto-play:</span>
              <Toggle
                setToggleValue={(newAutoPlay) => {
                  setAutoPlay(typeof newAutoPlay === 'function' ? newAutoPlay(autoPlay) : newAutoPlay);
                  trackEvent('ChangedAudioSettings', {
                    audioAutoplay: typeof newAutoPlay === 'function' ? newAutoPlay(autoPlay) : newAutoPlay,
                    audioSpeed: playbackSpeed,
                  });
                }}
                name={'autoAdvance'}
                OnIconComponent={PlayAutoPlay}
                OffIconComponent={PauseAutoPlay}
                toggleValue={autoPlay}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
