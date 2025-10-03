import { ApiErrors } from '@/utils/api-client';
import { FunctionComponent } from 'react';

export type PassageErrorProps = {
  error: ApiErrors | null;
};

const notFoundTitle = 'Not found';
const defaultTitle = 'Unavailable';

export const PassageError: FunctionComponent<PassageErrorProps> = (props) => {
  const { error } = props;
  const displayError = error?.errors?.at(0);

  if (!displayError) {
    return <></>;
  }

  const isNotFound = displayError.code === 404;
  const title = isNotFound ? notFoundTitle : defaultTitle;

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-8">
      <div className="flex flex-col gap-1 justify-center items-center h-[250px]">
        <p className="text-xl">{title}</p>
        <p>
          Please choose another passage or{' '}
          <a
            className="font-black text-[var(--button-bg-color)]"
            href="mailto:support@adaptivereader.com"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};
