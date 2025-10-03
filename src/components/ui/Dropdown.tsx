import { Float } from '@headlessui-float/react';
import { Menu } from '@headlessui/react';
import { FunctionComponent, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

export const DropdownTrigger = styled(Menu.Button).attrs({
  className: 'inline-flex w-full justify-between items-center',
})`
  background-color: var(--side-menu-bg-color);
  color: var(--nav-item-font-color-active);

  :hover {
    color: var(--nav-item-font-color-hover);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
    `}
`;

export const DropdownItems = styled.div.attrs<HTMLDivElement>({
  className: 'z-50 mt-2 divide-y shadow-lg',
})`
  background-color: var(--dropdown-bg-color);
  border-radius: var(--dropdown-border-radius);
`;

export const DropdownItemGroups = styled.div.attrs<HTMLDivElement>({
  className: 'z-50 mt-2 shadow-lg',
})`
  background-color: var(--dropdown-bg-color);
  border-radius: var(--dropdown-border-radius);
`;

export type DropdownItemProps = { active?: boolean; hoverable?: boolean };

export const DropdownItem = styled(Menu.Item).attrs(({ hoverable }: DropdownItemProps) => ({
  hoverable: hoverable ?? true,
}))<{
  active?: boolean;
  hoverable?: boolean;
}>`
  background-color: var(${({ active }) => (active ? '--nav-item-bg-color-active' : '--nav-item-bg-color')});
  color: var(--nav-item-font-color-active);

  ${({ hoverable }) =>
    hoverable &&
    css`
      :hover {
        background-color: var(--nav-item-bg-color-hover);
        color: var(--nav-item-font-color-hover);
      }
    `}
`;

export const Dropdown: FunctionComponent<PropsWithChildren<{ onShow?: () => void }>> = (props) => {
  const { children, onShow } = props;

  return (
    <Menu
      as="div"
      className="relative text-left"
    >
      <Float
        adaptiveWidth
        onShow={onShow}
      >
        {children as any}
      </Float>
    </Menu>
  );
};
