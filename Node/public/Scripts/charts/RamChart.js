export function createRamChart(containerId) {
    const container = document.getElementById(containerId);

    const opts = {
        title: "Historial de Memoria RAM",
        width: 400,
        height: 300,
        scales: {
            x: { time: true },
            y: { range: [0, 100] } // Percentages from 0% to 100%
        },
        series: [
            {}, // X Axis (Timestamps)
            {
                label: "En Uso",
                stroke: "rgb(255, 99, 132)", // Soft Red
                width: 2,
            },
            {
                label: "Disponible",
                stroke: "rgb(54, 162, 235)", // Soft Blue
                width: 2,
            },
            {
                label: "Caché/Buffer",
                stroke: "rgb(255, 205, 86)", // Soft Yellow
                width: 2,
            }
        ],
        axes: [
            {},
            { values: (u, vals) => vals.map(v => v + " %") }
        ]
    };

    // Initialize with 4 empty arrays: [Timestamps, Used, Free, Cache]
    const data = [[], [], [], []];

    return new uPlot(opts, data, container);
}

export function updateRamChart(chart, ramData) {
    // ramData format: { used: 40, free: 50, cache: 10 }
    const data = [...chart.data];
    const nowTimestamp = Math.floor(Date.now() / 1000);

    // Push new values to each respective line series array
    data[0].push(nowTimestamp);
    data[1].push(ramData.used);
    data[2].push(ramData.free);
    data[3].push(ramData.cache);

    // Keep the chart looking clean by rolling off records past 20 items
    if (data[0].length > 20) {
        data.forEach(arr => arr.shift());
    }

    chart.setData(data);
}