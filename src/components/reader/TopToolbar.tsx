import { toolbarAutoHideTimeoutMs } from '@/constants';
import { useAutoHide } from '@/hooks/useAutoHide';
import { Feature } from '@/types/features.types';
import { PublicationShortcut } from '@/types/publication.types';
import { BrowserStorage } from '@/utils/storage';
import { FunctionComponent } from 'react';
import { MaxWidthContainer } from '../ui/MaxWidthContainer';
import { WithSkeleton } from '../ui/Skeleton';
import { Toggle } from '../ui/Toggle';
import { TooltipWrapper } from '../ui/TooltipWrapper';
import { ColumnsDropdown, columnsOptions } from './ReaderColumnsDropdown';
import { ReaderControlsMenu } from './ReaderControlsMenu';
import { FontSizeDropdown, FontSizeItem } from './ReaderFontSizeDropdown';
import { TocDropdown } from './ReaderTocDropdown';

type TopToolbarProps = {
  canDecode: boolean;
  currentPosition: number;
  decode: boolean;
  decodeTooltipMessage: string;
  fontsizeOptions: FontSizeItem[];
  isMediumPlus: boolean;
  isLargePlus: boolean;
  onDecodeClick: () => void;
  onInputPageChange: (page: number) => void;
  onSelectFontSizeIndex: (index: number) => void;
  onSelectColumnIndex: (index: number) => void;
  onToggleDecode: (enabled: boolean) => void;
  shortcuts?: PublicationShortcut[];
  selectedColumnsIndex: number;
  selectedFontSizeIndex: number;
  totalPages: number;
};

export const TopToolbar: FunctionComponent<TopToolbarProps> = ({
  canDecode,
  currentPosition,
  decode,
  decodeTooltipMessage,
  fontsizeOptions,
  isMediumPlus,
  onDecodeClick,
  onInputPageChange,
  onSelectFontSizeIndex,
  onSelectColumnIndex,
  onToggleDecode,
  shortcuts,
  selectedColumnsIndex,
  selectedFontSizeIndex,
}) => {
  const { isVisible } = useAutoHide(toolbarAutoHideTimeoutMs);

  return (
    <div
      className={`w-full bg-white transition-all duration-300 ${isVisible ? 'h-[48px] opacity-100' : 'h-0 opacity-0'}`}
    >
      <MaxWidthContainer>
        <div className="flex flex-row justify-between w-full px-4 md:px-6 py-2">
          <WithSkeleton
            showSkeleton={!shortcuts}
            skeleton={<div className="animate-pulse h-6 bg-gray-200 rounded-full dark:bg-gray-300 w-28" />}
          >
            <div className="flex gap-5">
              <TocDropdown
                shortcuts={shortcuts ?? []}
                onSelect={({ passage }) => onInputPageChange(passage)}
                position={currentPosition}
              />
            </div>
          </WithSkeleton>
          {isMediumPlus && (
            <div className="gap-5 text-[14px] items-center hidden sm:flex">
              <div
                onClick={() => {
                  if (!BrowserStorage.hasFeature(Feature.DECODE)) {
                    onDecodeClick();
                    return;
                  }
                }}
              >
                <TooltipWrapper
                  message={decodeTooltipMessage}
                  tooltipId="reader-tooltip"
                >
                  <div>
                    <Toggle
                      disabled={!canDecode}
                      label={'Decode Mode:'}
                      name="decode"
                      setToggleValue={onToggleDecode}
                      toggleValue={decode}
                    />
                  </div>
                </TooltipWrapper>
              </div>
              <FontSizeDropdown
                selectedIndex={selectedFontSizeIndex}
                onSelectIndex={onSelectFontSizeIndex}
                options={fontsizeOptions}
              />
              <div className="hidden lg:flex">
                <div className="two-column-dropdown">
                  <ColumnsDropdown
                    selectedIndex={selectedColumnsIndex}
                    onSelectIndex={onSelectColumnIndex}
                    options={columnsOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {!isMediumPlus && (
            <ReaderControlsMenu
              decodeEnabled={decode}
              setDecodeEnabled={onToggleDecode}
              canDecode={Boolean(canDecode)}
              decodeTooltipMessage={decodeTooltipMessage}
              selectedFontSizeIndex={selectedFontSizeIndex}
              onSelectFontSizeIndex={onSelectFontSizeIndex}
              fontsizeOptions={fontsizeOptions}
              onDecodeClick={onDecodeClick}
            />
          )}
        </div>
      </MaxWidthContainer>
    </div>
  );
};
