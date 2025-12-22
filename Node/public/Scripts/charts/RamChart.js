export function createRamChart(ctx) {
    return new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["En Uso", "Disponible", "Caché/Buffer"],
            datasets: [{
                label: "Uso de RAM",
                borderWidth: 2,
                borderColor: "#fff",
                data: [],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.7)",   // Rojo pastel para En Uso
                    "rgba(54, 162, 235, 0.7)",   // Azul pastel para Disponible
                    "rgba(255, 205, 86, 0.7)"    // Amarillo pastel para Caché
                ],
                hoverBackgroundColor: [
                    "rgba(255, 99, 132, 0.9)",   // Rojo más intenso al hover
                    "rgba(54, 162, 235, 0.9)",   // Azul más intenso al hover
                    "rgba(255, 205, 86, 0.9)"    // Amarillo más intenso al hover
                ]
            }]
        },
        options: {
            responsive: true,
            cutout: '60%', // Para el efecto doughnut
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Distribución de Memoria RAM',
                    font: { size: 16 }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

export function updateRamChart(chart, ramData) {
    // ramData: { used: 40, free: 50, cache: 10 }
    
    chart.data.datasets[0].data = [
        ramData.used,
        ramData.free,
        ramData.cache
    ];

    chart.update();
}