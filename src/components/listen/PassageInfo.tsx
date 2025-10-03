import { Headphones } from '@/assets/icons/Headphones';
import { Image } from '@/components/ui/Image';
import { capitalize } from '@/utils/text';
import { FunctionComponent } from 'react';

interface PassageInfoProps {
  author?: string;
  languageName?: string;
  level: string;
  position?: number;
  publicationVersion: string;
  thumbnailImageUrl?: string;
  title?: string;
  totalPassages?: number;
  totalAudioTime?: string;
}

export const PassageInfo: FunctionComponent<PassageInfoProps> = (props) => {
  const {
    author,
    languageName,
    level,
    position,
    publicationVersion,
    thumbnailImageUrl,
    title,
    totalPassages,
    totalAudioTime,
  } = props;

  const percentComplete = position && totalPassages ? Math.round((position / totalPassages) * 100) : 0;

  return (
    <div className="flex gap-8 items-start">
      <div className="sm:w-48 sm:h-48 w-36 h-36">
        <Image
          url={thumbnailImageUrl}
          className="w-full h-full rounded-md bg-cover bg-center shadow-md"
        />
      </div>
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h2 className="font-bold font-['Noto Sans Variable'] text-2xl font-secondary">{title}</h2>
          <p className="text-secondary">by {author}</p>
          <p className="text-[14px] text-secondary flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            {totalAudioTime}
            {totalAudioTime ? ` • ${percentComplete}% Complete` : `${percentComplete}% Complete`}
          </p>
          <p className="text-[14px] text-secondary">
            {languageName} • {capitalize(level)} Edition
          </p>
          <p className="text-xs text-secondary">Version {publicationVersion}</p>
        </div>
      </div>
    </div>
  );
};
