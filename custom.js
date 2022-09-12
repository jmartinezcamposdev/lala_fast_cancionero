function search(text) {
    const payload = {};
    //
    $.ajax({
        method: "POST",
        url: '',
        dataType: 'JSON',
        data: payload,
        success:
            function (data, status) {
                loadingTag.style.visibility = "hidden";
                const parsedData = JSON.parse(data);
                if (status === "success" && parsedData['content']['status'] === 'success') {
                    successTag.style.visibility = "visible";
                    reloadPage();
                } else {
                    errorTag.style.visibility = "visible";
                }
            },
        error: function () { loadingTag.style.visibility = 'hidden'; errorTag.style.visibility = 'visible'; }
    });
}

function buildTable(tableRows) {
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
    $('#main-table-container').append(tableHtml);
}

function displayError() {
    
}
