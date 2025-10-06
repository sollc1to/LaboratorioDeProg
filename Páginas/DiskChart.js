
        let diskCanvas = document.getElementById("DiskChart").getContext("2d");
        let diskChart = new Chart(diskCanvas, {
            type: "pie",
            data: {
                labels: ["Sistema", "Archivos", "Aplicaciones", "Espacio Libre"],
                datasets: [{
                    label: "Uso de Disco",
                    borderWidth: 2,
                    data: [15, 45, 25, 15]  // Valores promedio
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Uso del Disco Duro',
                        font: { size: 16 }
                    }
                }
            }
        });

        setInterval(() => {
            let diskChange = (Math.random() - 0.5) * 20;
            diskChart.data.datasets[0].data = [
                30 + diskChange,
                45 - diskChange,
                25,
                15
            ];
            diskChart.update();
        }, 2500);