function applyFilters() {
    var searchRagioneSociale = document.getElementById('search_ragione_sociale').value.toLowerCase();
    var searchVia = document.getElementById('search_via').value.toLowerCase();

    markerCluster.clearLayers(); // Clear all markers from the cluster group

    allMarkers.forEach(function (markerData) {
        if (markerData.item['RAGIONE_SOCIALE'].toLowerCase().includes(searchRagioneSociale) &&
            markerData.item['VIA /STRADA /PIAZZA'].toLowerCase().includes(searchVia)) {
            markerCluster.addLayer(markerData.marker); // Re-add only filtered markers
        }
    });
}
