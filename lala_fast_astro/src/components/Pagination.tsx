import type { JSX } from 'preact';
import '../styles/Pagination.css';

interface Props {
  currentPage: number;
  totalPages: number;
  onGoToPage: (page: number) => void;
}

const MAX_VISIBLE_PAGES = 10;

export default function Pagination({ currentPage, totalPages, onGoToPage }: Props): JSX.Element | null {
  if (totalPages <= 0) return null;

  const pages: number[] = [];
  const startPage = Math.max(0, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES);

  for (let i = startPage; i < endPage; i++) {
    pages.push(i);
  }

  return (
    <div class="pagination-wrapper">
      <button
        class="page-btn"
        disabled={currentPage === 0}
        onClick={() => onGoToPage(0)}
      >
        {'<<'}
      </button>
      <button
        class="page-btn"
        disabled={currentPage === 0}
        onClick={() => onGoToPage(currentPage - 1)}
      >
        {'<'}
      </button>
      {pages.map((page) => (
        <button
          key={page}
          class={`page-btn ${page === currentPage ? 'page-btn-active' : ''}`}
          onClick={() => onGoToPage(page)}
        >
          {page + 1}
        </button>
      ))}
      <button
        class="page-btn"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onGoToPage(currentPage + 1)}
      >
        {'>'}
      </button>
      <button
        class="page-btn"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onGoToPage(totalPages - 1)}
      >
        {'>>'}
      </button>
    </div>
  );
}
