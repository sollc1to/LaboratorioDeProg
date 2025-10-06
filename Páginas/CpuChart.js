 // Obtenemos el contexto 2D del elemento <canvas> con id="CpuChart"
        // Chart.js utiliza este contexto para poder dibujar el gráfico
        let miCanva = document.getElementById("CpuChart").getContext("2d");

        // Creamos una nueva instancia de Chart (librería Chart.js)
        var chart = new Chart(miCanva, {
            type: "bar", // tipo de gráfico: barras
            data: {
                // Etiquetas que se muestran en el eje X
                labels: ["cpuCore1", "cpuCore2", "cpuCore3", "cpuCore4"],

                // Conjunto de datos que se va a graficar
                datasets: [{
                    label: "Uso de los Núcleos del CPU",
                    backgroundColor: "black",            // color de las barras
                    data: [0, 1, 3, 5]                      // valores iniciales de cada núcleo
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,  // el eje Y comienza en 0
                        max: 100            // el eje Y llega hasta 100 (representando porcentaje)
                    }
                }
            }
        });

         // Función que devuelve un número entero aleatorio entre 0 y 99. Por ahora es solo para ver como funcionará el sitio web. 
        function randomValue() {
            return Math.floor(Math.random() * 100);
        }


          setInterval(() => {
            // Se generan nuevos valores aleatorios para los 4 núcleos
            chart.data.datasets[0].data = [
                randomValue(),
                randomValue(),
                randomValue(),
                randomValue()
            ];
            // Se actualiza/redibuja el gráfico con los nuevos valores
            chart.update();


        }, 2000);


