import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { AudioControlState } from './AudioPlayer';

export type CenteredAudioScrubberProps = {
  audioControlState: AudioControlState;
  currentTime: number;
  duration: number;
  updateAudioTimeFromScrubber: (newTime: number) => void;
};

export const CenteredAudioScrubber: FunctionComponent<CenteredAudioScrubberProps> = (props) => {
  const { audioControlState, currentTime, duration, updateAudioTimeFromScrubber } = props;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const scrubberRef = useRef<HTMLDivElement>(null);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    handleScrub(e);
  };

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    handleScrub({
      clientX: e.touches[0].clientX,
    } as MouseEvent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleScrub(e);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleScrub(e.touches[0]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement> | MouseEvent | Touch) => {
    if (!scrubberRef.current) return;

    const rect = scrubberRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;

    updateAudioTimeFromScrubber(newTime);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div className="flex items-center gap-4 w-full sm:w-full md:w-full lg:max-w-md lg:mx-auto">
      <div className="flex-1 relative">
        <div
          ref={scrubberRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="bg-[#dde3e34a] h-1 w-full rounded hover:bg-[#dde3e36c] !cursor-pointer"
        />
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`${
            audioControlState === 'Now Playing' || isDragging ? 'bg-[#103A3A]' : 'bg-[#DDE3E3]'
          } h-1 absolute top-0 left-0 rounded hover:!bg-[#103A3A] !cursor-pointer flex`}
          style={{
            width: `${currentTime ? (currentTime / duration) * 100 : 0}%`,
          }}
        >
          <div
            className={`bg-inherit cursor-pointer rounded-full w-[16px] h-[16px] absolute top-[-6px] left-[calc(100%-2px)] z-10 border-white border-2`}
          />
        </div>
      </div>
    </div>
  );
};
