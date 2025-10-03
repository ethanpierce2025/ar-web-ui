import { ChevronLeft } from '@/assets/icons/ChevronLeft';
import { ChevronRight } from '@/assets/icons/ChevronRight';
import { EditionPassageDto } from '@/types/api.types';
import { FunctionComponent } from 'react';
import { Paginator, PaginatorProps } from '../ui/Paginator';
import { AudioPlayer, AudioState, CurrentTime } from './AudioPlayer';

type BottomToolbarProps = {
  audioAvailable: boolean;
  audioState: AudioState;
  canHighlight: boolean;
  currentPosition: number;
  currentTime: CurrentTime;
  highlight: boolean;
  highlightTooltipMessage: string;
  isGroupCodeRequired: boolean;
  isLoading: boolean;
  isLoadingSpeechMarks?: boolean;
  isLastPage: boolean;
  isPrimaryNextSuccess: boolean;
  isSecondaryNextSuccess: boolean;
  onHighlightChange: (highlight: boolean) => void;
  onInputPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onRenderPaginatorPage: PaginatorProps['onRenderPageNumber'];
  onSetAudioState: (audioState: AudioState) => void;
  onSetCurrentTime: (currentTime: CurrentTime) => void;
  primaryPassage?: EditionPassageDto;
  secondaryPassage?: EditionPassageDto;
  totalPages: number;
};

export const BottomToolbar: FunctionComponent<BottomToolbarProps> = ({
  audioAvailable,
  audioState,
  canHighlight,
  currentPosition,
  currentTime,
  isGroupCodeRequired,
  highlight,
  highlightTooltipMessage,
  isLoading,
  isLoadingSpeechMarks = false,
  isLastPage,
  isPrimaryNextSuccess,
  isSecondaryNextSuccess,
  onHighlightChange,
  onInputPageChange,
  onNextPage,
  onPreviousPage,
  onRenderPaginatorPage,
  onSetAudioState,
  onSetCurrentTime,
  primaryPassage,
  secondaryPassage,
  totalPages,
}) => {
  return (
    <>
      {!isGroupCodeRequired && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center bg-white border-t border-gray-200 h-16">
          <div className="flex items-center justify-between w-full px-4">
            <div className="hidden lg:flex items-center">
              <Paginator
                className="flex items-center gap-2"
                currentPage={currentPosition}
                onInputPageChange={onInputPageChange}
                onNext={onNextPage}
                onPrevious={onPreviousPage}
                onRenderPageNumber={onRenderPaginatorPage}
                showButtons={false}
                totalPages={totalPages}
                variant="input"
              />
            </div>

            <div className="flex items-center justify-center flex-1">
              {audioAvailable && (
                <AudioPlayer
                  audioState={audioState}
                  closable={false}
                  setAudioState={onSetAudioState}
                  primaryPassage={primaryPassage}
                  secondaryPassage={secondaryPassage}
                  onNext={onNextPage}
                  isLoading={isLoading}
                  isLoadingSpeechMarks={isLoadingSpeechMarks}
                  currentTime={currentTime}
                  setCurrentTime={onSetCurrentTime}
                  onHighlightChange={onHighlightChange}
                  canHighlight={canHighlight}
                  highlightTooltipMessage={highlightTooltipMessage}
                  highlight={Boolean(highlight)}
                  isPrimaryNextSuccess={isPrimaryNextSuccess}
                  isSecondaryNextSuccess={isSecondaryNextSuccess}
                  isLastPage={isLastPage}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPreviousPage}
                disabled={currentPosition === 1}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border border-[#103a3a] text-[#103a3a] rounded-full hover:bg-[#103a3a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={onNextPage}
                disabled={isLastPage}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#103a3a] text-white rounded-full hover:bg-[#0a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
