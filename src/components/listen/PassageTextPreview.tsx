import { FunctionComponent } from 'react';

interface PassageTextPreviewProps {
  loading?: boolean;
  text?: string;
}

export const PassageTextPreview: FunctionComponent<PassageTextPreviewProps> = ({ text, loading }) => {
  const textWithNoTags = text?.replace(/<[^>]*>?/g, '') || 'No text available';
  return (
    <div className="text-gray-600 text-md">
      <p className={`line-clamp-1 text-secondary`}>
        <i>{loading ? 'Loading...' : textWithNoTags}</i>
      </p>
    </div>
  );
};
