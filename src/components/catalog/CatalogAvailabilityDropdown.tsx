import { Check } from '@/assets/icons/Check';
import { ChevronDown } from '@/assets/icons/ChevronDown';
import { Menu } from '@headlessui/react';
import { FunctionComponent } from 'react';
import { Dropdown, DropdownItem, DropdownItems, DropdownTrigger } from '../ui/Dropdown';
import { Icon } from '../ui/Icon';

export type CatalogAvailabilityDropdownProps = {
  activeIndex: number;
  onSelect: (activeIndex: number) => void;
  options: { label: string; value: string }[];
};

export const PublicationAvailabilityDropdown: FunctionComponent<CatalogAvailabilityDropdownProps> = (props) => {
  const { activeIndex, onSelect, options } = props;

  return (
    <Dropdown>
      <DropdownTrigger className="w-[160px] gap-3 rounded-lg !bg-white px-[13px] py-[9px] border-[1px] border-[#E6E8F0]">
        <div className="w-[160px] whitespace-nowrap text-ellipsis overflow-hidden text-left capitalize">
          {options.at(activeIndex)?.label}
        </div>
        <Icon>
          <ChevronDown />
        </Icon>
      </DropdownTrigger>

      <Menu.Items>
        <DropdownItems>
          {options.map(({ label }, index) => (
            <DropdownItem
              className="p-2 cursor-pointer"
              key={`option-${label}-${index}`}
            >
              {({ close }) => (
                <div
                  className="flex gap-3 items-center capitalize"
                  onClick={() => {
                    close();
                    onSelect(index);
                  }}
                >
                  <div className="h-2 w-2">{activeIndex === index && <Check />}</div>
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
