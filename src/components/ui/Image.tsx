import styled from 'styled-components';

export const Image = styled.div<{ url?: string }>`
  background-color: var(--image-bg-color);
  background-image: ${({ url }) => `url('${url}')` ?? 'none'};
`;
