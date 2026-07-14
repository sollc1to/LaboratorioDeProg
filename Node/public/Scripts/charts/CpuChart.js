// CpuChart.js - Versión con gráfico de líneas (ideal para muchos núcleos)
export function createCpuChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    // Asegurar dimensiones mínimas
    if (container.clientWidth === 0 || container.clientHeight === 0) {
        container.style.width = "100%";
        container.style.minHeight = "300px";
    }

    const opts = {
        title: "Uso de CPU por núcleo",
        width: Math.max(container.clientWidth, 600),
        height: 300,
        scales: {
            x: { time: false, range: [-0.5, 16] }, // antes era 15.5
            y: { range: [0, 100] }
        },
        axes: [
            {
                incrs: [1],
                space: 15,
                values: (u, vals) => vals.map(v => `C${v}`)
            },
            {
                values: (u, vals) => vals.map(v => v + "%")
            }
        ],
        series: [
            { label: "Nucleo " }, // eje X
            {
                label: "Uso (%)",
                stroke: "rgba(54, 162, 235, 1)",
                width: 2,
                fill: "rgba(54, 162, 235, 0.1)", // relleno suave
                points: { show: false }  // sin puntos para mejor rendimiento
            }
        ]
    };

    const dummyData = [[0], [0]];
    return new uPlot(opts, dummyData, container);
}

export function updateCpuChart(chart, cpuData) {
    if (!chart || !cpuData || !cpuData.usage) return;
    const usageNumbers = cpuData.usage.map(v => Number(v));
    const indices = usageNumbers.map((_, i) => i);
    chart.setData([indices, usageNumbers]);
}