import { FunctionComponent } from 'react';

export type PassageImageProps = {
  imageUrl?: string;
};

export const PassageImage: FunctionComponent<PassageImageProps> = (props) => {
  const { imageUrl } = props;
  if (!imageUrl) {
    return <></>;
  }
  return (
    <img
      src={imageUrl}
      className={`block max-h-[30vh] w-full object-contain`}
      loading="lazy"
    />
  );
};
