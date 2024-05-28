document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([40.464, 17.247], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    var markers = L.markerClusterGroup();
    var dataLayers = {
        insegne: insegneData,
        pubblicita: pubblicitaData
    };

    map.addLayer(markers);

    function addMarkers(data) {
        markers.clearLayers();
        data.forEach(function (item) {
            if (item.CoordinateX && item.CoordinateY) {
                var marker = L.marker([parseFloat(item.CoordinateX), parseFloat(item.CoordinateY)]);
                marker.bindPopup(createPopupContent(item));
                markers.addLayer(marker);
            }
        });
        map.addLayer(markers);
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

    function applyFilters() {
        var filteredData = [];

        var includeInsegne = document.getElementById('check_insegne').checked;
        var includePubblicita = document.getElementById('check_pubblicita').checked;

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

        if (idOggetto) {
            filteredData = filteredData.filter(item => item.ID_OGGETTO === idOggetto);
        }
        if (idUtente) {
            filteredData = filteredData.filter(item => item.IDUTENTE === idUtente);
        }
        if (ragioneSociale) {
            filteredData = filteredData.filter(item => item.RAGIONE_SOCIALE && item.RAGIONE_SOCIALE.includes(ragioneSociale));
        }
        if (pIva) {
            filteredData = filteredData.filter(item => item.P_IVA === pIva);
        }
        if (codF) {
            filteredData = filteredData.filter(item => item.COD_F === codF);
        }

        addMarkers(filteredData);
    }

    // Load data and apply filters initially
    applyFilters();

    // Attach event listeners to checkboxes and form fields
    document.getElementById('check_insegne').addEventListener('change', applyFilters);
    document.getElementById('check_pubblicita').addEventListener('change', applyFilters);
    document.getElementById('filter-idoggetto').addEventListener('input', applyFilters);
    document.getElementById('filter-idutente').addEventListener('input', applyFilters);
    document.getElementById('filter-ragione_sociale').addEventListener('input', applyFilters);
    document.getElementById('filter-p_iva').addEventListener('input', applyFilters);
    document.getElementById('filter-cod_f').addEventListener('input', applyFilters);
});

