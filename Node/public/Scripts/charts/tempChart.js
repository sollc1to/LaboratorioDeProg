export function createTempChart(containerId) {
    const container = document.getElementById(containerId);

    const opts = {
        title: "Temperatura del CPU",
        width: 400,
        height: 300,
        scales: {
            x: { time: true },
            y: { range: [30, 90] }
        },
        series: [
            {}, // The X axis (timestamps)
            {
                label: "Temperatura CPU (°C)",
                stroke: "rgb(255, 99, 132)",
                width: 3,
                fill: "rgba(255, 99, 132, 0.1)",
            }
        ],
        axes: [
            {},
            { values: (u, vals) => vals.map(v => v + " °C") }
        ]
    };

    // Initial empty data arrays: [ Timestamps, Values ]
    const data = [[], []];

    return new uPlot(opts, data, container);
}

export function updateTempChart(chart, newTemp) {
    // Clone current data arrays
    const data = [...chart.data];

    const nowTimestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

    data[0].push(nowTimestamp);
    data[1].push(newTemp);

    // Keep only the last 20 records so the timeline moves smoothly
    if (data[0].length > 20) {
        data[0].shift();
        data[1].shift();
    }

    // Tells uPlot to redraw with the new structural data array
    chart.setData(data);
}