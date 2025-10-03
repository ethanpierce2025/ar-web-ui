import { FunctionComponent } from 'react';

export const HamburgerMenu: FunctionComponent = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="7"
        cy="3"
        r="1.5"
        fill="black"
      />
      <circle
        cx="7"
        cy="7"
        r="1.5"
        fill="black"
      />
      <circle
        cx="7"
        cy="11"
        r="1.5"
        fill="black"
      />
    </svg>
  );
};
