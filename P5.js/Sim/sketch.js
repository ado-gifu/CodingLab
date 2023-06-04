// Global constants.
const CANVAS_W = 400;
const CANVAS_H = 400;

const CIRCLE_D = 20;
const LINE_W = 5;

const NUM_OF_CIRCLES = 6; // Though will be adjustable to any number.
const RAD_FROM_CENTER = 150;

const BG_COLOR = [0, 0, 0];

// Global state.
var circles = [];
var paths = [];

var x_center = CANVAS_W / 2;
var y_center = CANVAS_H / 2;

var color_active_1 = [0, 255, 0];
var color_active_2 = [255, 0, 0];

var color_inactive = [127, 127, 127];

// Logic.
function setup() {
    // Prepare some of the global values.
    createCanvas(CANVAS_W, CANVAS_H);

    angleMode(DEGREES);

    background(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2]);

    // Generate circles next.
    for(i = 0; i < NUM_OF_CIRCLES; i++) {
        // Let's start with the circles and their positions.
        var angle = (360 / NUM_OF_CIRCLES) * i;

        var x = cos(angle) * RAD_FROM_CENTER;
        var y = sin(angle) * RAD_FROM_CENTER;

        var cir = {};

        cir.x_pos = x_center + x - (CIRCLE_D / 2);
        cir.y_pos = y_center + y - (CIRCLE_D / 2);

        circles.push(cir);
    }

    // Prepare a list of all paths.
    paths = getPaths();
}

function getPaths() {
    // Each path extends from circle to circle.
    // Thus, circle indices are used for end points.
    var paths = [];

    for(i = 0; i < NUM_OF_CIRCLES; i++) {
        for(j = i + 1; j < NUM_OF_CIRCLES; j++) {
            var path = {};

            path.s = i;
            path.e = j;

            path.color = color_inactive;

            paths.push(path);
        }
    }

    return paths;
}

function draw() {
    // Draw all graphics.
    drawGraphics();

    // Start coloring lines if mouse clicks the right spot.
    checkKeys();
}

function drawGraphics() {
    // Clear the background and draw the ball.
    clear();
    background(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2]);

    drawPaths();

    drawCircles();
}

function drawPaths() {
    strokeWeight(3);

    for(i = 0; i < paths.length; i++) {
        var path = paths[i];

        var cir_s = circles[path.s];
        var cir_e = circles[path.e];

        stroke(path.color[0], path.color[1], path.color[2]);
        line(cir_s.x_pos, cir_s.y_pos, cir_e.x_pos, cir_e.y_pos);
    }
}

function drawCircles() {
    strokeWeight(5);

    for(i = 0; i < circles.length; i++) {
        var cir = circles[i];

        fill(255, 255, 255);
        stroke(color_inactive[0], color_inactive[1], color_inactive[2]);

        circle(cir.x_pos, cir.y_pos, CIRCLE_D);
    }
}

function checkKeys() {
    // Change direction movement based on which key is pressed.

}
