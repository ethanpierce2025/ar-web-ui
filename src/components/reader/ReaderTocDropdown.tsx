import { Check } from '@/assets/icons/Check';
import { ChevronDown } from '@/assets/icons/ChevronDown';
import { OpenBook } from '@/assets/icons/OpenBook';
import { PublicationShortcut } from '@/types/publication.types';
import { Menu } from '@headlessui/react';
import { FunctionComponent, useRef } from 'react';
import { Dropdown, DropdownItem, DropdownItems, DropdownTrigger } from '../ui/Dropdown';
import { Icon } from '../ui/Icon';
import { TooltipWrapper } from '../ui/TooltipWrapper';

export type TocDropdownProps = {
  className?: string;
  onSelect: (shortcut: PublicationShortcut) => void;
  position: number;
  shortcuts: PublicationShortcut[];
  floatRight?: boolean;
};

export const TocDropdown: FunctionComponent<TocDropdownProps> = (props) => {
  const { className, floatRight, onSelect, position, shortcuts } = props;
  const listRef = useRef<HTMLDivElement | null>(null);
  const activeIndex = computeActiveIndex();

  const onSelectItem = (index: number) => {
    if (onSelect) {
      onSelect(shortcuts[index]);
    }
  };

  function computeActiveIndex() {
    const index = shortcuts.findIndex((shortcut) => shortcut.passage > position);
    return index > 0 ? index - 1 : shortcuts.length - 1;
  }

  function onShow() {
    const target = Array.from(listRef?.current?.children ?? []).at(activeIndex);
    const baseTop = listRef?.current?.getBoundingClientRect().top ?? 0;
    const targetTop = target?.getBoundingClientRect().top ?? 0;
    listRef?.current?.scrollTo({
      top: targetTop - baseTop,
    });
  }

  if (shortcuts.length === 0) {
    return <></>;
  }

  return (
    <Dropdown onShow={onShow}>
      <DropdownTrigger className="h-8 text-[14px]">
        <TooltipWrapper
          message={shortcuts.at(activeIndex)?.name ?? ''}
          className="flex min-w-[150px] gap-3 items-center"
          tooltipId={'reader-tooltip'}
        >
          <Icon>
            <OpenBook />
          </Icon>
          <div className="max-w-[200px] whitespace-nowrap text-ellipsis overflow-hidden text-left">
            {shortcuts.at(activeIndex)?.name}
          </div>
          <Icon>
            <ChevronDown />
          </Icon>
        </TooltipWrapper>
      </DropdownTrigger>

      <Menu.Items>
        <DropdownItems
          ref={listRef}
          className={`w-[70vw] lg:w-[400px] ${
            floatRight ? 'float-right' : 'float-left'
          } h-[400px] overflow-x-hidden overflow-y-scroll`}
        >
          {shortcuts.map(({ name }, index) => (
            <DropdownItem
              className="p-2 cursor-pointer"
              key={`option-${name}-${index}`}
            >
              {({ close }) => (
                <div
                  className="flex gap-3 items-center"
                  onClick={() => {
                    close();
                    onSelectItem(index);
                  }}
                >
                  <div className="h-2 w-2">{activeIndex === index && <Check />}</div>
                  <span>{name}</span>
                </div>
              )}
            </DropdownItem>
          ))}
        </DropdownItems>
      </Menu.Items>
    </Dropdown>
  );
};
