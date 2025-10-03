export type PaginationType = 'end-ellipsis' | 'first' | 'last' | 'next' | 'page' | 'previous' | 'start-ellipsis';

export type PaginationProps = {
  boundaryCount?: number;
  count?: number;
  hideNextButton?: boolean;
  hidePrevButton?: boolean;
  page: number;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  siblingCount?: number;
};

export type PaginationItem = {
  disabled?: boolean;
  page?: number;
  selected: boolean;
  type: PaginationType;
};

export function usePagination(props: PaginationProps) {
  const {
    boundaryCount = 1,
    count = 1,
    hideNextButton = false,
    hidePrevButton = false,
    page,
    showFirstButton = false,
    showLastButton = false,
    siblingCount = 1,
  } = props;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  // Basic list of items to render
  // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
  const itemList = [
    ...(showFirstButton ? ['first'] : []),
    ...(hidePrevButton ? [] : ['previous']),
    ...startPages,

    // Start ellipsis
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis']
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    ...(siblingsEnd < count - boundaryCount - 1
      ? ['end-ellipsis']
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),

    ...endPages,
    ...(hideNextButton ? [] : ['next']),
    ...(showLastButton ? ['last'] : []),
  ] as (number | PaginationType)[];

  const buttonPage = (type: PaginationType) => {
    const pages: Partial<Record<PaginationType, number>> = {
      first: 1,
      last: count,
      next: page + 1,
      previous: page - 1,
    };

    return pages[type];
  };

  const items: PaginationItem[] = itemList.map((item) => {
    return typeof item === 'number'
      ? {
          page: item,
          selected: item === page,
          type: 'page',
        }
      : {
          disabled: item.indexOf('ellipsis') === -1 && (item === 'next' || item === 'last' ? page >= count : page <= 1),
          page: buttonPage(item),
          selected: false,
          type: item,
        };
  });

  return {
    items,
  };
}
