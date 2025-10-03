import { UrlKey } from '@/routes/routes';
import { BrowserStorage } from '@/utils/storage';
import { FunctionComponent, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type AppContext = {
  groupCode?: string;
  removeGroupCode: () => void;
  setGroupCode: (code: string | undefined) => void;
};

export const AppContext = createContext<null | AppContext>(null);

export const AppProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const search = new URLSearchParams(location.search);
  const groupCodeParam = search.get(UrlKey.GROUP_CODE) ?? undefined;

  const [groupCode, setGroupCode] = useState<string | undefined>(BrowserStorage.getGroupCode);

  useEffect(() => {
    BrowserStorage.setFeatures({ features: [] });
  }, []);

  useEffect(() => {
    if (groupCodeParam) {
      updateGroupCode(groupCodeParam);
      navigate(location.pathname);
    }
  }, [groupCodeParam]);

  function updateGroupCode(code: string) {
    setGroupCode(code);
    BrowserStorage.setGroupCode(code);
  }

  function removeGroupCode() {
    setGroupCode(undefined);
    BrowserStorage.removeGroupCode();
  }

  return (
    <AppContext.Provider
      value={{
        groupCode: groupCode ?? groupCodeParam,
        removeGroupCode,
        setGroupCode: updateGroupCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext) as AppContext;
