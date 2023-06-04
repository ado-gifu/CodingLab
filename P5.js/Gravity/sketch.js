// Global constants.
const OUTER_PX = 10;
const DIV_PX = 1;

const CELL_PX = 10;

const CNVS_WIDTH = 800;
const CNVS_HEIGHT = 600;

const X_CENTER = CNVS_WIDTH / 2;
const Y_CENTER = CNVS_HEIGHT / 2;

const PLANET_DENSITY = .05 // Unit of mass per unit of length squared.
                              // All planets are massive circles, not spheres.
                              // In this case, 1 unit of mass per area of circle
                              // of diameter 10 units of length.
const G = 1;

// Global variables.
var bgColor;

var run;

var planets;

// Logic.
// Setup the entire simulation.
function setup() {
    bgColor     = color(127, 127, 127);

    createCanvas(CNVS_WIDTH, CNVS_HEIGHT);

    noStroke();
    planets = [];

    // Add some test planets.
    addPlanet(100, [   0,     0], [ 0, 0], color(255,   0,   0));
    addPlanet(  1, [ 100,     0], [ 0, 1], color(  0, 255,   0));
    addPlanet( 20, [-200, - 200], [ .45, 0], color(  0,   0, 255));

    // Prevent from running.
    run = false;

    frameRate(60); // Incidentally, also dictates the speed of physics.
                   // Each frame represents a unit of time.
                   // So, the delta of time is 1 u_t between frames.
}

// Draw all cells, but toggle their states (if necessary) before drawing.
function draw() {
    // Perform the logic of living.
    if(run)
        doPhysics();

    // Clear the context and draw the ball.
    background(bgColor);

    // Draw cells.
    for(var i = 0; i < planets.length; i++) {
        var planet = planets[i];
        var pos = planet.pos;

        fill(planet.color);

        var diam = getPlanetsDiameter( planet );

        var x_true = pos[0] + X_CENTER;
        var y_true = pos[1] + Y_CENTER;

        circle(x_true, y_true, diam);
    }
}

// Change the living state of cells based on their neighborhood.
function doPhysics() {
    // Calculate forces and accelerations.
    for(var i = 0; i < planets.length; i++) {
        for(var j = (i + 1); j < planets.length; j++) {
            var dist = getInterplanetDistance( planets[i], planets[j] );
            var force = (G * planets[i].mass * planets[j].mass) / (dist * dist);

            var a_i = force / planets[i].mass; // Accel. acting on i'th planet.
            var a_j = force / planets[j].mass; // Accel. acting on j'th planet.

            var u_i = getInterplanetUnitVector(planets[i], planets[j]);
            planets[i].acc[0] += u_i[0] * a_i;
            planets[i].acc[1] += u_i[1] * a_i;

            var u_j = [ -u_i[0], -u_i[1] ];
            planets[j].acc[0] += u_j[0] * a_j;
            planets[j].acc[1] += u_j[1] * a_j;
        }
    }

    // Advance all positions and reset all accelerations.
    // Each frame represents a unit of time, so multiplication by delta of time
    // is implicit. In other words, only addition is required.
    for(var i = 0; i < planets.length; i++) {

        var p = planets[i];

        p.vel[0] += p.acc[0];
        p.vel[1] += p.acc[1];

        p.pos[0] += p.vel[0];
        p.pos[1] += p.vel[1];

        planets[i].acc = [0, 0];
    }

    // Check for intersections to merge planets.
    // Rember to calculate midpoints and proper momenta.
}

function getInterplanetDistance(p0, p1) {
    // Between p0 and p1.
    var sum_x = p1.pos[0] - p0.pos[0];
    var sum_y = p1.pos[1] - p0.pos[1];

    var dist = Math.sqrt(sum_x * sum_x + sum_y * sum_y);

    return dist;
}

function getInterplanetUnitVector(p0, p1) {
    // From p0 to p1.
    var dist = getInterplanetDistance(p0, p1);

    var unit = [0, 0];

    unit[0] = (p1.pos[0] - p0.pos[0]) / dist;
    unit[1] = (p1.pos[1] - p0.pos[1]) / dist;

    return unit;
}

function getPlanetsDiameter(planet) {
    var mass = planet.mass;

    return 2 * Math.sqrt(mass / (3.14 * PLANET_DENSITY));
}

// Examine the inputs and cause changes.
function keyPressed() {
    if(keyCode === 82) { // 'R'
        run = !run;
    }
    else if(keyCode === 73) { // 'I'
        clearPlanets();
    }
    else if(keyCode === 71) { // 'G'

    }
}

function addPlanet(mass, pos, vel, color) {
    var planet = {}

    planet.mass = mass;
    planet.pos = pos;
    planet.vel = vel;
    planet.acc = [0, 0];
    planet.color = color;

    planets.push(planet);
}

// Clears the entire map of cells by changing their states to inactive.
function clearPlanets() {
    planets = [];
}

function mousePressed() {

}

// Change to target state from a click if mouse is dragged.
function mouseDragged() {

}
