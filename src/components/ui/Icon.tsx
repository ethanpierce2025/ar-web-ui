import styled from 'styled-components';

export const Icon = styled.div<{ color?: 'primary' | 'secondary' | 'text' }>`
  color: ${({ color }) => (color ? `var(--font-color-${color})` : 'inherit')};
  height: 20px;
  width: 20px;
`;
