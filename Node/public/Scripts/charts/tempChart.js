export function createTempChart(ctx) {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: ["-5min", "-4min", "-3min", "-2min", "-1min", "Ahora"],
            datasets: [{
                label: "Temperatura CPU (°C)",
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 3,
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                fill: true,
                data: []  // valores se actualizarán luego
            }]
        },

        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 30,
                    max: 90,
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Temperatura del CPU',
                    font: { size: 16 }
                }
            }
        }
    });
}

export function updateTempChart(chart, newTemp) {
    // newTemp un numero

    // Mantener siempre 6 puntos 
    const data = chart.data.datasets[0].data;

    // Agregar nuevo valor
    data.push(newTemp);

    // Si supera los 6 valores, eliminar el más viejo
    if (data.length > 6) {
        data.shift();
    }

    chart.update();
}