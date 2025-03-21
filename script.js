let left = false, right = false;

const car = document.getElementById("car");
let carPos = 0;
let carVel = 0;
let carAccel = 0;
let maxDist = window.innerWidth * 0.8;
let maxVel = maxDist / (10/3);
let maxAccel = 4 * maxDist / 10; // 4m/s^2
let maxDataPoints = 200;

let lastUpdate = Date.now();
let now = Date.now();
let dt = now - lastUpdate;

let startTime = Date.now();
let steps = 0;

function simulation() {
    steps++;

    now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;

    if (left) {
        carAccel = -maxAccel;
    } else if (right) {
        carAccel = maxAccel;
    }

    let nextVel = carVel + carAccel * (dt / 1000);
    // clamp velocity to maxVel
    if (nextVel <= -maxVel) {
        carVel = -maxVel;
        carAccel = 0;
    } else if (nextVel >= maxVel) {
        carVel = maxVel;
        carAccel = 0;
    } else {
        carVel = nextVel;
    }

    let nextPos = carPos + carVel * (dt / 1000);

    if (nextPos < 0) {
        carPos = 0;
        carVel = 0; // UPDATE THIS TO BE PHYSICALLY CORRECT
        carAccel = 0;
    } else if (nextPos > maxDist) {
        carPos = maxDist;
        carVel = 0; // UPDATE THIS TO BE PHYSICALLY CORRECT
        carAccel = 0;
    } else {
        carPos = nextPos;
    }

    car.style.setProperty("left", `calc(10% - 50px + ${carPos}px)`);

    if (carVel > 0) {
        car.style.setProperty("-webkit-transform", "scaleX(1)");
        car.style.setProperty("transform", "scaleX(1)");
    } else if (carVel < 0) {
        car.style.setProperty("-webkit-transform", "scaleX(-1)");
        car.style.setProperty("transform", "scaleX(-1)");
    }

    updatePosChart();
    updateVelChart();
    updateAccelChart();
}

document.getElementById("left").addEventListener("mousedown", () => {
    left = true;
});
document.getElementById("left").addEventListener("mouseup", () => {
    left = false;
    carAccel = 0;
});

document.getElementById("right").addEventListener("mousedown", () => {
    right = true;
});
document.getElementById("right").addEventListener("mouseup", () => {
    right = false;
    carAccel = 0;
});

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            left = true;
            break;
        case "ArrowRight":
            right = true;
            break;
        case " ":
            toggleSim(document.getElementById("stopButton"));
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            left = false;
            carAccel = 0;
            break;
        case "ArrowRight":
            right = false;
            carAccel = 0;
            break;
    }
});


const posCtx = document.getElementById("posChart").getContext("2d");
const posChart = new Chart(posCtx, {
    type: "line",
    data: {
        labels: new Array(maxDataPoints).fill(0), // x-axis labels will be elapsed time in seconds
        datasets: [{
            label: "Position (m)",
            data: new Array(maxDataPoints).fill(0),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.1)",
            borderWidth: 2,
            // Remove point markers for better performance with many points
            pointRadius: 0,
            pointHitRadius: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // disable animations for performance
        plugins: {
            // Enable decimation to improve performance with large datasets
            decimation: {
                enabled: true,
                algorithm: "lttb",
                samples: 100
            },
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                // Using a category scale since we use elapsed seconds as labels
                display: true,
                title: {
                    display: true,
                    text: "Elapsed Time (s)"
                },
                ticks: {
                    // Reduce the number of labels displayed
                    maxTicksLimit: 10,
                    stepSize: 1
                }
            },
            y: {
                min: 0,
                max: 10,
                display: true,
                title: {
                    display: true,
                    text: "Position (m)"
                },
                beginAtZero: true
            }
        }
    }
});

const velCtx = document.getElementById("velChart").getContext("2d");
const velChart = new Chart(velCtx, {
    type: "line",
    data: {
        labels: new Array(maxDataPoints).fill(0), // x-axis labels will be elapsed time in seconds
        datasets: [{
            label: "Velocity (m/s)",
            data: new Array(maxDataPoints).fill(0),
            borderColor: "rgb(33, 173, 75)",
            backgroundColor: "rgba(54, 235, 63, 0.1)",
            borderWidth: 2,
            // Remove point markers for better performance with many points
            pointRadius: 0,
            pointHitRadius: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // disable animations for performance
        plugins: {
            // Enable decimation to improve performance with large datasets
            decimation: {
                enabled: true,
                algorithm: "lttb",
                samples: 100
            },
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                // Using a category scale since we use elapsed seconds as labels
                display: true,
                title: {
                    display: true,
                    text: "Elapsed Time (s)"
                },
                ticks: {
                    // Reduce the number of labels displayed
                    maxTicksLimit: 10,
                    stepSize: 1
                }
            },
            y: {
                min: -4,
                max: 4,
                display: true,
                title: {
                    display: true,
                    text: "Velocity (m/s)"
                },
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    lineWidth: (ctx) => (ctx.tick.value === 0 ? 3 : 1), // Thicker line at y=0
                    color: (ctx) => (ctx.tick.value === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.3)'), // Make y=0 stand out
                },
            }
        }
    }
});

const accelCtx = document.getElementById("accelChart").getContext("2d");
const accelChart = new Chart(accelCtx, {
    type: "line",
    data: {
        labels: new Array(maxDataPoints).fill(0), // x-axis labels will be elapsed time in seconds
        datasets: [{
            label: "Acceleration (m/s^2)",
            data: new Array(maxDataPoints).fill(0),
            borderColor: "rgb(235, 60, 54)",
            backgroundColor: "rgba(235, 54, 54, 0.1)",
            borderWidth: 2,
            // Remove point markers for better performance with many points
            pointRadius: 0,
            pointHitRadius: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // disable animations for performance
        plugins: {
            // Enable decimation to improve performance with large datasets
            decimation: {
                enabled: true,
                algorithm: "lttb",
                samples: 100
            },
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                // Using a category scale since we use elapsed seconds as labels
                display: true,
                title: {
                    display: true,
                    text: "Elapsed Time (s)"
                },
                ticks: {
                    // Reduce the number of labels displayed
                    maxTicksLimit: 10,
                    stepSize: 1
                }
            },
            y: {
                min: -6,
                max: 6,
                display: true,
                title: {
                    display: true,
                    text: "Acceleration (m/s^2)"
                },
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    lineWidth: (ctx) => (ctx.tick.value === 0 ? 3 : 1), // Thicker line at y=0
                    color: (ctx) => (ctx.tick.value === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.3)'), // Make y=0 stand out
                },
            }
        }
    }
});

function updatePosChart() {
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

    // Append new data to the chart
    posChart.data.labels.push(elapsedSeconds);
    posChart.data.datasets[0].data.push(carPos / maxDist * 10);

    // Limit the number of data points to prevent memory issues
    if (posChart.data.labels.length > maxDataPoints) {
        posChart.data.labels.shift();
        posChart.data.datasets[0].data.shift();
    }

    // Update the chart without animation
    posChart.update("none");
}

function updateVelChart() {
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

    // Append new data to the chart
    velChart.data.labels.push(elapsedSeconds);
    velChart.data.datasets[0].data.push(carVel / maxDist * 10);

    // Limit the number of data points to prevent memory issues
    while (velChart.data.labels.length > maxDataPoints) {
        velChart.data.labels.shift();
        velChart.data.datasets[0].data.shift();
    }

    // Update the chart without animation
    velChart.update("none");
}

function updateAccelChart() {
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

    // Append new data to the chart
    accelChart.data.labels.push(elapsedSeconds);
    accelChart.data.datasets[0].data.push(carAccel / maxDist * 10);

    // Limit the number of data points to prevent memory issues
    while (accelChart.data.labels.length > maxDataPoints) {
        accelChart.data.labels.shift();
        accelChart.data.datasets[0].data.shift();
    }

    // Update the chart without animation
    accelChart.update("none");
}

let running = true;
let runSim = setInterval(simulation, 1000 / 30);

function toggleSim(e) {
    if (running) {
        running = false;
        e.textContent = "Start Simulation";
        clearInterval(runSim);
    } else {
        running = true;
        e.textContent = "Stop Simulation";
        lastUpdate = Date.now();
        now = Date.now();
        dt = now - lastUpdate;
        startTime = Date.now();
        runSim = setInterval(simulation, 1000 / 30);
    }
}

function resetSim() {
    carPos = 0;
    carVel = 0;
    carAccel = 0;

    lastUpdate = Date.now();
    now = Date.now();
    dt = now - lastUpdate;

    startTime = Date.now();
    steps = 0;

    posChart.data.datasets[0].data = new Array(maxDataPoints).fill(0);
    posChart.update("none");
    velChart.data.datasets[0].data = new Array(maxDataPoints).fill(0);
    velChart.update("none");
    accelChart.data.datasets[0].data = new Array(maxDataPoints).fill(0);
    accelChart.update("none");
    if (!running) {
        toggleSim(document.getElementById("stopButton"));
    }
}

function increaseScale() {
    maxDataPoints += 50;
}

function decreaseScale() {
    maxDataPoints -= 50;
}
