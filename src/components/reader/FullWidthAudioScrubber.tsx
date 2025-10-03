import { StyledElement } from '@/types/styles.types';
import { FunctionComponent, useEffect, useState } from 'react';
import { AudioControlState } from './AudioPlayer';

export type FullWidthAudioScrubberProps = {
  currentTime: number;
  duration: number;
  audioControlState: AudioControlState;
  updateAudioTimeFromScrubber: (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => void;
  position?: 'top' | 'bottom';
} & StyledElement;

export const FullWidthAudioScrubber: FunctionComponent<FullWidthAudioScrubberProps> = (props) => {
  const { audioControlState, currentTime, duration, updateAudioTimeFromScrubber, position = 'top' } = props;

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(true);
    // Disable text selection
    document.body.style.userSelect = 'none';
    updateAudioTimeFromScrubber(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateAudioTimeFromScrubber(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        className={`bg-[#dde3e34a] z-0 h-1 absolute w-[100%] ${position === 'bottom' ? 'top-[0px]' : 'top-[62px]'} left-0 rounded-r hover:bg-[#dde3e36c] hover:cursor-pointer`}
      ></div>
      <div
        onMouseDown={handleMouseDown}
        className={`${
          audioControlState === 'Now Playing' || isDragging ? 'bg-[#103A3A]' : 'bg-[#DDE3E3]'
        } z-10 h-1 absolute w-[100%] ${position === 'bottom' ? 'top-[0px]' : 'top-[62px]'} left-0 rounded-r hover:!bg-[#103A3A] hover:cursor-pointer flex`}
        style={{
          width: `${currentTime ? (currentTime / duration) * 100 : 0}%`,
        }}
      >
        <div
          className={`bg-inherit hover:cursor-pointer rounded-full w-[16px] h-[16px] absolute top-[-6px] left-[calc(100%-2px)] z-10 border-white border-2`}
        ></div>
      </div>
    </>
  );
};
