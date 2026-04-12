<?php

include_once "autoload.php";
include_once "request_manager.php";
//
$MAX_PAGINATION_COUNT = 10;
//
$connection = connectDB();
$initialData = initialSearch($connection);
//
if (isset($_POST) && !empty($_POST)) {
    if (key_exists('request', $_POST)) {
        $result = manageRequest($connection);
        if ($result != null) {
            print($result);
        }
    }
    die();
}
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
    <title>Búsqueda rápida - Lala Karaoke</title>
    <link href="custom.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous"/>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css" rel="stylesheet"/>
    <script src="custom.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
</head>
<body>
<div id="main-title-container">
    <h1>Cancionero - Búsqueda rápida</h1>
</div>
<div id="search-container">
    <label for="song-search">Búsqueda</label>
    <input id="song-search" type="text" class="form-control" placeholder="Busca tu artista o canción preferidos">
    <button class="btn btn-primary" onclick="searchSongOrArtist()"><i class="mdi mdi-magnify"></i></button>
</div>
<div id="main-table-container">
</div>
<div id="pagination-container">
    <div id="pagination" class="row">
        <div class="pages-selector">
            <nav>
                <ul class="pagination flex-wrap pagination-rounded" id ="pag_container">
                    <li onclick="firstPage()" id="first-page" class="page-item"><a class="page-link"><<</a></li>
                    <li onclick="previousPage()" id="previous-page" class="page-item"><a class="page-link"><</a></li>
                    <?php
                    for ($i = 1; $i <= $MAX_PAGINATION_COUNT; $i++) {
                        ?>
                        <li onclick="changePage(<?= $i ?>)" data-item-index="<?= $i ?>" class="page-item<?= $i == 1 ? " active" : "" ?> numbered-page-item"><a class="page-link"><?= $i ?></a></li>
                        <?php
                    }
                    ?>
                    <li onclick="nextPage()" id="next-page" class="page-item"><a class="page-link">></a></li>
                    <li onclick="lastPage()" id="last-page" class="page-item"><a class="page-link">>></a></li>
                </ul>
            </nav>
        </div>
    </div>
</div>
<script>
    //
    buildTable(<?= json_encode($initialData['songs_data']) ?>, <?= json_encode($initialData['count']) ?>);
    //
</script>
</body>
</html>


