import { FunctionComponent, useEffect, useState } from 'react';
import { TextInput } from '../ui/TextInput';

export type CatalogSearchProps = {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export const CatalogSearch: FunctionComponent<CatalogSearchProps> = (props) => {
  const { onChange, value } = props;

  const [placeholder, setPlaceholder] = useState('Search by title or author');

  useEffect(() => {
    const updatePlaceholder = () => {
      // Tailwind sm breakpoint
      if (window.innerWidth < 640) {
        setPlaceholder('Search');
      } else {
        setPlaceholder('Search by title or author');
      }
    };
    updatePlaceholder();
    window.addEventListener('resize', updatePlaceholder);
    return () => window.removeEventListener('resize', updatePlaceholder);
  }, []);

  return (
    <div className="w-[50%] sm:w-[260px] md:w-[300px]">
      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
