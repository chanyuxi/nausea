import type { DataViewPaginationProps } from '../theme/data-view-components'

export function DataViewPagination(props: DataViewPaginationProps) {
  const pageIndex = props.state.pagination.pageIndex
  const pageSize = props.state.pagination.pageSize
  const canGoNext =
    typeof props.total === 'number'
      ? (pageIndex + 1) * pageSize < props.total
      : true

  return (
    <nav
      aria-label="Pagination"
      className={props.className}
      data-nausea-data-view="pagination"
    >
      <button
        disabled={pageIndex <= 0}
        type="button"
        onClick={() => props.actions.setPageIndex(pageIndex - 1)}
      >
        Previous
      </button>
      <span>
        Page {pageIndex + 1}, {pageSize} / page
        {typeof props.total === 'number' ? `, ${props.total} total` : null}
      </span>
      <button
        disabled={!canGoNext}
        type="button"
        onClick={() => props.actions.setPageIndex(pageIndex + 1)}
      >
        Next
      </button>
    </nav>
  )
}
