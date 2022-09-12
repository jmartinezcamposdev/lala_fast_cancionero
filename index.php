<?php
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
    <button class="btn btn-primary"><i class="mdi mdi-magnify"></i></button>
</div>
<div id="main-table-container">
    <?php
    /*
    ?>
    <table class="table table-bordered">
        <thead>
        <tr>
            <th scope="col">Referencia</th>
            <th scope="col">Artista</th>
            <th scope="col">Canción</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th scope="row">1</th>
            <td>Otto</td>
            <td>@mdo</td>
        </tr>
        <tr>
            <th scope="row">2</th>
            <td>Thornton</td>
            <td>@fat</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <td>Larry the Bird</td>
            <td>@twitter</td>
        </tr>
        </tbody>
    </table>
    */
    ?>
</div>
<script>
    buildTable([['una', 'dos', 'tres'], ['cuatro', 'cinco', 'seis']])
</script>
</body>
</html>


