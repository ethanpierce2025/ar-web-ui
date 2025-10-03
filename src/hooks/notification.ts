import { OptionsWithExtraProps, useSnackbar } from 'notistack';

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notify = (message: string, options?: OptionsWithExtraProps<any>) =>
    enqueueSnackbar(message, {
      autoHideDuration: 2000,
      preventDuplicate: true,
      ...options,
    });

  return notify;
};
