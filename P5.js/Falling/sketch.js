// Global constants.
const CANVAS_W = 400;
const CANVAS_H = 400;

const BALL_W = 40;
const BALL_H = 40;

const SPEED = 2.5;

// Global state.
var x_pos = CANVAS_W / 2; // Position of the ball.
var y_pos = CANVAS_H / 2;

var v_dir = 1; // Directions of the ball.
var h_dir = 1;

// Logic.
function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
}

function draw() {
    // Draw all graphics.
    drawGraphics();

    // Advance the positon.
    advancePosition();

    // Change horizontal direction at boundary.
    checkHoriBoundaries();

    // Change vertical direction at boundary.
    checkVertBoundaries();

    // Change directions on key presses.
    checkKeys();
}

function drawGraphics() {
    // Clear the background and draw the ball.

    background(220);
    ellipse(x_pos, y_pos, BALL_W, BALL_H);
}

function advancePosition() {
    // Advance the position of the ball based set directions.

    x_pos = x_pos + h_dir * SPEED;
    y_pos = y_pos + v_dir * SPEED;
}

function checkKeys() {
    // Change direction movement based on which key is pressed.

    if(keyIsDown(65)) { // 'a', left.
        h_dir = -1;
    } else if (keyIsDown(68)) { // 'd', right.
        h_dir = 1;
    } else if (keyIsDown(87)) { // 'w', up.
        v_dir = -1;
    } else if (keyIsDown(83)) { // 's', down.
        v_dir = 1;
    }
}

function checkHoriBoundaries() {
    // If the ball intersects either of the vertical boundaries,
    // reverse its movement.

    if(x_pos >= (CANVAS_W - BALL_W/2))
        h_dir = -1;
    else if (x_pos <= BALL_W/2)
        h_dir = 1;
}

function checkVertBoundaries() {
    // If the ball intersects either of the horizontal boundaries,
    // reverse its movement.

    if(y_pos >= (CANVAS_H - BALL_W/2))
        v_dir = -1;
    else if (y_pos <= BALL_W/2)
        v_dir = 1;
}
