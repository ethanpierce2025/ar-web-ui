import { ClearInput } from '@/assets/icons/ClearInput';
import { FunctionComponent } from 'react';

export type TextInputProps = {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  className?: string;
};

export const TextInput: FunctionComponent<TextInputProps> = (props) => {
  const { onChange, placeholder, value, className } = props;

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-4 py-[10px] border border-[#E6E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--ar-green)] focus:border-[var(--ar-green)] w-full text-[16px] text-[var(--font-color-primary)] placeholder:text-[#96aaaa] ${className ?? ''}`}
      />
      {value && (
        <div
          onClick={() => onChange('')}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
        >
          <div className="flex items-center w-[12px] h-[12px]">
            <ClearInput />
          </div>
        </div>
      )}
    </div>
  );
};
