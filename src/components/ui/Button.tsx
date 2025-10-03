import styled from 'styled-components';

export const Button = styled.button.attrs<HTMLButtonElement>({
  className: 'px-[16px] lg:px-[24px] text-center',
})`
  background-color: var(--button-bg-color);
  border-radius: var(--button-border-radius);
  color: var(--button-font-color);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-normal);
  height: var(--button-height);
  line-height: var(--button-height);
  min-width: 80px;
  opacity: 0.9;

  :hover {
    opacity: 1;
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const OutlineButton = styled(Button)`
  background-color: var(--button-outline-bg-color);
  border: var(--button-border-width) solid var(--button-border-color);
  color: var(--button-outline-font-color);
  height: auto;
  line-height: calc(var(--button-height) - 2 * var(--button-border-width));
  :hover {
    background-color: var(--button-outline-bg-color-hover);
    color: var(--button-outline-font-color-hover);
  }
`;

export const TransparentButton = styled(Button)<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? 'var(--button-outline-font-color)' : 'transparent')};
  border: none;
  color: ${({ active }) => (active ? '#fff' : 'var(--font-color-secondary)')};
`;

export const PrimaryTransparentButton = styled(TransparentButton)<{
  active?: boolean;
}>`
  color: ${({ active }) => (active ? '#fff' : 'var(--button-outline-font-color)')};
`;

export const ButtonGroup = styled.div<{ justify?: string }>`
  background-color: var(--button-group-bg-color);
  border-radius: var(--button-border-radius);
`;
