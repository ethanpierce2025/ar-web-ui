import { FunctionComponent, PropsWithChildren } from 'react';

export type WithSkeletonProps = {
  showSkeleton?: boolean;
  skeleton: React.ReactElement;
};

export const WithSkeleton: FunctionComponent<PropsWithChildren<WithSkeletonProps>> = (props) => {
  const { children, showSkeleton, skeleton } = props;

  return <>{showSkeleton ? skeleton : children}</>;
};
