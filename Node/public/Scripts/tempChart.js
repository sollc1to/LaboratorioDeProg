        let tempCanvas = document.getElementById("TempChart").getContext("2d");
        var tempChart = new Chart(tempCanvas, {
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

                    data: [45, 48, 52, 55, 58, 60]  // Temperatura promedio subiendo
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
                    },

                }
            }
        });

        setInterval(actualizarTemp, 2500);
        function actualizarTemp() {
            let currentData = tempChart.data.datasets[0].data;
            var index = 0;
            currentData.forEach(element => {
                if (index != currentData.length - 1) {
                    currentData[index] = currentData[index + 1];
                    index = index + 1;
                } else {
                    //estoy en la ultima posicion 
                    let lastTemp = currentData[currentData.length - 2];
                    let newTemp = lastTemp + (Math.random() - 0.5) * 15; //suma un poco de temperatura o baja
                    newTemp = Math.max(35, Math.min(75, newTemp));
                    currentData[currentData.length - 1] = newTemp;
                }

            });
            tempChart.update();

        }
        
