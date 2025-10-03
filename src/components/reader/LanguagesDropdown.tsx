import { Check } from '@/assets/icons/Check';
import { ChevronDown } from '@/assets/icons/ChevronDown';
import { recentLanguagesLimit } from '@/constants';
import { EditionLanguageDto, EditionSelectDto } from '@/types/api.types';
import { Feature } from '@/types/features.types';
import { BrowserStorage } from '@/utils/storage';
import { Menu } from '@headlessui/react';
import { freeLanguages } from '@shared/constants';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Dropdown, DropdownItem, DropdownItemGroups, DropdownTrigger } from '../ui/Dropdown';
import { Icon } from '../ui/Icon';
import { TextInput } from '../ui/TextInput';
import { TriggerText } from './PageReader';
import { PremiumFeatureModal } from './PremiumFeatureModal';

export type LanguagesDropdownProps = {
  activeLanguage: EditionLanguageDto;
  editionsByLanguage: Record<string, EditionSelectDto[]>;
  languages: EditionLanguageDto[];
  onSelect: (shortcut: EditionLanguageDto) => void;
  placeholder?: string;
};

const pingTimeout = 1000 * 10; // 10 seconds

export const initEditionIndicator = () => {
  const showEditionIndicator = BrowserStorage.getShowEditionIndicator();
  if (showEditionIndicator === undefined) {
    BrowserStorage.setShowEditionIndicator(true);
  }
};

export const LanguagesDropdown: FunctionComponent<LanguagesDropdownProps> = (props) => {
  const { activeLanguage, languages = [], onSelect, placeholder } = props;
  const [showEditionIndicator, setEditionIndicator] = useState(loadEditionIndicator);
  const hasLanguagesAccess = BrowserStorage.hasFeature(Feature.LANGUAGES);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setTimeout(onHideEditionIndicator, pingTimeout);
  }, []);

  function loadEditionIndicator() {
    const showEditionIndicator = BrowserStorage.getShowEditionIndicator();
    return showEditionIndicator === undefined ? true : Boolean(showEditionIndicator);
  }

  const onSelectItem = (language: EditionLanguageDto) => {
    BrowserStorage.setRecentlyUsedLanguages(language);
    if (onSelect) {
      onSelect(language);
    }
  };

  const onHideEditionIndicator = () => {
    setEditionIndicator(false);
    BrowserStorage.setShowEditionIndicator(false);
  };
  const recentlyUsedLanguages: EditionLanguageDto[] = BrowserStorage.getRecentlyUsedLanguages();

  const languagesCodes = languages.map((language) => language.code);

  let totalAvailableLanguages = 0;

  const recentLanguages = recentlyUsedLanguages
    .filter((language) => languagesCodes.includes(language.code) && language.code !== activeLanguage?.code)
    .slice(0, recentLanguagesLimit)
    .sort((langOne, langTwo) => {
      const textA = langOne.name.toUpperCase();
      const textB = langTwo.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

  const languageDropDowns = useMemo(() => {
    const lcQuery = query.trim().toLowerCase();
    const filterByQuery = (arr: EditionLanguageDto[]) =>
      lcQuery
        ? arr.filter((l) => l?.name?.toLowerCase().includes(lcQuery) || l?.code?.toLowerCase().includes(lcQuery))
        : arr;

    const all = languages
      .filter(
        (language) =>
          language?.code !== activeLanguage?.code &&
          !recentLanguages.find((recentLanguage: EditionLanguageDto) => recentLanguage?.code === language.code),
      )
      .sort((a, b) =>
        a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0,
      );

    const allLanguages = filterByQuery(all);
    const recentlyUsedLanguages = filterByQuery(recentLanguages);
    totalAvailableLanguages = allLanguages.length + recentlyUsedLanguages.length;
    return {
      'recently used': filterByQuery(recentLanguages),
      'all languages': filterByQuery(all),
    } as Record<string, EditionLanguageDto[]>;
  }, [languages, recentLanguages, activeLanguage?.code, query]);

  return (
    <>
      <Dropdown>
        <DropdownTrigger
          className="min-w-[112px] !justify-start float-left shadow-sm h-8 pl-2"
          onMouseEnter={onHideEditionIndicator}
        >
          {showEditionIndicator && (
            <span className="absolute -left-4 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--button-bg-color)] opacity-75"></span>
              <span className="relative inline-flex rounded-full opacity-10 h-2 w-2 bg-[var(--button-bg-color)]"></span>
            </span>
          )}
          <TriggerText className="uppercase !text-[14px]">{activeLanguage?.name ?? placeholder}</TriggerText>

          <Icon color="secondary">
            <ChevronDown />
          </Icon>
        </DropdownTrigger>

        <Menu.Items>
          <DropdownItemGroups className="w-[320px] float-left pt-4 pb-2 !rounded-xl border border-[#E6E8F0] shadow-md">
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              <div className="sticky top-0 z-20 bg-[var(--dropdown-bg-color)] px-4 py-2">
                <TextInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Search languages..."
                  className="rounded-xl focus:ring-offset-[var(--dropdown-bg-color)]"
                />
              </div>
              {languageDropDowns &&
                Object.keys(languageDropDowns).map((key, i, arr) => {
                  const languageGroup = languageDropDowns[key] || [];
                  if (!languageGroup.length) return null;
                  return (
                    <div key={`group-${key}`}>
                      <div className="sticky top-0 bg-[var(--dropdown-bg-color)]">
                        <TriggerText className="px-4 uppercase !text-[12px] font-bold opacity-60 tracking-wide">
                          {key}
                        </TriggerText>
                      </div>
                      {languageGroup.map((language: EditionLanguageDto, index: number) => {
                        if (!language) return null;
                        const isActiveLanguage = language.code === activeLanguage?.code;
                        const isPremiumLanguage = !freeLanguages.includes(language.code);
                        const isDisabled = isPremiumLanguage && !hasLanguagesAccess;

                        return (
                          <DropdownItem
                            className={`py-2 px-6 cursor-pointer ${isDisabled ? 'opacity-50 !cursor-not-allowed' : ''} ${isActiveLanguage ? '!bg-gray-100' : ''}`}
                            key={`option-${language.name}-${index}`}
                          >
                            {({ close }) => (
                              <div
                                className="flex justify-between w-full items-center"
                                onClick={() => {
                                  if (isDisabled) {
                                    setShowPremiumModal(true);
                                    return;
                                  }
                                  close();
                                  onSelectItem(language);
                                }}
                              >
                                <TriggerText className="uppercase px-0 !text-[14px] font-semibold w-[85%] !text-black">
                                  {language.name}
                                </TriggerText>
                                <div className="h-2 w-2 flex items-center justify-center">
                                  {isActiveLanguage && <Check />}
                                </div>
                              </div>
                            )}
                          </DropdownItem>
                        );
                      })}
                      {i < arr.length - 1 && totalAvailableLanguages > 1 && (
                        <div className="h-[1px] bg-[#E6E8F0] w-[90%] m-auto" />
                      )}
                    </div>
                  );
                })}
            </div>
          </DropdownItemGroups>
        </Menu.Items>
      </Dropdown>
      <PremiumFeatureModal
        feature="Languages"
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </>
  );
};
