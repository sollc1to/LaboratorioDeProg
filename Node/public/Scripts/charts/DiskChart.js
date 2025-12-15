export function createDiskChart(ctx) {
    return new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Sistema", "Espacio Libre"],
            datasets: [{
                label: "Uso de Disco",
                borderWidth: 2,
                borderColor: "#fff",
                data: [], // se llena al actualizar
                backgroundColor: [
                    "rgba(255, 159, 64, 0.7)",   // Naranja pastel para Sistema
                    "rgba(75, 192, 192, 0.7)"    // Verde agua pastel para Libre
                ],
                hoverBackgroundColor: [
                    "rgba(255, 159, 64, 0.9)",   // Naranja más intenso al hover
                    "rgba(75, 192, 192, 0.9)"    // Verde más intenso al hover
                ]
            }]
        },
        options: {
            responsive: true,
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
                    text: 'Uso del Disco Duro',
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

export function updateDiskChart(chart, diskData) {
    // diskData: { system: 20, free: 80 }
    
    chart.data.datasets[0].data = [
        diskData.system,
        diskData.free
    ];

    chart.update();
}