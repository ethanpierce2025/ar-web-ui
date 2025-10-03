import { Button } from '@/components/ui/Button';
import { FunctionComponent } from 'react';

interface PassageNavigationProps {
  onChangePosition: (position: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  position: number | undefined;
  showButtons?: boolean;
  totalPassages: number | undefined;
}

export const PassageNavigation: FunctionComponent<PassageNavigationProps> = (props) => {
  const { onNext, onPrevious, onChangePosition, position, totalPassages, showButtons = true } = props;

  return (
    <div className="flex justify-between gap-4">
      {showButtons && (
        <Button
          type="button"
          onClick={onPrevious}
          disabled={!position || position <= 1}
          className="!rounded-md !text-md !font-bold !bg-white !text-[#103A3A] !border-[#103A3A] border-[1px]"
        >
          Previous
        </Button>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={position || ''}
          id="passage-input"
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0) {
              onChangePosition(value);
            }
          }}
          className="w-12 h-7 px-2 text-center border border-mainbutton-green rounded-lg font-['Nunito_Sans',Helvetica] font-semibold text-mainbutton-green text-sm focus:outline-none focus:ring-1 focus:ring-mainbutton-green"
        />
        <span className="font-['Nunito_Sans',Helvetica] font-normal text-secondary text-sm whitespace-nowrap">
          / {totalPassages}
        </span>
      </div>

      {showButtons && (
        <Button
          type="button"
          onClick={onNext}
          disabled={!position || position >= (totalPassages || 0)}
          className="!rounded-md !text-md !font-bold"
        >
          Next
        </Button>
      )}
    </div>
  );
};
