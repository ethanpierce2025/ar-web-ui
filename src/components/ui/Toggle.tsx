import { FunctionComponent, useState } from 'react';

export type ToggleProps = {
  disabled?: boolean;
  label?: string;
  name: string;
  OffIconComponent?: FunctionComponent;
  OnIconComponent?: FunctionComponent;
  setToggleValue: React.Dispatch<React.SetStateAction<boolean>>;
  toggleValue: boolean;
};

export const Toggle: FunctionComponent<ToggleProps> = (props) => {
  const { disabled, label, name, OffIconComponent, OnIconComponent, setToggleValue, toggleValue } = props;

  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  return (
    <div className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-[var(--nav-item-font-color-active)] overflow-ellipsis whitespace-nowrap"
        >
          {label}
        </label>
      )}
      <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
          className="sr-only peer"
          disabled={disabled}
          id={name}
          name={name}
          onChange={() => {
            if (!disabled) {
              setToggleValue(!toggleValue);
              setHasInteracted(true);
            }
          }}
          type="checkbox"
          value=""
        />
        <div className="flex rounded-full items-center w-8 h-4 bg-gray-300">
          {toggleValue ? (
            <div
              className="flex justify-center absolute items-center rounded-full w-5 h-5 bg-button animate-toggle-slide-on"
              key="on"
            >
              <div className="jz-10">{OnIconComponent && <OnIconComponent />}</div>
            </div>
          ) : (
            <div
              className={`flex justify-center absolute items-center rounded-full w-5 h-5 bg-gray-400 ${
                hasInteracted && 'animate-toggle-slide-off'
              }`}
              key="off"
            >
              <div className="jz-10">{OffIconComponent && <OffIconComponent />}</div>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};
