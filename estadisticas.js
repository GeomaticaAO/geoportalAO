// Función para mostrar estadísticas en una ventana modal de Bootstrap
function verEstadisticas(nombreColonia) {
    // Cargar el archivo GeoJSON con datos de todas las colonias
    fetch("archivos/vectores/colonias_wgs84_geojson_renombrado.geojson")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el archivo GeoJSON: " + response.statusText);
            }
            return response.json(); // Convertir la respuesta en objeto JSON
        })
        .then(data => {
            // Buscar la colonia por nombre dentro del GeoJSON
            let coloniaEncontrada = data.features.find(
                feature => feature.properties.COLONIA_UN.trim().toLowerCase() === nombreColonia.trim().toLowerCase()
            );

            // Si no se encuentra la colonia, mostrar mensaje y salir
            if (!coloniaEncontrada) {
                alert("No se encontraron estadísticas para la colonia seleccionada.");
                return;
            }

            // Acceder a las propiedades de la colonia
            let props = coloniaEncontrada.properties;

            // Actualizar el título del modal con el nombre de la colonia
            document.getElementById("estadisticasModalLabel").innerText = `Estadísticas de ${nombreColonia}`;

            // Construir la tabla con estadísticas básicas solo si el dato existe
            let rows = [];
            if (props.xPOBTOT !== undefined && props.xPOBTOT !== null) {
                rows.push(`<tr><td><strong>Población Total:</strong></td><td>${props.xPOBTOT}</td></tr>`);
            }
            if (props.xPEA !== undefined && props.xPEA !== null) {
                rows.push(`<tr><td><strong>Población Económicamente Activa Total:</strong></td><td>${props.xPEA}</td></tr>`);
            }
            if (props.x_60MAS !== undefined && props.x_60MAS !== null) {
                rows.push(`<tr><td><strong>Población 60 años y más Total:</strong></td><td>${props.x_60MAS}</td></tr>`);
            }
            if ((props.p_0A11 !== undefined && props.p_0A11 !== null) || (props.p_0A11 !== undefined && props.p_0A11 !== null)) {
                let poblacionInfantil = props.p_0A11 ?? props.p_0A11;
                rows.push(`<tr><td><strong>Población Infantil:</strong></td><td>${poblacionInfantil}</td></tr>`);
            }
            if (props.xTVIVHAB !== undefined && props.xTVIVHAB !== null) {
                rows.push(`<tr><td><strong>Total de Viviendas Particulares Habitadas:</strong></td><td>${props.xTVIVHAB}</td></tr>`);
            }
            let totalStats = `<table class="table table-bordered"><tbody>${rows.join("")}</tbody></table>`;
            document.getElementById("estadisticasInfo").innerHTML = totalStats;

            // Preparar los datos para el gráfico de pirámide poblacional incluyendo solo estadísticas disponibles
            let chartLabels = [];
            let chartDataMasculino = [];
            let chartDataFemenino = [];

            // Población Total
            if ((props.xPOBMAS !== undefined && props.POBMAS !== null) || (props.xPOBFEM !== undefined && props.xPOBFEM !== null)) {
                chartLabels.push("Población Total");
                chartDataMasculino.push( -(props.xPOBMAS ?? 0) );
                chartDataFemenino.push( props.xPOBFEM ?? 0 );
            }
            // Población Económicamente Activa
            if ((props.PEA_M !== undefined && props.xPEA_M !== null) || (props.xPEA_F !== undefined && props.xPEA_F !== null)) {
                chartLabels.push("Población Económicamente Activa");
                chartDataMasculino.push( -(props.xPEA_M ?? 0) );
                chartDataFemenino.push( props.xPEA_F ?? 0 );
            }
            // Población 60 años y más
            if ((props.x_60MAS_M !== undefined && props.x_60MAS_M !== null) || (props.x_60MAS_F !== undefined && props.x_60MAS_F !== null)) {
                chartLabels.push("Población 60 años y más");
                chartDataMasculino.push( -(props.x_60MAS_M ?? 0) );
                chartDataFemenino.push( props.x_60MAS_F ?? 0 );
            }

            // Si no hay datos para graficar, simplemente oculta el canvas; de lo contrario, muestra y grafica
            if (chartLabels.length === 0) {
                document.getElementById("estadisticasChart").style.display = "none";
            } else {
                document.getElementById("estadisticasChart").style.display = "block";
                // Obtener el contexto del canvas para dibujar el gráfico
                let ctx = document.getElementById("estadisticasChart").getContext("2d");

                // Destruir el gráfico anterior si existe
                if (window.estadisticasChart && typeof window.estadisticasChart.destroy === "function") {
                    window.estadisticasChart.destroy();
                }

                // Crear el gráfico tipo pirámide poblacional 
                window.estadisticasChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: chartLabels,
                        datasets: [
                            {
                                label: "Masculino",
                                data: chartDataMasculino,
                                backgroundColor: "rgba(54, 162, 235, 0.6)",
                                borderColor: "rgba(54, 162, 235, 1)",
                                borderWidth: 1
                            },
                            {
                                label: "Femenino",
                                data: chartDataFemenino,
                                backgroundColor: "rgba(255, 99, 132, 0.6)",
                                borderColor: "rgba(255, 99, 132, 1)",
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        indexAxis: 'y', // Hace el gráfico horizontal
                        responsive: true,
                        scales: {
                            x: {
                                stacked: true,
                                min: -Math.max(...chartDataMasculino.map(Math.abs)) * 1.2,
                                max: Math.max(...chartDataFemenino) * 1.2,
                                ticks: {
                                    callback: function(value) {
                                        // Redondea y muestra solo la parte entera
                                        return Math.abs(value).toFixed(0);
                                    }
                                }
                            },
                            y: {
                                stacked: true
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        // Redondea el valor en el tooltip
                                        return `${tooltipItem.dataset.label}: ${Math.abs(tooltipItem.raw).toFixed(0)}`;
                                    }
                                }
                            }
                        }
                    }
                });

            }

            // Mostrar el modal de Bootstrap con la información cargada
            let estadisticasModal = new bootstrap.Modal(document.getElementById("estadisticasModal"));
            estadisticasModal.show();
        })
        .catch(error => console.error("Error al cargar estadísticas:", error));
}

window.verEstadisticas = verEstadisticas;
