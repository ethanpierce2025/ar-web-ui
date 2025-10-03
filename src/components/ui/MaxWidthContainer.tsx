import { FunctionComponent, PropsWithChildren } from 'react';

interface MaxWidthContainerProps extends PropsWithChildren {
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-[1440px]',
};

export const MaxWidthContainer: FunctionComponent<MaxWidthContainerProps> = (props) => {
  const { children, className = '', maxWidth = 'full' } = props;

  return (
    <div className={`flex flex-col items-center w-full ${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
      {children}
    </div>
  );
};
