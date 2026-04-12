import type { JSX } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import Header from './Header';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';
import LoadingIndicator from './LoadingIndicator';
import SongTable from './SongTable';
import Pagination from './Pagination';
import TableWrapper from './TableWrapper';

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

export default function SongSearch({ initialSongs, totalCount: initialTotal, initialSearch, itemsPerPage }: Props): JSX.Element {
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
      setSongs(data.songs_data.map((s: string[]) => ({ reference: s[0], artist_name: s[1], song_name: s[2] })));
      setTotalCount(data.count);
      setCurrentPage(page);
      setHasSearched(true);
    } catch (err) {
      console.error('Failed to fetch songs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    void doSearch(searchText, 0);
  };

  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    setSearchText((e.target as HTMLInputElement).value);
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      void doSearch(searchText, page);
    }
  };

  const displaySongs = hasSearched ? songs : initialSongs;

  return (
    <div class="song-search-app">
      <Header />
      <HeroSection />
      <TableWrapper>
        <div class="search-row">
          <LoadingIndicator visible={loading} />
          <SearchBar value={searchText} onInput={handleInput} onSubmit={handleSubmit} loading={loading} />
        </div>
        <SongTable songs={displaySongs} hasSearched={hasSearched} />
        {hasSearched ? <Pagination currentPage={currentPage} totalPages={totalPages} onGoToPage={goToPage} /> : <></>}
      </TableWrapper>
    </div>
  );
}
