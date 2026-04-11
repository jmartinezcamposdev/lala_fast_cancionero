import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../data/lala_data.db');

const ITEMS_PER_PAGE = 20;

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true });
  }
  return db;
}

export interface Song {
  id: number;
  reference: string;
  artist_name: string;
  song_name: string;
}

export function searchSongs(searchText: string, page: number = 0): Song[] {
  const database = getDb();
  const searchTerm = `%${searchText}%`;
  const offset = page * ITEMS_PER_PAGE;

  const stmt = database.prepare(`
    SELECT id, reference, artist_name, song_name
    FROM songs
    WHERE artist_name LIKE ? OR song_name LIKE ? OR reference LIKE ?
    ORDER BY artist_name, song_name
    LIMIT ? OFFSET ?
  `);

  return stmt.all(searchTerm, searchTerm, searchTerm, ITEMS_PER_PAGE, offset) as Song[];
}

export function countSongs(searchText: string): number {
  const database = getDb();
  const searchTerm = `%${searchText}%`;

  const stmt = database.prepare(`
    SELECT COUNT(*) as total
    FROM songs
    WHERE artist_name LIKE ? OR song_name LIKE ? OR reference LIKE ?
  `);

  const result = stmt.get(searchTerm, searchTerm, searchTerm) as { total: number };
  return result.total;
}

export function getRandomSongs(limit: number = 20): Song[] {
  const database = getDb();

  const stmt = database.prepare(`
    SELECT id, reference, artist_name, song_name
    FROM songs
    ORDER BY RANDOM()
    LIMIT ?
  `);

  return stmt.all(limit) as Song[];
}

export function getTotalCount(): number {
  const database = getDb();
  const stmt = database.prepare('SELECT COUNT(*) as total FROM songs');
  const result = stmt.get() as { total: number };
  return result.total;
}

export function getItemsPerPage(): number {
  return ITEMS_PER_PAGE;
}
