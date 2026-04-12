import type { JSX } from 'preact';
import '../styles/SongTable.css';

interface Song {
  reference: string;
  artist_name: string;
  song_name: string;
}

interface Props {
  songs: Song[];
  hasSearched: boolean;
}

export default function SongTable({ songs, hasSearched }: Props): JSX.Element {
  return (
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
            {songs.length > 0 ? (
              songs.map((song, i) => (
                <tr key={`${song.reference}-${i}`}>
                  <td class="col-artist">{song.artist_name}</td>
                  <td class="col-title">{song.song_name}</td>
                  <td class="col-ref">{song.reference}</td>
                </tr>
              ))
            ) : hasSearched ? (
              <tr>
                <td colspan={3} class="no-results-cell">¡No se han encontrado canciones!</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
