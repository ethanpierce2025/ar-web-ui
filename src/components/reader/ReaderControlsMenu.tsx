import { ThreeDotMenu } from '@/assets/icons/ThreeDotMenu';
import { Toggle } from '@/components/ui/Toggle';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { TooltipWrapper } from '../ui/TooltipWrapper';
import { FontSizeDropdown, FontSizeItem } from './ReaderFontSizeDropdown';

type ReaderControlsMenuProps = {
  decodeEnabled: boolean;
  setDecodeEnabled: (enabled: boolean) => void;
  canDecode: boolean;
  decodeTooltipMessage: string;
  selectedFontSizeIndex: number;
  onSelectFontSizeIndex: (index: number) => void;
  fontsizeOptions: FontSizeItem[];
  onDecodeClick: () => void;
};

export const ReaderControlsMenu: FunctionComponent<ReaderControlsMenuProps> = ({
  decodeEnabled,
  setDecodeEnabled,
  canDecode,
  decodeTooltipMessage,
  selectedFontSizeIndex,
  onSelectFontSizeIndex,
  fontsizeOptions,
  onDecodeClick,
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

  const handleDecodeToggle = (enabled: boolean) => {
    if (!canDecode) {
      onDecodeClick();
      return;
    }
    setDecodeEnabled(enabled);
  };

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      <button
        onClick={toggleMenu}
        className="flex justify-center items-center border border-[#96AAAA] rounded-full w-8 h-8 hover:bg-audioButtonHover hover:cursor-pointer"
        aria-label="Reader controls menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ThreeDotMenu />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 top-full text-[14px]">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <TooltipWrapper
                message={decodeTooltipMessage}
                className="flex items-center"
                tooltipId={'reader-tooltip'}
              >
                <span className="text-sm text-gray-700">Decode Mode:</span>
              </TooltipWrapper>
              <Toggle
                setToggleValue={handleDecodeToggle}
                name={'decode'}
                toggleValue={decodeEnabled}
                disabled={!canDecode}
              />
            </div>

            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-gray-700">Text Size:</span>
              <div className="">
                <FontSizeDropdown
                  onSelectIndex={onSelectFontSizeIndex}
                  selectedIndex={selectedFontSizeIndex}
                  options={fontsizeOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
