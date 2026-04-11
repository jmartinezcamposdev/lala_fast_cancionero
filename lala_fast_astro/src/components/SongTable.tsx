import { useState, useCallback } from 'preact/hooks';

interface Song {
  reference: string;
  artist_name: string;
  song_name: string;
}

interface Props {
  initialSongs: Song[];
  totalCount: number;
  itemsPerPage: number;
}

export default function SongTable({ initialSongs, totalCount: initialTotal, itemsPerPage }: Props) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchSongs = useCallback(async (search: string, page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/catalog?search=${encodeURIComponent(search)}&page=${page}`);
      const data = await res.json();
      const parsedSongs = data.songs_data.map((s: string[]) => ({
        reference: s[0],
        artist_name: s[1],
        song_name: s[2],
      }));
      setSongs(parsedSongs);
      setTotalCount(data.count);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch songs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const goToPage = useCallback((search: string, page: number) => {
    if (page >= 0 && page < Math.ceil(totalCount / itemsPerPage)) {
      fetchSongs(search, page);
    }
  }, [totalCount, itemsPerPage, fetchSongs]);

  return { songs, totalCount, currentPage, totalPages, loading, fetchSongs, goToPage, setSongs, setTotalCount };
}
