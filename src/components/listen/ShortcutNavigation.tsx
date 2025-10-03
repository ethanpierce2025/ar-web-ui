import { PublicationShortcut } from '@/types/publication.types';
import { FunctionComponent } from 'react';
import { ShortcutDropdown } from './ShortcutDropdown';

interface ShortcutNavigationProps {
  onSelect: (shortcut: PublicationShortcut) => void;
  position: number;
  shortcuts?: PublicationShortcut[];
}

export const ShortcutNavigation: FunctionComponent<ShortcutNavigationProps> = (props) => {
  const { onSelect, position, shortcuts } = props;

  if (!shortcuts) return null;

  return (
    <ShortcutDropdown
      shortcuts={shortcuts}
      onSelect={onSelect}
      position={position}
      floatRight={true}
    />
  );
};
