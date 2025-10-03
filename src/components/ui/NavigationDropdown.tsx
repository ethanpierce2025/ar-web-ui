import { HamburgerMenu } from '@/assets/icons/HamburgerMenu';
import { routes } from '@/routes/routes';
import { Menu } from '@headlessui/react';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownItems, DropdownTrigger } from './Dropdown';

export const NavigationDropdown: FunctionComponent = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Menu.Button className="flex w-8 h-8">
          <HamburgerMenu />
        </Menu.Button>
      </DropdownTrigger>
      <DropdownItems>
        <DropdownItem className="px-4 py-3 cursor-pointer font-primary">
          <Link to={routes.catalog.path}>Our Novels</Link>
        </DropdownItem>
      </DropdownItems>
    </Dropdown>
  );
};
