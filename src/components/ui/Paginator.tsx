import { ChevronLeft } from '@/assets/icons/ChevronLeft';
import { ChevronRight } from '@/assets/icons/ChevronRight';
import { useDebounce } from '@/hooks/debounce';
import { PaginationType, usePagination } from '@/hooks/pagination';
import { StyledElement } from '@/types/styles.types';
import { isNumber } from '@/utils/numbers';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Subtitle } from './Text';

const PageInput = styled.input.attrs<HTMLInputElement>({
  className: 'border border-gray-300 rounded-lg p-2 w-12 h-7 text-center text-base leading-[14px] font-bold outline-0',
})`
  color: var(--pagination-active-page-font-color);
  border-color: var(--pagination-active-page-font-color);
`;

export const PaginatorContainer = styled.div.attrs<HTMLDivElement>({
  className: 'flex items-center justify-between sm:gap-32 gap-12',
})``;

export const Page = styled.div<{ active?: boolean }>`
  color: var(${({ active }) => (active ? '--pagination-active-page-font-color' : '--pagination-font-color')});
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 700 : 400)};
`;

const ArrowButton = styled.button<{ disabled?: boolean }>`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: var(${({ disabled }) => (disabled ? '--pagination-font-color' : '--pagination-active-page-font-color')});
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  height: 40px;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  width: 40px;

  &:hover:not(:disabled) {
    background-color: rgba(16, 58, 58, 0.1);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

export type PaginatorProps = {
  currentPage: number;
  onInputPageChange?: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onRenderPageNumber: (params: { currentPage: number; page: number }) => React.ReactElement;
  totalPages: number;
  variant?: 'input' | 'default';
  showButtons?: boolean;
  showPaginator?: boolean;
} & StyledElement;

export const Paginator: FunctionComponent<PaginatorProps> = (props) => {
  const {
    className,
    currentPage,
    onInputPageChange,
    onNext,
    onPrevious,
    onRenderPageNumber,
    totalPages,
    variant,
    showButtons = true,
    showPaginator = true,
  } = props;

  const [inputValue, setInputValue] = useState<string>(currentPage.toString());
  const pageValue = useDebounce(inputValue, 500);

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    if (pageValue) {
      onChangePage(pageValue);
    }
  }, [pageValue]);

  const pagination = usePagination({ count: totalPages, page: currentPage });

  const onChangeInput = (value: string) => {
    const validNumber = isNumber(value);
    setInputValue(validNumber ? value : '');
  };

  const onChangePage = (page: string) => {
    const value = Number(page);
    if (onInputPageChange && value > 0 && value <= totalPages) {
      onInputPageChange(value);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const items = pagination.items.filter(({ type }) => type !== 'next' && type !== 'previous');

  return (
    <PaginatorContainer className={className}>
      {showButtons && (
        <ArrowButton
          disabled={isFirstPage}
          onClick={onPrevious}
          title="Previous page"
        >
          <ChevronLeft />
        </ArrowButton>
      )}
      {showPaginator && (
        <div className="flex items-center gap-4">
          {(!variant || variant === 'default') &&
            items.map(({ page, type }) => {
              if (page) {
                return onRenderPageNumber({ currentPage, page });
              }
              if ((['end-ellipsis', 'start-ellipsis'] as PaginationType[]).includes(type)) {
                return <Page key={type}>...</Page>;
              }
            })}
          {variant === 'input' && (
            <div className="flex items-center gap-2">
              <PageInput
                onChange={(event) => onChangeInput(event.target.value)}
                value={inputValue}
              />
              <Subtitle className="!text-base !leading-[14px]">/</Subtitle>
              <Subtitle className="!text-base !leading-[14px]">{totalPages}</Subtitle>
            </div>
          )}
        </div>
      )}
      {showButtons && (
        <ArrowButton
          disabled={isLastPage}
          onClick={onNext}
          title="Next page"
        >
          <ChevronRight />
        </ArrowButton>
      )}
    </PaginatorContainer>
  );
};
