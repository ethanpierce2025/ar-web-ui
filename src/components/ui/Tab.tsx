import styled from 'styled-components';

export const Tab = styled.div<{ active?: boolean }>`
  border-bottom: ${({ active }) =>
    active
      ? `2px solid
    var(--tab-border-color)`
      : 'none'};
  color: var(${({ active }) => (active ? '--tab-color-active' : '--tab-color')});
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-family-primary);
  font-size: 16px;
  font-weight: ${({ active }) => (active ? 700 : 400)};
  padding: var(--tab-padding);
`;
