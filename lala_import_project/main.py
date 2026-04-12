import json
import sys

from sqlite_controller import DBController


def parse_file(file_name: str) -> dict:
    json_file = open(file_name, mode='r')
    file_lines = ""
    print("Leyendo fichero: " + str(file_name))
    index = 0
    for line in json_file.readlines():
        file_lines += line
        if index % 10000 == 0:
            print("Un total de " + str(index) + " líneas han sido leídas")
        index += 1
    print("Un total de " + str(index) + " líneas han sido leídas. Fichero leído, parseando como diccionario.")
    file_values = json.loads(file_lines)
    print("Devolviendo diccionario")
    return file_values


def insert_error_log_db(db_controller: DBController, error_type: str, error_message: str):
    insert_sql = ("INSERT INTO import_errors (error_type, error_message) "
                  + " VALUES ('" + str(error_type).replace("'", "''") + "', '" + str(error_message).replace("'", "''") + "')")
    db_controller.execute_query(insert_sql)
    db_controller.commit_transactions()


def save_result_to_db(file_result: dict):
    db_controller = DBController('lala_data.db')
    index = 0
    for row in file_result:
        try:
            row_values = row['value']
            artist = row_values['cantante']
            song = row_values['cancion']
            reference = row_values['referencia']
            values_found = True
        except KeyError:
            artist = ''
            song = ''
            reference = ''
            values_found = False
        if not values_found:
            error_message = 'Clave no encontrada en índice'
            print(error_message, file=sys.stderr)
            insert_error_log_db(db_controller, 'Clave no encontrada', error_message)
            continue
        if len(artist) > 100:
            error_message = "El nombre de cantante '" + str(artist) + "' no ha podido ser introducido. "
            print(error_message, file=sys.stderr)
            insert_error_log_db(db_controller, 'Nombre largo de cantante', error_message)
            artist = artist[0:75] + "... (nombre grande)"
        if len(song) > 100:
            error_message = "El nombre de canción '" + str(song) + "' no ha podido ser introducido. "
            print(error_message, file=sys.stderr)
            insert_error_log_db(db_controller, 'Nombre largo de canción', error_message)
            song = song[0:75] + "... (nombre grande)"
        if not str(reference).isnumeric():
            error_message = ("La referencia '" + str(reference) + "' no es numérica, "
                             + "con lo que no ha podido ser introducida. ")
            print(error_message, file=sys.stderr)
            insert_error_log_db(db_controller, 'Referencia no numérica', error_message)
            reference = -1
        artist = artist.replace("'", "''")
        song = song.replace("'", "''")
        insert_sql = ("INSERT INTO songs (reference, artist_name, song_name) "
                      + " VALUES ('" + str(reference) + "', '" + str(artist) + "', '" + str(song) + "')")
        db_controller.execute_query(insert_sql)
        if index % 1000 == 0:
            print("Confirmando inserciones en base de datos, progreso: " + str(index) + " elementos procesados")
            db_controller.commit_transactions()
        index += 1
    db_controller.commit_transactions()


def start_script():
    print("Arrancando script de importación de datos")
    file_path = "./lala_sources/"
    for i in range(1, 7):
        file_name = "source_" + str(i) + ".json"
        file_result = parse_file(file_path + file_name)
        save_result_to_db(file_result)
    print("Script de importación de datos finalizado")


if __name__ == '__main__':
    start_script()
