# Triple Graphs

This is a physics simulation written in vanilla html/css/js. It is based on the [Moving Man PhET Simulation](https://phet.colorado.edu/sims/cheerpj/moving-man/latest/moving-man.html?simulation=moving-man), and has some improvements in order to make the graphs more readable and more accessible to students.

Some of the changes include:
- Changed the draggable man to a car that moves left and right.
- Both the keyboard left/right arrows can be used, as well as clickable left/right buttons on-screen.
- Rather than changing the position of the car, the acceleration is affected instead.

The car has a maximum velocity of 2m/s, at which the car will no longer accelerate. Friction has not been implemented, so it is assumed that friction forces are negligible due to the car being on ice.

There are certain shortcomings that have not been addressed/implemented in the simulation. When the car bumps into the edges of the simulation, velocity and acceleration are simply set to zero, instead of applying an impulse to the car's momentum in order to stop it. There may also be slight inaccuracies in the graphs occasionally if processor load is too high.

Try out the interactive simulation at https://thatonepythondev.github.io/Triple-Graphs/