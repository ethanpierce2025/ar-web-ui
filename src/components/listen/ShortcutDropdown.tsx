import { Check } from '@/assets/icons/Check';
import { ChevronDown } from '@/assets/icons/ChevronDown';
import { OpenBook } from '@/assets/icons/OpenBook';
import { Icon } from '@/components/ui/Icon';
import { TooltipWrapper } from '@/components/ui/TooltipWrapper';
import { PublicationShortcut } from '@/types/publication.types';
import { Menu } from '@headlessui/react';
import { FunctionComponent, useRef } from 'react';

interface ShortcutDropdownProps {
  onSelect: (shortcut: PublicationShortcut) => void;
  position: number;
  shortcuts: PublicationShortcut[];
  floatRight?: boolean;
}

export const ShortcutDropdown: FunctionComponent<ShortcutDropdownProps> = (props) => {
  const { onSelect, position, shortcuts, floatRight = false } = props;
  const listRef = useRef<HTMLDivElement | null>(null);

  if (shortcuts.length === 0) {
    return null;
  }

  const activeIndex =
    shortcuts.findIndex((shortcut) => shortcut.passage > position) > 0
      ? shortcuts.findIndex((shortcut) => shortcut.passage > position) - 1
      : shortcuts.length - 1;

  const onSelectItem = (index: number) => {
    onSelect(shortcuts[index]);
  };

  const onShow = () => {
    const target = Array.from(listRef?.current?.children ?? []).at(activeIndex);
    const baseTop = listRef?.current?.getBoundingClientRect().top ?? 0;
    const targetTop = target?.getBoundingClientRect().top ?? 0;
    listRef?.current?.scrollTo({
      top: targetTop - baseTop,
    });
  };

  return (
    <Menu
      as="div"
      className="relative w-full"
    >
      <Menu.Button className="w-full flex justify-between items-center bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-2">
        <TooltipWrapper
          message={shortcuts[activeIndex]?.name ?? ''}
          className="flex items-center gap-3 overflow-hidden"
          tooltipId={'reader-tooltip'}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Icon>
              <OpenBook />
            </Icon>
            <div className="whitespace-nowrap text-ellipsis overflow-hidden w-[90%]">
              {shortcuts[activeIndex]?.name}
            </div>
          </div>
        </TooltipWrapper>
        <Icon>
          <ChevronDown />
        </Icon>
      </Menu.Button>

      <Menu.Items
        className={`absolute z-10 mt-2 w-full ${
          floatRight ? 'right-0' : 'left-0'
        } max-h-[400px] overflow-x-hidden overflow-y-auto bg-white rounded-lg shadow-md border border-gray-200`}
        onFocus={onShow}
      >
        <div
          ref={listRef}
          className="py-1"
        >
          {shortcuts.map(({ name }, index) => (
            <Menu.Item key={`option-${name}-${index}`}>
              {({ close }) => (
                <button
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 ${
                    activeIndex === index ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    close();
                    onSelectItem(index);
                  }}
                >
                  <div className="h-2 w-2">{activeIndex === index && <Check />}</div>
                  <span>{name}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};
