import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';

interface Song {
  reference: string;
  artist_name: string;
  song_name: string;
}

interface Props {
  initialSongs: Song[];
  totalCount: number;
  initialSearch: string;
  itemsPerPage: number;
}

const MAX_VISIBLE_PAGES = 10;

export default function SongSearch({ initialSongs, totalCount: initialTotal, initialSearch, itemsPerPage }: Props) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [searchText, setSearchText] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialSearch ? 0 : -1);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialSearch);

  const totalPages = hasSearched ? Math.ceil(totalCount / itemsPerPage) : 0;

  const doSearch = useCallback(async (text: string, page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/catalog?search=${encodeURIComponent(text)}&page=${page}`);
      const data = await res.json();
      const parsedSongs = data.songs_data.map((s: string[]) => ({
        reference: s[0],
        artist_name: s[1],
        song_name: s[2],
      }));
      setSongs(parsedSongs);
      setTotalCount(data.count);
      setCurrentPage(page);
      setHasSearched(true);
    } catch (err) {
      console.error('Failed to fetch songs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    doSearch(searchText, 0);
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      doSearch(searchText, page);
    }
  };

  const renderPagination = () => {
    if (!hasSearched || totalPages <= 0) return null;

    const pages: (number | null)[] = [];
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
          onClick={() => goToPage(0)}
        >
          {'<<'}
        </button>
        <button
          class="page-btn"
          disabled={currentPage === 0}
          onClick={() => goToPage(currentPage - 1)}
        >
          {'<'}
        </button>
        {pages.map((page) => (
          page !== null && (
            <button
              key={page}
              class={`page-btn ${page === currentPage ? 'page-btn-active' : ''}`}
              onClick={() => goToPage(page)}
            >
              {page + 1}
            </button>
          )
        ))}
        <button
          class="page-btn"
          disabled={currentPage >= totalPages - 1}
          onClick={() => goToPage(currentPage + 1)}
        >
          {'>'}
        </button>
        <button
          class="page-btn"
          disabled={currentPage >= totalPages - 1}
          onClick={() => goToPage(totalPages - 1)}
        >
          {'>>'}
        </button>
      </div>
    );
  };

  const displaySongs = hasSearched ? songs : initialSongs;

  return (
    <div class="song-search-app">
      <header class="top-header">
        <div class="header-inner">
          <a href="/" class="logo-text">Karaoke LaLa</a>
          <span class="header-divider">|</span>
          <a href="/" class="subtitle-text">Cancionero</a>
        </div>
      </header>

      <section class="hero-section">
        <h1 class="hero-title">
          <span class="hero-line hero-line-1">ENCUENTRA</span>
          <span class="hero-line hero-line-2">TU CANCIÓN</span>
        </h1>
      </section>

      <div class="table-wrapper">
        {/* Search bar + loading indicator row */}
        <div class="search-row">
          <span class={`loading-indicator ${loading ? 'visible' : ''}`}>
            <i class="mdi mdi-loading mdi-spin" /> Cargando...
          </span>
          <form class="search-bar" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Buscar"
              value={searchText}
              onInput={(e) => setSearchText((e.target as HTMLInputElement).value)}
            />
            <button type="submit" disabled={loading}>
              <i class="mdi mdi-magnify" />
            </button>
          </form>
        </div>

        {/* Table always visible */}
        <div class="table-container">
          <div class="table-inner">
            <table>
              <thead>
                <tr>
                  <th class="col-artist">Artista</th>
                  <th class="col-title">Título</th>
                  <th class="col-ref">Referencia</th>
                </tr>
              </thead>
              <tbody>
                {displaySongs.length > 0 ? (
                  displaySongs.map((song, i) => (
                    <tr key={`${song.reference}-${i}`}>
                      <td class="col-artist">{song.artist_name}</td>
                      <td class="col-title">{song.song_name}</td>
                      <td class="col-ref">{song.reference}</td>
                    </tr>
                  ))
                ) : hasSearched ? (
                  <tr>
                    <td colspan="3" class="no-results-cell">¡No se han encontrado canciones!</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {renderPagination()}
      </div>
    </div>
  );
}
