import { Check } from '@/assets/icons/Check';
import { ChevronDown } from '@/assets/icons/ChevronDown';
import { OneColumn } from '@/assets/icons/OneColumn';
import { TwoColumns } from '@/assets/icons/TwoColumns';
import { Menu } from '@headlessui/react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Dropdown, DropdownItem, DropdownItems, DropdownTrigger } from '../ui/Dropdown';
import { Icon } from '../ui/Icon';

const TriggerText = styled.span`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
`;

export type ColumnItem = {
  id: 'one-column' | 'two-column';
  label: string;
  icon: React.ReactNode;
};

export type ColumnsDropdownProps = {
  disabled?: boolean;
  onSelectIndex: (selectedIndex: number) => void;
  selectedIndex: number;
  options: ColumnItem[];
};

export const columnsOptions: ColumnItem[] = [
  { icon: <OneColumn />, id: 'one-column', label: '1 Column' },
  { icon: <TwoColumns />, id: 'two-column', label: '2 Columns' },
];

export const ColumnsDropdown: FunctionComponent<ColumnsDropdownProps> = (props) => {
  const { disabled, onSelectIndex, options, selectedIndex } = props;
  const activeOption = options[selectedIndex];

  return (
    <Dropdown>
      <DropdownTrigger
        disabled={disabled}
        className="gap-2 lg:gap-3 h-8"
      >
        <Icon>{activeOption.icon}</Icon>
        <TriggerText className="hidden sm:flex">{activeOption.label}</TriggerText>
        <Icon>
          <ChevronDown />
        </Icon>
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
