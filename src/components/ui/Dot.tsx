import styled from 'styled-components';

export const Dot = styled.div<{ full?: boolean }>`
  background-color: var(${({ full }) => (full ? '--dot-bg-full' : '--dot-bg')});
  border-radius: 100%;
`;
