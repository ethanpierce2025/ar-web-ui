import { FunctionComponent } from 'react';

export type PlayBarProps = {
  currentTime: number; // The current time of the audio in seconds
};

export const Timer: FunctionComponent<PlayBarProps> = (props) => {
  const { currentTime } = props;
  const format = (time: number): string => {
    if (!time) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return <div className="w-12">{format(currentTime)}</div>;
};
