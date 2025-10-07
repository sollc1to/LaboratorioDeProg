
        let ramCanvas = document.getElementById("RamChart").getContext("2d");
        let ramChart = new Chart(ramCanvas, {
            type: "doughnut",
            data: {
                labels: ["En Uso", "Disponible", "Caché/Buffer"],
                datasets: [{
                    label: "Uso de RAM",
                    borderWidth: 2,
                    data: [65, 25, 10]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Memoria RAM',
                        font: { size: 16 }
                    },
                }
            }
        });

                setInterval(() => {
            let ramUsed = 60 + Math.floor(Math.random() * 20);
            let ramCache = 5 + Math.floor(Math.random() * 10);
            let ramFree = 100 - ramUsed - ramCache;

            ramChart.data.datasets[0].data = [ramUsed, ramFree, ramCache];
            ramChart.update();
        }, 1500);
