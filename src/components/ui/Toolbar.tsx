import styled from 'styled-components';

export const Toolbar = styled.div<{ showBorder?: boolean; className?: string }>`
  ::-webkit-scrollbar {
    display: none;
  }
  ${({ className }) => className}
  -ms-overflow-style: none;
  border-top: ${({ showBorder }) => (showBorder ? '1px solid var(--toolbar-border-color)' : 'none')};
  border-bottom: ${({ showBorder }) => (showBorder ? '1px solid var(--toolbar-border-color)' : 'none')};
  scrollbar-width: none;
`;
