(function () {
    // Your app code here
    let medalsData = [];
    let orgMedalsData = [];
    let currentView = 'table';
    let sortColumn = 'rank';
    let sortDirection = 'desc';
    async function fetchMedalsData() {
        try {
            const response = await fetch('https://olympics.com/OG2024/data/CIS_MedalNOCs~lang=ENG~comp=OG2024.json');
            if (response.ok) {
                const data = await response.json();
                const formatResponse = data.medalNOC.filter(item => item.gender === 'TOT' && item.sport === 'GLO').map(item => ({
                    rank: item.rank,
                    medals: {
                        gold: item.gold,
                        silver: item.silver,
                        bronze: item.bronze,
                        total: item.total
                    },
                    country: {
                        name: item.organisation.description
                    }
                }))
                medalsData = formatResponse;
                orgMedalsData = formatResponse;
                renderView();
                sortData('rank')
            }
        } catch (error) {
            console.error('Error fetching medals data:', error);
        }
    }

    // render view

    function renderView() {
        if (currentView === 'table') {
            // load table view
            renderTable();
        } else {
            // load card view
            renderCards();
        }
    }

    function renderTable() {
        const tableBody = document.querySelector('#medals-table tbody');
        tableBody.innerHTML = '';

        medalsData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                    <td>${item.country.name}</td>
                    <td>${item.rank}</td>
                    <td>${item.medals.gold}</td>
                    <td>${item.medals.silver}</td>
                    <td>${item.medals.bronze}</td>
                    <td>${item.medals.total}</td>
            `;
            tableBody.appendChild(row);
        });

    }

    function renderCards() {
        const cardView = document.getElementById('card-view');
        cardView.innerHTML = '';
        medalsData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
            <h2>${item.country.name}</h2>
            <div class="rank">Rank: ${item.rank}</div>
            <div class="medals">
                <div class="medal" title="Gold Medals">
                    <div class="medal-icon gold"><i class="fas fa-medal"></i></div>
                    <div class="medal-count">${item.medals.gold}</div>
                    <div class="medal-type">Gold</div>
                </div>
                <div class="medal" title="Silver Medals">
                    <div class="medal-icon silver"><i class="fas fa-medal"></i></div>
                    <div class="medal-count">${item.medals.silver}</div>
                    <div class="medal-type">Silver</div>
                </div>
                <div class="medal" title="Bronze Medals">
                    <div class="medal-icon bronze"><i class="fas fa-medal"></i></div>
                    <div class="medal-count">${item.medals.bronze}</div>
                    <div class="medal-type">Bronze</div>
                </div>
            </div>
            <div class="total">Total: ${item.medals.total}</div>
        `;
            cardView.appendChild(card);
        });

    }

    function toggleView(view) {
        currentView = view;
        document.getElementById('table-view').style.display = view === 'table' ? 'block' : 'none';
        document.getElementById('card-view').style.display = view === 'card' ? 'flex' : 'none';
        document.getElementById('table-view-icon').classList.toggle('active', view === 'table');
        document.getElementById('card-view-icon').classList.toggle('active', view === 'card');
        renderView();
    }

    function searchData() {
        const searchTerm = document.getElementById('search').value.trim().toLowerCase();
        if (searchTerm) { // in
            const filteredData = medalsData.filter(item =>
                item.country.name.toLowerCase().includes(searchTerm)
            );
            medalsData = filteredData; // [{}]
        } else {
            medalsData = orgMedalsData;
        }
        renderView();
    }

    function sortData(column) {
        if (column === sortColumn) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        medalsData.sort((a, b) => {
            let valueA, valueB;

            if (column === "country") {
                valueA = a.country.name.toLowerCase();
                valueB = b.country.name.toLowerCase();
            } else if (column === 'rank') {
                valueA = a.rank;
                valueB = b.rank;
            } else if (column === 'serial') {
                return 0;
            } else {
                valueA = a.medals[column];
                valueB = b.medals[column];
            }

            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        })
        renderView();
        updateSortIcons();
        // [10, 8, 4, 7, 2, 6].sort((a, b) => a - b )
    }

    function updateSortIcons() {
        document.querySelectorAll('#medals-table th').forEach((th, index) => {
            const column = th.getAttribute('data-sort');
            th.classList.remove('sort-icon', 'desc', 'active');
            if (column === sortColumn && index > 0) {
                th.classList.add('sort-icon', 'active');
                if (sortDirection === 'desc') {
                    th.classList.add('desc');
                }
            }
        });
    }

    document.querySelectorAll('#medals-table th').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.getAttribute('data-sort');
            sortData(column);
        });
    });

    document.getElementById('search').addEventListener('input', searchData);

    document.getElementById('table-view-icon').addEventListener('click', () => toggleView('table'));
    document.getElementById('card-view-icon').addEventListener('click', () => toggleView('card'));

    fetchMedalsData();
})();
