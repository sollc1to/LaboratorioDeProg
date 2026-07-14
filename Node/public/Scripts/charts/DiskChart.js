export function createDiskChart(containerId) {
    const container = document.getElementById(containerId);

    const opts = {
        title: "Uso del Disco Duro",
        width: 400,
        height: 300,
        scales: {
            x: { time: true },
            y: { range: [0, 100] }
        },
        series: [
            {}, // X Axis (Timestamps)
            {
                label: "Sistema (Uso)",
                stroke: "rgb(255, 159, 64)", // Soft Orange
                width: 2,
                fill: "rgba(255, 159, 64, 0.05)"
            },
            {
                label: "Espacio Libre",
                stroke: "rgb(75, 192, 192)", // Soft Teal
                width: 2,
                fill: "rgba(75, 192, 192, 0.05)"
            }
        ],
        axes: [
            {},
            { values: (u, vals) => vals.map(v => v + " %") }
        ]
    };

    // Initialize with 3 empty arrays: [Timestamps, System, Free]
    const data = [[], [], []];

    return new uPlot(opts, data, container);
}

export function updateDiskChart(chart, diskData) {
    // diskData format: { system: 20, free: 80 }
    const data = [...chart.data];
    const nowTimestamp = Math.floor(Date.now() / 1000);

    data[0].push(nowTimestamp);
    data[1].push(diskData.system);
    data[2].push(diskData.free);

    // Maintain a rolling history profile of 20 ticks
    if (data[0].length > 20) {
        data.forEach(arr => arr.shift());
    }

    chart.setData(data);
}