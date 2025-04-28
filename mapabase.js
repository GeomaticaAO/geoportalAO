// Crear una variable global para el mapa (será usada en otros scripts)
var map;

document.addEventListener("DOMContentLoaded", function () {
    // Verifica si la librería Leaflet está disponible
    if (typeof L === "undefined") {
        console.error("Leaflet no se ha cargado correctamente.");
        return;
    }

    // Inicializa el mapa centrado en una ubicación específica 
    map = L.map('map', {
        center: [19.344796609, -99.238588729], // Coordenadas iniciales del centro del mapa
        zoom: 14,              // Nivel de zoom inicial
        minZoom: 10,           // Nivel mínimo de zoom permitido
        maxZoom: 23,           // Nivel máximo de zoom permitido
        zoomControl: false,    // Desactiva el control de zoom predeterminado 
        tap: false             // Desactiva eventos táctiles 
    });

    // Capa base satelital
    var satelital = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; OpenStreetMap contributors',
        minZoom: 10,
        maxZoom: 23
    }).addTo(map); // Agregar capa satelital al mapa

    // Capa base Street
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        minZoom: 10,
        maxZoom: 19
    });

    // Agregar control de capas para cambiar entre satelital y Street
    var baseMaps = {
        "Mapa Satelital": satelital,
        "Mapa Street": street
    };
    L.control.layers(baseMaps).addTo(map);

    // Agrega el control de zoom personalizado en la esquina superior derecha
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Mensaje en consola para confirmar que el mapa está listo
    console.log("Mapa inicializado correctamente, listo para capas adicionales.");

    /** =====================================
     * Agregar botón de simbología IDS_AO
     * ==================================== */

    var legendControl = L.Control.extend({
        options: { position: "bottomright" },
        onAdd: function () {
            var div = L.DomUtil.create("div", "legend-container");
            div.innerHTML = `
                <div class="legend">
                    <img src="img/simbol/Simbologi.png" alt="Simbología" style="width: 150px; height: auto;">
                </div>`;
            return div;
        },
    });

    // Agregar la leyenda al mapa
    map.addControl(new legendControl());
});
