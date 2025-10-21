
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
        plugins: {tooltip:{
                    callbacks:{
                        label: function(context){return 'Uso del disco,  '+ context.parsed+' % ';}
                    }
                },
            title: {
                display: true,
                text: 'Uso del Disco Duro',
                font: { size: 16 }
            }
        }
    }
});

setInterval(() => {
    let diskChange = (Math.floor((Math.random()-0.5) * 20)) + 20;
    let espacioSistema =   diskChange;
    
    let espacioArchivos=  diskChange;
    let espacioAplicaciones=  diskChange ;
    let espacioDisponible= 100- (espacioAplicaciones+espacioArchivos+espacioSistema);

    diskChart.data.datasets[0].data = [
         espacioSistema,
        espacioArchivos,
        espacioAplicaciones,
        espacioDisponible
    ];
    diskChart.update();
}, 2500);