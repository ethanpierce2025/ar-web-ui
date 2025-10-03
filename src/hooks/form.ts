import { useState } from 'react';

export const useData = <S extends Record<string, unknown>>(defaultState: S) => {
  const [data, setData] = useState(defaultState);

  const setKeyValue =
    <K extends keyof S>(key: K) =>
    (value: S[K]) =>
      setData((prevData) => ({
        ...prevData,
        [key]: value,
      }));

  return {
    data,
    setData,
    setKeyValue,
  };
};
