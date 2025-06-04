// Crear una variable global para el mapa y la configuración inicial
var map;
var configInicial = {
    center: [19.344796609, -99.238588729], // Coordenadas iniciales
    zoom: 14,
    baseLayer: null // Se guardará la capa base inicial
};

document.addEventListener("DOMContentLoaded", function () {
    if (typeof L === "undefined") {
        console.error("Leaflet no se ha cargado correctamente.");
        return;
    }

    // Inicializar el mapa
    map = L.map('map', {
        center: configInicial.center,
        zoom: configInicial.zoom,
        minZoom: 10,
        maxZoom: 23,
        zoomControl: false,
        tap: false
    });

    // Agregar capas base
    var satelital = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; OpenStreetMap contributors',
        minZoom: 10,
        maxZoom: 23
    }).addTo(map);

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        minZoom: 10,
        maxZoom: 19
    });

    var baseMaps = {
        "Mapa Satelital": satelital,
        "Mapa Street": street
    };

    configInicial.baseLayer = satelital;

    L.control.layers(baseMaps).addTo(map);

    // Agregar control de zoom en la esquina superior derecha
    L.control.zoom({ position: 'topright' }).addTo(map);

    console.log("Mapa inicializado correctamente.");

    // 🔹 **Agregar botón "Actualizar" con ícono de casita en gris**
    var reloadButton = L.control({ position: 'topright' });

    reloadButton.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.innerHTML = '<img src="img/icons/home-gray-icon.png" alt="Actualizar" style="width: 35px; cursor: pointer;">';
        div.style.backgroundColor = 'white';
        div.style.padding = '5px';
        div.style.borderRadius = '4px';
        div.style.marginTop = '5px';
        div.onclick = function () {
            location.reload(); // Recarga la página completamente
        };
        return div;
    };

    map.addControl(reloadButton);

    // 🔹 **Función para agregar la capa límite de la alcaldía**
    function agregarLimiteAlcaldia() {
        fetch("archivos/vectores/limite_alcaldia.geojson")
            .then(response => response.ok ? response.json() : Promise.reject("Error al cargar limite_alcaldia"))
            .then(data => {
                L.geoJSON(data, {
                    style: function () {
                        return {
                            color: "#BB1400",
                            weight: 2,
                            fillOpacity: 0
                        };
                    }
                }).addTo(map).bringToBack();
                console.log("Capa límite_alcaldía cargada correctamente.");
            })
            .catch(error => console.error("Error al cargar limite_alcaldia:", error));
    }

    // **Llamar la función para asegurar que la capa límite se carga tras la recarga**
    agregarLimiteAlcaldia();

    // 🔹 **Agregar imagen de simbología en la esquina inferior derecha**
    var simboloControl = L.control({ position: 'bottomright' });

    simboloControl.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'leaflet-control-symbol'); 
        div.innerHTML = '<img src="img/simbol/Simbologi.png" alt="Simbología" style="width: 150px;">'; 
        div.style.backgroundColor = 'white';
        div.style.padding = '5px';
        div.style.borderRadius = '4px';
        div.style.border = '1px solid #ccc';
        return div;
    };

    simboloControl.addTo(map);
});
