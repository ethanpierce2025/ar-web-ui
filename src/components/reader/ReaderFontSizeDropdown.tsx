import { Check } from '@/assets/icons/Check';
import { ChevronDown } from '@/assets/icons/ChevronDown';
import { TextSize } from '@/assets/icons/TextSize';
import { Menu } from '@headlessui/react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Dropdown, DropdownItem, DropdownItems, DropdownTrigger } from '../ui/Dropdown';
import { Icon } from '../ui/Icon';
import { TooltipWrapper } from '../ui/TooltipWrapper';

const TriggerText = styled.span`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
`;

export type FontSizeItem = {
  id: 'default' | 'slightly_large' | 'large' | 'extra-large';
  label: string;
  value: string;
};

export const defaultIllustratedFontSize: FontSizeItem['id'] = 'large';

export const defaultFontSize: FontSizeItem['id'] = 'default';

export type FontSizeDropdownProps = {
  onSelectIndex: (selectedIndex: number) => void;
  selectedIndex: number;
  options: FontSizeItem[];
};

export const fontsizeOptions: FontSizeItem[] = [
  { id: 'default', label: 'Default', value: 'var(--font-size-medium)' },
  {
    id: 'slightly_large',
    label: 'Slightly Larger',
    value: 'var(--font-size-slightly-large)',
  },
  { id: 'large', label: 'Larger', value: 'var(--font-size-large)' },
  {
    id: 'extra-large',
    label: 'Extra Large',
    value: 'var(--font-size-x-large)',
  },
];

export const FontSizeDropdown: FunctionComponent<FontSizeDropdownProps> = (props) => {
  const { onSelectIndex, options, selectedIndex } = props;

  return (
    <Dropdown>
      <DropdownTrigger className="h-8">
        <TooltipWrapper
          message={'Text Size'}
          className="flex gap-2 lg:gap-3"
          tooltipId={'reader-tooltip'}
        >
          <Icon>
            <TextSize />
          </Icon>
          <TriggerText className="hidden sm:flex">{options.at(selectedIndex)?.label}</TriggerText>
          <Icon>
            <ChevronDown />
          </Icon>
        </TooltipWrapper>
      </DropdownTrigger>

      <Menu.Items>
        <DropdownItems className="min-w-[150px] float-right">
          {options.map(({ id, label }, index) => (
            <DropdownItem
              className="p-2 cursor-pointer"
              key={`option-${id}-${index}`}
            >
              {({ close }) => (
                <div
                  className="flex gap-3 items-center"
                  onClick={() => {
                    close();
                    onSelectIndex(index);
                  }}
                >
                  <div className="h-2 w-2">{selectedIndex === index && <Check />}</div>
                  <span>{label}</span>
                </div>
              )}
            </DropdownItem>
          ))}
        </DropdownItems>
      </Menu.Items>
    </Dropdown>
  );
};
