document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([40.464, 17.247], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    var markers = L.markerClusterGroup();
    var dataLayers = {
        insegne: [],
        pubblicita: []
    };
    var allData = [];

    map.addLayer(markers);

    function addMarkers(data) {
        markers.clearLayers();  // Clear existing markers before adding new ones
        data.forEach(function (item) {
            if (item.CoordinateX && item.CoordinateY) {
                var marker = L.marker([item.CoordinateX, item.CoordinateY]);
                marker.bindPopup(createPopupContent(item));
                markers.addLayer(marker);
            }
        });
    }

    function createPopupContent(item) {
        var content = '<div class="popup-content">';
        Object.keys(item).forEach(function (key) {
            let formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (item[key] && item[key].toString().trim() !== '') {
                content += `<strong>${formattedKey}:</strong> ${item[key]}<br>`;
            }
        });
        content += '</div>';
        return content;
    }

    function loadData() {
        Papa.parse('Taranto.ICP.Definitivo Insegne d\'esercizio.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                dataLayers.insegne = results.data;
                allData = allData.concat(results.data);
                addMarkers(allData);
            }
        });

        Papa.parse('Taranto.ICP.Definitivo solo pubblicità.csv', {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                dataLayers.pubblicita = results.data;
                allData = allData.concat(results.data);
                addMarkers(allData);
            }
        });
    }

    document.getElementById('check_insegne').addEventListener('change', function (e) {
        applyFilters();
    });

    document.getElementById('check_pubblicita').addEventListener('change', function (e) {
        applyFilters();
    });

    function applyFilters() {
        var filteredData = [];

        var includeInsegne = document.getElementById('check_insegne').checked;
        var includePubblicita = document.getElementById('check_pubblicita').checked;

        console.log('Filters applied. Include Insegne:', includeInsegne, 'Include Pubblicita:', includePubblicita);

        if (includeInsegne) {
            filteredData = filteredData.concat(dataLayers.insegne);
        }
        if (includePubblicita) {
            filteredData = filteredData.concat(dataLayers.pubblicita);
        }

        var idOggetto = document.getElementById('filter-idoggetto').value;
        var idUtente = document.getElementById('filter-idutente').value;
        var ragioneSociale = document.getElementById('filter-ragione_sociale').value;
        var pIva = document.getElementById('filter-p_iva').value;
        var codF = document.getElementById('filter-cod_f').value;

        console.log('Filter values - ID OGGETTO:', idOggetto, 'IDUTENTE:', idUtente, 'RAGIONE SOCIALE:', ragioneSociale, 'P.IVA:', pIva, 'COD_F:', codF);

        if (idOggetto) {
            filteredData = filteredData.filter(item => item['ID OGGETTO'] === idOggetto);
        }
        if (idUtente) {
            filteredData = filteredData.filter(item => item['IDUTENTE'] === idUtente);
        }
        if (ragioneSociale) {
            filteredData = filteredData.filter(item => item['RAGIONE_SOCIALE'] && item['RAGIONE_SOCIALE'].includes(ragioneSociale));
        }
        if (pIva) {
            filteredData = filteredData.filter(item => item['P_IVA'] === pIva);
        }
        if (codF) {
            filteredData = filteredData.filter(item => item['COD_F'] === codF);
        }

        console.log('Filtered data length:', filteredData.length);
        addMarkers(filteredData);
    }

    window.applyFilters = applyFilters; // Make this function globally available for HTML button
    loadData();
});
