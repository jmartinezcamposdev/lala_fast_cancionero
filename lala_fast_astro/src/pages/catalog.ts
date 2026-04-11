import type { APIRoute } from 'astro';
import { searchSongs, countSongs, getItemsPerPage } from '../lib/db';

export const GET: APIRoute = ({ url }) => {
  const search = url.searchParams.get('search') || '';
  const page = parseInt(url.searchParams.get('page') || '0', 10);

  const songs = searchSongs(search, page);
  const totalCount = countSongs(search);

  return new Response(JSON.stringify({
    status: 'success',
    songs_data: songs.map(song => [song.reference, song.artist_name, song.song_name]),
    count: totalCount,
    items_per_page: getItemsPerPage(),
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
