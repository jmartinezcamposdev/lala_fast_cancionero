import mysql.connector
from mysql.connector.abstracts import MySQLConnectionAbstract
from mysql.connector.cursor import MySQLCursor


def get_connection(host_url: str = None, host_port: int = None, database_name: str = None,
                   user_text: str = None, pass_text: str = None) -> MySQLConnectionAbstract:
    connection = mysql.connector.connect(
        user=user_text,
        password=pass_text,
        host=host_url,
        port=host_port,
        database=database_name
    )
    return connection


class DBController:
    cursor: MySQLCursor = None
    connection: MySQLConnectionAbstract = None
    query: str = None

    def __init__(self, host_url: str = None, host_port: int = None, database_name: str = None,
                 user_text: str = None, pass_text: str = None):
        self.connect(host_url, host_port, database_name, user_text, pass_text)

    def connect(self, host_url: str = None, host_port: int = None, database_name: str = None,
                user_text: str = None, pass_text: str = None):
        connection = get_connection(host_url, host_port, database_name, user_text, pass_text)
        self.connection = connection
        self.cursor = connection.cursor()

    def execute_query(self, query: str):
        self.query = query
        self.cursor.execute(self.query)
        result = self.cursor.fetchall()
        return result

    def commit_transactions(self):
        self.connection.commit()
