export const useGroupCode = () => {
  return {
    groupCode: undefined as string | undefined,
    groupCodeValid: false,
    onClearCode: () => {},
    onEnterGroupCode: (_params: any) => {},
  };
};
