import { FunctionComponent } from 'react';
import { Loader } from '../ui/Loader';

export type PassageLoaderProps = {
  onClickRefresh: () => void;
  showResetButton: boolean;
};

export const PassageLoader: FunctionComponent<PassageLoaderProps> = (props) => {
  const { onClickRefresh, showResetButton } = props;
  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-8 py-4">
      <Loader />
      <div className="flex flex-col gap-1 justify-center items-center">
        <p>Retrieving passage...</p>
        {showResetButton && (
          <button
            onClick={onClickRefresh}
            className="bg-primary px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};
