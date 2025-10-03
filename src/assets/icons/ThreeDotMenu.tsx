import { FunctionComponent } from 'react';

interface ThreeDotMenuProps {
  className?: string;
  size?: number;
  color?: string;
}

export const ThreeDotMenu: FunctionComponent<ThreeDotMenuProps> = ({ className = '', size = 3, color = 'black' }) => {
  return (
    <div
      className={`flex flex-col space-y-[3px] ${className}`}
      role="button"
      aria-label="menu"
    >
      <div
        className="rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
      ></div>
      <div
        className="rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
      ></div>
      <div
        className="rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
      ></div>
    </div>
  );
};
