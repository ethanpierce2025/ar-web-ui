import { useGroupCode } from '@/hooks/group-code';
import { FunctionComponent, PropsWithChildren } from 'react';

export const GroupCodeProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props;
  const { groupCode } = useGroupCode();
  return <div key={groupCode}>{children}</div>;
};
