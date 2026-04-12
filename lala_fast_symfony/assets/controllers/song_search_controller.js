import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['searchInput', 'tableContainer', 'paginationContainer'];
    static values = {
        totalCount: Number,
        searchUrl: String,
    };

    ITEMS_PER_PAGE = 10;
    MAX_PAGINATION_COUNT = 10;

    connect() {
        this.currentPage = 1;
    }

    search(event) {
        const searchText = this.searchInputTarget.value;
        const offset = event.params?.pageIndex 
            ? (event.params.pageIndex - 1) * this.ITEMS_PER_PAGE
            : -1;

        const payload = new URLSearchParams();
        payload.append('request', 'general_search');
        payload.append('text', searchText);
        payload.append('offset', offset);
        payload.append('length', this.ITEMS_PER_PAGE);

        fetch(this.searchUrlValue, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload,
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.songs_data.length > 0) {
                this.buildTable(data.songs_data, data.count);
            } else {
                this.displayError();
            }
        })
        .catch(() => {
            this.displayError();
        });
    }

    changePage(event) {
        const pageIndex = event.params?.index;
        this.currentPage = pageIndex;
        this.search({ params: { pageIndex } });
        this.updatePaginationUI(pageIndex);
    }

    firstPage() {
        this.changePage({ params: { index: 1 } });
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.changePage({ params: { index: this.currentPage - 1 } });
        }
    }

    nextPage() {
        const maxPage = Math.ceil(this.totalCountValue / this.ITEMS_PER_PAGE);
        if (this.currentPage < maxPage) {
            this.changePage({ params: { index: this.currentPage + 1 } });
        }
    }

    lastPage() {
        const maxPage = Math.ceil(this.totalCountValue / this.ITEMS_PER_PAGE);
        this.changePage({ params: { index: maxPage } });
    }

    buildTable(tableRows, count) {
        this.totalCountValue = count;
        let tableHtml = '<table class="table table-bordered">'
            + '<thead>'
            + '<tr>'
            + '<th scope="col">Referencia</th>'
            + '<th scope="col">Artista</th>'
            + '<th scope="col">Canción</th>'
            + '</tr>'
            + '</thead>';
        tableHtml += '<tbody>';

        for (let i = 0; i < tableRows.length; i++) {
            tableHtml += '<tr>'
                + '<th scope="row">' + tableRows[i][0] + '</th>'
                + '<td>' + tableRows[i][1] + '</td>'
                + '<td>' + tableRows[i][2] + '</td>'
                + '</tr>';
        }

        tableHtml += '</tbody>' + '</table>';

        this.tableContainerTarget.innerHTML = tableHtml;
        this.updatePaginationUI(this.currentPage);
    }

    displayError() {
        this.tableContainerTarget.innerHTML = '<h4>¡No se han encontrado canciones!</h4>';
    }

    updatePaginationUI(currentPage) {
        const pagesCount = Math.ceil(this.totalCountValue / this.ITEMS_PER_PAGE);
        const numberedItems = this.paginationContainerTarget.querySelectorAll('li.numbered-page-item');
        const firstItem = this.paginationContainerTarget.querySelector('#first-page');
        const previousItem = this.paginationContainerTarget.querySelector('#previous-page');
        const nextItem = this.paginationContainerTarget.querySelector('#next-page');
        const lastItem = this.paginationContainerTarget.querySelector('#last-page');

        numberedItems.forEach((item, i) => {
            item.classList.remove('no-visible', 'active');
            if (i < pagesCount) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
            if (i + 1 === currentPage) {
                item.classList.add('active');
            }
        });

        if (currentPage === 1) {
            firstItem.style.display = 'none';
            previousItem.style.display = 'none';
        } else {
            firstItem.style.display = '';
            previousItem.style.display = '';
        }

        if (currentPage === pagesCount) {
            nextItem.style.display = 'none';
            lastItem.style.display = 'none';
        } else {
            nextItem.style.display = '';
            lastItem.style.display = '';
        }
    }
}
