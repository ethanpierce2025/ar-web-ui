import { useApp } from '@/context/app.context';
import { useValidateGroupCode } from '@/queries/group-code.query';
import { UrlKey } from '@/routes/routes';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNotification } from './notification';

export function useInitGroupCode() {
  const { setGroupCode } = useGroupCode();
  const location = useLocation();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const groupCodeUrl = search.get(UrlKey.GROUP_CODE);

    if (groupCodeUrl) {
      setGroupCode(groupCodeUrl);
    }
  }, []);
}

export function useGroupCode() {
  const { groupCode, removeGroupCode, setGroupCode } = useApp();
  const notify = useNotification();
  const { mutate } = useValidateGroupCode();

  const onEnterGroupCode = (params: { editionId: number; groupCode: string; position: number }) => {
    const { groupCode } = params;

    mutate(params, {
      onError: () => {
        notify('Invalid Class Code', {
          variant: 'error',
        });
        removeGroupCode();
      },
      onSuccess: () => {
        notify('Class Code Accepted', {
          variant: 'success',
        });
        setGroupCode(groupCode);
      },
    });
  };

  return {
    groupCode,
    onEnterGroupCode,
    removeGroupCode,
    setGroupCode,
  };
}
