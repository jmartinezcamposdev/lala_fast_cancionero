DROP TABLE IF EXISTS import_errors;
CREATE TABLE import_errors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  error_type VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL
);

DROP TABLE IF EXISTS songs;
CREATE TABLE songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference BIGINT NOT NULL,
  artist_name VARCHAR(100) NOT NULL,
  song_name VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS songs_reference_IDX ON songs (reference);
CREATE INDEX IF NOT EXISTS songs_artist_name_IDX ON songs (artist_name);
CREATE INDEX IF NOT EXISTS songs_song_name_IDX ON songs (song_name);
