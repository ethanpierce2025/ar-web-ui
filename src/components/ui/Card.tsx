import styled from 'styled-components';

export const Card = styled.div.attrs<HTMLDivElement>({
  className: 'w-full md:rounded-lg rounded-none',
})`
  background-color: var(--card-bg-color);
  font-family: var(--font-family-primary);
`;
