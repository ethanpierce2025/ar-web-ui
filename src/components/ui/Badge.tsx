import { Badge as BadgeProps } from '@/types/publication.types';
import { FunctionComponent } from 'react';

export const Badge: FunctionComponent<BadgeProps> = (props) => {
  const { label } = props;
  return (
    <div className="whitespace-nowrap hover:max-w-[400px] max-w-[120px] transition-all flex w-fit h-[26px] items-center rounded-3xl justify-center px-3 py-0 text-xs font-bold text-white bg-[var(--badge-danger-bg-color)]">
      <div className="overflow-hidden text-ellipsis">{label}</div>
    </div>
  );
};
