import { FunctionComponent, useState } from 'react';

export const ClearInput: FunctionComponent = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <circle
        cx="6"
        cy="6"
        r="6"
        fill={hovered ? '#9CA3AF' : '#D1D5DB'}
      />
      <line
        x1="4"
        y1="4"
        x2="8"
        y2="8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="4"
        x2="4"
        y2="8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
