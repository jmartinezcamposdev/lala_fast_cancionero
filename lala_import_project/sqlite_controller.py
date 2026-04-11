import sqlite3


def get_connection(db_path: str = 'lala_karaoke.db') -> sqlite3.Connection:
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    return connection


class DBController:
    cursor: sqlite3.Cursor = None
    connection: sqlite3.Connection = None
    query: str = None

    def __init__(self, db_path: str = 'lala_karaoke.db') -> None:
        self.connect(db_path)

    def connect(self, db_path: str = 'lala_karaoke.db') -> None:
        connection = get_connection(db_path)
        self.connection = connection
        self.cursor = connection.cursor()

    def execute_query(self, query: str) -> list:
        self.query = query
        self.cursor.execute(self.query)
        result = self.cursor.fetchall()
        return result

    def commit_transactions(self) -> None:
        self.connection.commit()
