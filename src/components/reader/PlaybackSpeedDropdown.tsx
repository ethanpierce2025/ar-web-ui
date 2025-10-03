import { Menu } from '@headlessui/react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Dropdown, DropdownItem, DropdownItemGroups, DropdownTrigger } from '../ui/Dropdown';
import { SpeedDropdown } from '../ui/Text';

const TriggerText = styled(SpeedDropdown)`
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
`;

export type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export type PlaybackSpeedDropdown = {
  activePlaybackSpeed: PlaybackSpeed;
  playbackSpeeds: PlaybackSpeed[];
  onSelect: (playbackSpeed: PlaybackSpeed) => void;
  showAbove?: boolean;
};

export const PlaybackSpeedDropdown: FunctionComponent<PlaybackSpeedDropdown> = (props) => {
  const { activePlaybackSpeed, onSelect, playbackSpeeds, showAbove = false } = props;

  const onSelectItem = (playbackSpeed: PlaybackSpeed) => {
    if (onSelect) {
      onSelect(playbackSpeed);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger className="gap-3 justify-center">
        <div className="w-8 h-8 flex justify-center">
          <span className="flex justify-center items-center rounded-full h-8 w-12 border-[1px] border-[#96AAAA] hover:bg-gray-100 text-[10px]">
            {activePlaybackSpeed}x
          </span>
        </div>
      </DropdownTrigger>

      <Menu.Items className={`absolute ${showAbove ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
        <div className="flex justify-center">
          <DropdownItemGroups className="flex flex-col items-center gap-2 w-[50px] mt-0">
            {playbackSpeeds.map((speed) => {
              return (
                <div
                  key={speed}
                  className="flex flex-col"
                >
                  <div>
                    <DropdownItem
                      className={`flex justify-center p-2 cursor-pointer ${
                        activePlaybackSpeed === speed && '!bg-gray-200'
                      } rounded-full border-[1px] h-8 w-8 border-[#96AAAA] hover:bg-gray-100 my-1`}
                      key={speed}
                    >
                      {({ close }) => (
                        <div
                          className="flex gap-3 items-center !text-[10px]"
                          onClick={() => {
                            close();
                            onSelectItem(speed);
                          }}
                        >
                          <span>{speed}</span>
                        </div>
                      )}
                    </DropdownItem>
                  </div>
                </div>
              );
            })}
          </DropdownItemGroups>
        </div>
      </Menu.Items>
    </Dropdown>
  );
};
