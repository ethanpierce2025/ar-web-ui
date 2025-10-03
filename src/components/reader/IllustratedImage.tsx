import { FunctionComponent, PropsWithChildren } from 'react';

export type IllustratedImageProps = {
  imageUrl?: string;
};

export const IllustratedImage: FunctionComponent<IllustratedImageProps> = (props) => {
  const { imageUrl } = props;

  if (!imageUrl) {
    return null;
  }

  const ImageContainer = ({ children }: PropsWithChildren) => {
    return <div className="flex items-center justify-center w-full h-full max-w-[400px] max-h-[400px]">{children}</div>;
  };

  return (
    <div className="flex items-center justify-center h-full pb-8 pt-16">
      <ImageContainer>
        <img
          alt="Passage illustration"
          className="object-contain w-full h-full"
          loading="lazy"
          src={imageUrl}
        />
      </ImageContainer>
    </div>
  );
};
