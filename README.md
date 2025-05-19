# Triple Graphs - Interactive Physics Simulation

This is a physics simulation written in HTML/CSS/JS, using [Chart.js](https://www.chartjs.org) for displaying the graphs. It is based on the [Moving Man PhET Simulation](https://phet.colorado.edu/sims/cheerpj/moving-man/latest/moving-man.html?simulation=moving-man), and has some improvements in order to make the graphs more readable and accessible to students.

![image](https://github.com/user-attachments/assets/14e5462f-dfa3-4e4d-8c21-3b2a160d4262)
*Try out the [interactive simulation](https://icemaster-eric.github.io/Triple-Graphs/)*

## The Math

The user can only affect the **acceleration** of the car. The **velocity** is calculated based on the current acceleration of the car and $\Delta t$ (time passed), and the **position** is calculated based on the current **velocity**, **acceleration** and $\Delta t$.

| Velocity Equation | Position Equation |
| --- | --- |
| $v=v_{0}+at$ | $x=x_{0}+v_{0}t+\frac{1}{2}at^{2}$ |

## The Code

I opted to use vanilla HTML/CSS/JS in order to ensure maximum compatibility across all devices, as well as making it easily accessible by simply visiting a website. For the graphs, I used [Chart.js](https://www.chartjs.org), as it offers flexible, lightweight charts, which suits my usecase of rendering hundreds of data points in real-time. The graphs show the relationships between the position, velocity and acceleration of the car.

```js
// The following code is a simplified version of the logic for the simulation.
// Note that these calculations are based on screen pixels rather than actual meters.
function simulation() { // This function is run at 30fps - 30 times per second.
    steps++;

    now = Date.now();
    dt = now - lastUpdate; // dt (delta-time) is equal to the time elapsed since the last frame
    lastUpdate = now;

    // Determine the car's acceleration based on user input
    if (left) {
        carAccel = -maxAccel;
    } else if (right) {
        carAccel = maxAccel;
    }

    // Simplified equation assuming constant acceleration
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

    // Calculate the car's next position
    let nextPos = carPos + carVel * (dt / 1000);

    // Move the car on-screen
    car.style.setProperty("left", `calc(10% - 50px + ${carPos}px)`);

    // Determine the car's direction
    if (carVel > 0) {
        car.style.setProperty("-webkit-transform", "scaleX(1)");
        car.style.setProperty("transform", "scaleX(1)");
    } else if (carVel < 0) {
        car.style.setProperty("-webkit-transform", "scaleX(-1)");
        car.style.setProperty("transform", "scaleX(-1)");
    }

    // Update the 3 graphs
    updatePosChart();
    updateVelChart();
    updateAccelChart();
}
```

### Comparison to Phet Simulation

| This Simulation | Phet Simulation |
| --- | --- |
| ![image](https://github.com/user-attachments/assets/14e5462f-dfa3-4e4d-8c21-3b2a160d4262) | ![image](https://github.com/user-attachments/assets/53043ffa-fdfc-432e-ab06-5e7fafaadfea) |
| The graphs in this simulation are clear and easy to understand, while retaining the interactive aspect. | The Phet Simulation's graphs are jagged and chaotic, making it difficult to understand the movement of the object, and how it relates to the velocity and acceleration. |

###### Note that certain details such as the car movement are based more on game development fundamentals rather than exact physics equations. While this will still provide numbers that are accurate to the original velocity and position equations, it makes the code simpler and more efficient. For example, the calculations are not based on meters, but pixels instead. The number of pixels per "meter" shown on screen will vary depending on the screen size. Ultimately, this interactive physics simulation is focused on providing graphs that allow students to easily understand the relationship between an object's position, velocity and acceleration.
