//
function searchSongOrArtist() {
    const searchText = $('#song-search')[0].value;
    //
    const payload = {
        'request': 'general_search',
        'text': searchText,
    };
    //
    $.ajax({
        method: "POST",
        url: '/lala/', // TODO: arreglar
        dataType: 'JSON',
        data: payload,
        success:
            function (data, status) {
                //
                // const parsedData = JSON.parse(data);
                if (data['status'] === "success" && data['table_data'].length > 0) {
                    buildTable(data['table_data']);
                } else {
                    // TODO: también si no hay datos
                    displayError();
                }
            },
        error: function () {
            displayError();
        },
    });
}

function buildTable(tableRows) {
    const mainTableContainer = $('#main-table-container');
    //
    let tableHtml = '<table class="table table-bordered">'
        + '<thead>'
        + '<tr>'
        + '<th scope="col">Referencia</th>'
        + '<th scope="col">Artista</th>'
        + '<th scope="col">Canción</th>'
        + '</tr>'
        + '</thead>';
    tableHtml += '<tbody>';
    //
    for (let i = 0; i < tableRows.length; i++) {
        tableHtml += '<tr>'
            + '<th scope="row">' + tableRows[i][0] + '</th>'
            + '<td>' + tableRows[i][1] + '</td>'
            + '<td>' + tableRows[i][2] + '</td>'
            + '</tr>';
    }
    //
    tableHtml +=  '</tbody>'
        + '</table>';
    //
    mainTableContainer.empty();
    mainTableContainer.append(tableHtml);
}

function displayError() {
    const mainTableContainer = $('#main-table-container');
    mainTableContainer.empty();
    let errorHtml = '<h4>¡No se han encontrado canciones!</h4>';
    mainTableContainer.append(errorHtml);
}
