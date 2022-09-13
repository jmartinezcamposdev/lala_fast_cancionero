<?php

use JetBrains\PhpStorm\ArrayShape;

function connectDB(bool $autocommit = true): mysqli
{
    $server = $_ENV['DB_SERVER'];
    $user = $_ENV['DB_USER'];
    $pass = $_ENV['DB_PASS'];
    $db_name = $_ENV['BD_NAME'];

    if (!defined('DB_NAME')) {
        define('DB_NAME', 'data_portal_db');
    }

    //variable que guarda la conexión de la base de datos
    $connection = mysqli_connect($server, $user, $pass, $db_name);
    mysqli_set_charset($connection, 'utf8');

    // En caso de que se quiera desactivar, será necesario ejecutar commit tras realizar las sentencias
    if (!$autocommit) {
        $connection->autocommit(false);
    }

    // Comprobamos si la conexión ha tenido exito
    if(!$connection){
        echo 'Ha sucedido un error inexperado en la conexion de la base de datos<br>';
    }
    // Devolvemos el objeto de conexión para usarlo en las consultas
    return $connection;
}

function fastQuerySQL(string $sql, mysqli $connection = null, int $mode = MYSQLI_BOTH, array $limits = null,
                      int &$count = null): array
{
    if ($connection == null) {
        // Creamos la conexión
        $connection = connectDB();
    }
    // Obtenemos el resultado y los datos, y si no existen datos finaliza la petición
    $result = $connection->query($sql);
    try {
        $data = $result->fetch_all($mode);
        if ($data == null) {
            $data = array();
        }
    } catch(Throwable) {
        $data = array();
    }
    //
    if ($count != null) {
        $count = sizeof($data);
    }
    //
    if ($limits != null && key_exists('offset', $limits) && key_exists('length', $limits)) {
        $data = array_slice($data, $limits['offset'], $limits['length']);
    }
    // Recuperamos los datos
    return $data;
}

#[ArrayShape(['songs_data' => "array", 'count' => "mixed"])]
function initialSearch(mysqli $connection): array
{
    $songsSql = "SELECT reference, singer_name, song_name FROM songs ORDER BY RAND() LIMIT 10";
    $countSql = "SHOW INDEXES FROM songs WHERE Key_name = 'songs_reference_IDX'";
    $songsCardinality = fastQuerySQL($countSql, $connection)[0]['Cardinality'];
    $songsResult = fastQuerySQL($songsSql, $connection);
    return ['songs_data' => $songsResult, 'count' => $songsCardinality];
}

function manageRequest(mysqli $connection): ?string
{

    switch ($_POST['request']) {
        case 'general_search':
            $searchText = $_POST['text'];
            $sql = "SELECT id, reference, singer_name, song_name FROM songs "
                . " WHERE singer_name LIKE '%" . $searchText . "%' "
                . " OR song_name = '%" . $searchText . "%' "
                . " OR reference LIKE '%" . $searchText . "%'";
            //
            $limits = null;
            if (key_exists('offset', $_POST) && key_exists('length', $_POST)) {
                $limits = ['offset' => $_POST['offset'], 'length' => $_POST['length']];
            }
            $count = 0;
            //
            $result = fastQuerySQL($sql, $connection, limits: $limits, count: $count);
            //
            $songsData = array_map(function ($row) {
                return [$row['reference'], $row['singer_name'], $row['song_name']];
            }, $result);
            //
            return json_encode([
                'status' => 'success',
                'songs_data' => $songsData,
                'count' => $count,
            ]);
        default:
            break;
    }
    return null;
}