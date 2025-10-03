import styled from 'styled-components';

export const Scrollbar = styled.div`
  /* width */
  ::-webkit-scrollbar {
    width: var(--scrollbar-width);
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: var(--scrollbar-track-bg);
    border-radius: 5px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb-bg);
    border-radius: 5px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-bg-hover);
  }
`;
