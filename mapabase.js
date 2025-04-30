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
        center: [19.344796609, -99.238588729], // Coordenadas iniciales
        zoom: 14,
        minZoom: 10,
        maxZoom: 23,
        zoomControl: false,
        tap: false
    });

    // Capa base satelital
    var satelital = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; OpenStreetMap contributors',
        minZoom: 10,
        maxZoom: 23
    }).addTo(map);

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

    // Agregar control de zoom personalizado en la esquina superior derecha
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    console.log("Mapa inicializado correctamente, listo para capas adicionales.");

    /** =====================================
     * Agregar límite de la alcaldía con contorno rojo y sin relleno
     * ==================================== */

    function agregarLimiteAlcaldia() {
        fetch("archivos/vectores/limite_alcaldia.geojson")
            .then(response => response.ok ? response.json() : Promise.reject("Error al cargar limite_alcaldia"))
            .then(data => {
                L.geoJSON(data, {
                    style: function () {
                        return {
                            color: "#BB1400", // Contorno rojo
                            weight: 2, // Grosor del borde
                            fillOpacity: 0 // Sin relleno
                        };
                    }
                }).addTo(map).bringToBack(); // Enviar la capa al fondo
                console.log("Capa límite_alcaldía cargada correctamente.");
            })
            .catch(error => console.error("Error al cargar limite_alcaldia:", error));
    }

    // Llamar a la función para agregar la capa límite de la alcaldía
    agregarLimiteAlcaldia();

    /** =====================================
     * Agregar botón de simbología IDS_AO
     * ==================================== */
    var legendControl = L.Control.extend({
        options: { position: "bottomright" },
        onAdd: function () {
            var div = L.DomUtil.create("div", "legend-container");
            div.innerHTML = `
                <div class="legend">
                    <img src="img/simbol/Simbologia.png" alt="Simbología" style="width: 150px; height: auto;">
                </div>`;
            return div;
        },
    });

    // Agregar la leyenda al mapa
    map.addControl(new legendControl());
});
