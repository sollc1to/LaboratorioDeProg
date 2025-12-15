export function createCpuChart (ctx){
        // Creamos una nueva instancia de Chart (librería Chart.js)
        return new Chart(ctx, {
            type: "bar", // tipo de gráfico: barras
            data: {
                // Etiquetas que se muestran en el eje X
                labels: [],

                // Conjunto de datos que se va a graficar
                datasets: [{
                    label: "Uso de los Núcleos del CPU",
                                // color de las barras
                    data: [],
                    backgroundColor: []                      // valores iniciales de cada núcleo
                }]
            },
            options: {plugins : {
                tooltip:{
                    callbacks:{
                        label: function(context){return 'Uso del CPU: '+ context.parsed.y+' % ';}
                    }
                }
                , title:{display: true , text: 'Distribución de la CPU', font : {size  : 16}} 
            },
                scales: {
                    y: {
                        beginAtZero: true,  // el eje Y comienza en 0
                        max: 100            // el eje Y llega hasta 100 (representando porcentaje)
                    }
                },
               
            }
        });
    }

    export function updateCpuChart(chart, cpuData) {
    // cpuData 
    // { cores: ["0", "1", "2"], usage: [20, 35, 50] }

    chart.data.labels = cpuData.cores;
    chart.data.datasets[0].data = cpuData.usage;

  
    chart.data.datasets[0].backgroundColor = cpuData.usage.map(u => {
        if (u < 50) return "rgba(54, 162, 235, 0.7)";
        if (u < 80) return "rgba(255, 206, 86, 0.7)";
        return "rgba(255, 99, 132, 0.7)";
    });

    chart.update();
}

