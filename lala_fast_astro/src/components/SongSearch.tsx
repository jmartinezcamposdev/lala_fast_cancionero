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
      <div id="pagination-container">
        <nav>
          <ul class="pagination flex-wrap pagination-rounded" id="pag_container">
            <li
              onClick={() => goToPage(0)}
              id="first-page"
              class={`page-item ${currentPage === 0 ? 'disabled' : ''}`}
            >
              <a class="page-link">{'<<'}</a>
            </li>
            <li
              onClick={() => goToPage(currentPage - 1)}
              id="previous-page"
              class={`page-item ${currentPage === 0 ? 'disabled' : ''}`}
            >
              <a class="page-link">{'<'}</a>
            </li>
            {pages.map((page) => (
              page !== null && (
                <li
                  key={page}
                  onClick={() => goToPage(page)}
                  class={`page-item numbered-page-item ${page === currentPage ? 'active' : ''}`}
                >
                  <a class="page-link">{page + 1}</a>
                </li>
              )
            ))}
            <li
              onClick={() => goToPage(currentPage + 1)}
              id="next-page"
              class={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}
            >
              <a class="page-link">{'>'}</a>
            </li>
            <li
              onClick={() => goToPage(totalPages - 1)}
              id="last-page"
              class={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}
            >
              <a class="page-link">{'>>'}</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <>
      <div id="main-title-container">
        <h1>Cancionero - Búsqueda rápida</h1>
      </div>
      <form id="search-container" onSubmit={handleSubmit}>
        <label for="song-search">Búsqueda</label>
        <input
          id="song-search"
          type="text"
          class="form-control"
          placeholder="Busca tu artista o canción preferidos"
          value={searchText}
          onInput={(e) => setSearchText((e.target as HTMLInputElement).value)}
        />
        <button type="submit" class="btn btn-primary">
          <i class="mdi mdi-magnify" />
        </button>
      </form>
      {loading && <p style={{ textAlign: 'center' }}>Cargando...</p>}
      {hasSearched && !loading && songs.length === 0 && (
        <div id="main-table-container">
          <h4>¡No se han encontrado canciones!</h4>
        </div>
      )}
      {songs.length > 0 && (
        <>
          <div id="main-table-container">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Referencia</th>
                  <th scope="col">Artista</th>
                  <th scope="col">Canción</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.reference}>
                    <th scope="row">{song.reference}</th>
                    <td>{song.artist_name}</td>
                    <td>{song.song_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      )}
    </>
  );
}
