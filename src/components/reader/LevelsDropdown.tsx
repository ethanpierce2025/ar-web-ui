import { ChevronDown } from '@/assets/icons/ChevronDown';
import { editionDefaults } from '@/constants';
import { SourceLevel } from '@/types/api.types';
import { Feature } from '@/types/features.types';
import { slugifyEditionLevel } from '@/utils/edition';
import { BrowserStorage } from '@/utils/storage';
import { Menu } from '@headlessui/react';
import { freeLevels } from '@shared/constants';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dropdown, DropdownItem, DropdownItemGroups, DropdownTrigger } from '../ui/Dropdown';
import { Icon } from '../ui/Icon';
import { Subtitle } from '../ui/Text';
import { TooltipWrapper } from '../ui/TooltipWrapper';
import { PremiumFeatureModal } from './PremiumFeatureModal';

const TriggerText = styled(Subtitle)`
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
`;

const EditionLevelIcon = styled(Icon)<{ level?: SourceLevel }>`
  background-color: ${({ level }) => `var(--edition-select-${level ? slugifyEditionLevel(level) : ''})`};
  height: 10px;
  width: 10px;
`;

export type LevelsDropdownProps = {
  activeLevel?: SourceLevel;
  levels: SourceLevel[] | undefined;
  excludeGroupsSorting?: string[];
  onSelect: (level: SourceLevel) => void;
  placeholder?: string;
};

const pingTimeout = 1000 * 10; // 10 seconds

export const initEditionIndicator = () => {
  const showLevelIndicator = BrowserStorage.getShowEditionIndicator();
  if (showLevelIndicator === undefined) {
    BrowserStorage.setShowEditionIndicator(true);
  }
};

export const LevelsDropdown: FunctionComponent<LevelsDropdownProps> = (props) => {
  const { activeLevel, levels, onSelect, placeholder } = props;
  const [showLevelIndicator, setLevelIndicator] = useState(loadLevelIndicator);
  const hasLevelsAccess = BrowserStorage.hasFeature(Feature.LEVELS);

  const availableLevels = levels || [];
  const filteredLevels = editionDefaults.levels.filter((level) => availableLevels.includes(level.level));

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  useEffect(() => {
    setTimeout(onHideLevelIndicator, pingTimeout);
  }, []);

  function loadLevelIndicator() {
    const showLevelIndicator = BrowserStorage.getShowEditionIndicator();
    return showLevelIndicator === undefined ? true : Boolean(showLevelIndicator);
  }

  const onSelectItem = (level: SourceLevel) => {
    if (onSelect) {
      onSelect(level);
    }
  };

  const onHideLevelIndicator = () => {
    setLevelIndicator(false);
    BrowserStorage.setShowEditionIndicator(false);
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger
          className="!justify-start sm:ml-8 ml-2 float-left shadow-sm h-8 pl-2"
          onMouseEnter={onHideLevelIndicator}
        >
          {showLevelIndicator && (
            <span className="absolute -left-4 flex h-2 w-2 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--button-bg-color)] opacity-75"></span>
              <span className="relative inline-flex rounded-full opacity-10 h-2 w-2 bg-[var(--button-bg-color)]"></span>
            </span>
          )}
          <TooltipWrapper
            message={'Reading Level'}
            tooltipId={'page-reader-tooltip'}
            className="flex gap-3 items-center"
          >
            <div>
              <EditionLevelIcon
                className={'rounded-full'}
                level={activeLevel}
              />
            </div>
            <TriggerText className="uppercase !text-[14px]">{activeLevel ?? placeholder}</TriggerText>
            <Icon color="secondary">
              <ChevronDown />
            </Icon>
          </TooltipWrapper>
        </DropdownTrigger>

        <Menu.Items>
          <DropdownItemGroups className="w-[150px] pt-4 float-left border-[1px] border-gray-50 rounded-md">
            <div className="gap-2 flex flex-col">
              <div>
                {filteredLevels.map((level, index) => {
                  const isLevelPremium = !freeLevels.includes(level.level);
                  const isPremiumRestricted = isLevelPremium && !hasLevelsAccess;

                  const isDisabled = isPremiumRestricted;

                  const tooltipContent = isPremiumRestricted ? 'Upgrade to access additional reading levels' : '';

                  return (
                    <DropdownItem
                      className={`p-2 cursor-pointer ${isDisabled ? 'opacity-50 !cursor-not-allowed' : ''}
                      ${isPremiumRestricted ? 'text-gray-400' : ''}`}
                      key={`option-${level.level}-${index}`}
                    >
                      {({ close }) => (
                        <div
                          className="flex relative"
                          onClick={() => {
                            if (isDisabled && isPremiumRestricted) {
                              setShowPremiumModal(true);
                              return;
                            }
                            close();
                            onSelectItem(level.level);
                          }}
                        >
                          <TooltipWrapper
                            message={tooltipContent}
                            tooltipId={'reader-tooltip'}
                          >
                            <div className="flex gap-3 items-center">
                              <EditionLevelIcon
                                className={`rounded-full ${isPremiumRestricted ? 'opacity-60' : ''}`}
                                level={level.level}
                              ></EditionLevelIcon>
                              <TriggerText className="uppercase !text-[14px]">{level.level}</TriggerText>
                            </div>
                          </TooltipWrapper>
                        </div>
                      )}
                    </DropdownItem>
                  );
                })}
              </div>
            </div>
          </DropdownItemGroups>
        </Menu.Items>
      </Dropdown>
      <PremiumFeatureModal
        feature="levels"
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </>
  );
};
