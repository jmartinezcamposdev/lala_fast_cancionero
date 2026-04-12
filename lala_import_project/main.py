import json
import sys

from database_controller import DBController


def parse_file(file_name: str) -> dict:
    json_file = open(file_name, mode='r')
    file_lines = ""
    print("Leyendo fichero: " + str(file_name))
    index = 0
    for line in json_file.readlines():
        file_lines += line
        if index % 1000 == 0:
            print("Un total de " + str(index) + " líneas han sido leídas")
        index += 1
    print("Fichero leído, parseando como diccionario")
    file_values = json.loads(file_lines)
    print("Devolviendo diccionario")
    return file_values


def insert_error_log_db(db_controller: DBController, error_type: str, error_message: str):
    insert_sql = ("INSERT INTO songs (error_type, error_message) "
                  + " VALUES ('" + str(error_type) + "', '" + str(error_message) + "')")
    db_controller.execute_query(insert_sql)
    db_controller.commit_transactions()


def save_result_to_db(file_result: dict):
    db_controller = DBController('localhost', 3306, 'lala_test_db', 'query_user', 'Query_33_Pass')
    index = 0
    for row in file_result:
        #
        try:
            row_values = row['value']
            singer = row_values['cantante']
            song = row_values['cancion']
            reference = row_values['referencia']
            values_found = True
        except KeyError:
            singer = ''
            song = ''
            reference = ''
            values_found = False
        #
        if not values_found:
            error_message = 'Clave no encontrada en índice'
            print(error_message, file=sys.stderr)
            insert_error_log_db(db_controller, 'Clave no encontrada', error_message)
            continue
        #
        if len(singer) > 100:
            error_message = "El nombre de cantante '" + str(singer) + "' no ha podido ser introducido. "
            print(error_message, file=sys.stderr)
            insert_error_log_db(db_controller, 'Nombre largo de cantante', error_message)
            singer = singer[0:75] + "... (nombre grande)"
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
        #
        singer = singer.replace("'", "\\'")
        song = song.replace("'", "\\'")
        #
        insert_sql = ("INSERT INTO songs (reference, singer_name, song_name) "
                      + " VALUES ('" + str(reference) + "', '" + str(singer) + "', '" + str(song) + "')")
        db_controller.execute_query(insert_sql)
        #
        if index % 1000 == 0:
            print("Confirmando inserciones en base de datos, progreso: " + str(index) + " elementos procesados")
            db_controller.commit_transactions()

        #
        index += 1
    db_controller.commit_transactions()


def start_script():
    print("Arrancando script de importación de datos")
    file_path = "/home/javier/Documents/personal/lala_dict/"
    for i in range(1, 7):
        file_name = "lala_dict_" + str(i) + ".json"
        file_result = parse_file(file_path + file_name)
        save_result_to_db(file_result)
    print("hola")


if __name__ == '__main__':
    start_script()
