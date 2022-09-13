var currentPage = 1;
var totalCount = 15000;
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
        url: '/lalakaraoke/', // TODO: arreglar
        dataType: 'JSON',
        data: payload,
        success:
            function (data, status) {
                //
                // const parsedData = JSON.parse(data);
                if (data['status'] === "success" && data['songs_data'].length > 0) {
                    buildTable(data['songs_data'], );
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

function buildTable(tableRows, count) {
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
    //
    buildPagination(count);
}

function displayError() {
    const mainTableContainer = $('#main-table-container');
    mainTableContainer.empty();
    let errorHtml = '<h4>¡No se han encontrado canciones!</h4>';
    mainTableContainer.append(errorHtml);
}

function buildPagination() {
    // const pagesCount = getTotalPages();
    //
    const pagesCount = 5;
    //
    const numberedItems = $('li.numbered-page-item');
    const firstItem = $('#first-page');
    const previousItem = $('#previous-page');
    const nextItem = $('#next-page');
    const lastItem = $('#last-page');
    numberedItems.removeClass('no-visible');
    for (let i = 0; i < numberedItems.length; i++) {
        if (i >= pagesCount) {
            $(numberedItems[i]).addClass('no-visible');
        }
    }

    //
    if (window.currentPage === 1) {
        firstItem.addClass('no-visible');
        previousItem.addClass('no-visible');
    }
    if (window.currentPage === pagesCount) {
        nextItem.addClass('no-visible');
        lastItem.addClass('no-visible');
    }

}

function changePage() {
    $('li:nth-child(7)').attr('data-item-index');
}

function firstPage() {
    window.currentPage = 1;
}

function previousPage() {

}

function nextPage() {

}

function lastPage() {
    buildPagination();
}

function getTotalPages() {
    return Math.trunc(window.totalCount / 10) + 1;
}

