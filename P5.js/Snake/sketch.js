// Global constants.
const HORI_NUM = 60;
const VERT_NUM = 40;

const LEFT  = [-1,  0];
const RIGHT = [ 1,  0];

const UP    = [ 0, -1];
const DOWN  = [ 0,  1];

const WALL_ID = 'x';
const EMPTY_ID = ' ';

// Global variables.
var cell_map;

var run = false;

var savedTargetState;

var dir = [0, 0];

var wall_img;

// Logic.
// Load all images and prepare the map.
function preload() {
    wall_img = loadImage('assets/wall.png');
}

// Setup the entire simulation.
function setup() {
    // Setup the variables.
    var width  = HORI_NUM * 16;
    var height = VERT_NUM * 16;

    createCanvas(width, height);

    cell_map = [];

    frameRate(5);

    // Prepare the map.
    for(var y = 0; y < VERT_NUM; y++) {
        cell_map.push([]); // Add a row at the end.

        for(var x = 0; x < HORI_NUM; x++) {
            if(y == 0) {
                cell_map[y].push(WALL_ID);
            } else if (y == (VERT_NUM - 1)) {
                cell_map[y].push(WALL_ID);
            } else {
                // Place wall when x is 0 or last.
                if(x == 0) {
                    cell_map[y].push(WALL_ID);
                } else if (x == (HORI_NUM - 1)) {
                    cell_map[y].push(WALL_ID);
                } else {
                    cell_map[y].push(EMPTY_ID);
                }
            }
        }
    }
}

// Draw all cells, but toggle their states (if necessary) before drawing.
function draw() {
    // Perform the logic of living.
    if(run) {
        move();
    }

    // Clear the context and draw the ball.
    background(0, 0, 0);

    // Draw cells.
    for(var y = 0; y < VERT_NUM; y++) {
        for(var x = 0; x < HORI_NUM; x++) {

            var x_px = x * 16;
            var y_px = y * 16;
            var id = cell_map[y][x];

            if(id == WALL_ID) {
                image(wall_img, x_px, y_px);
            }
        }
    }
}

function move() {

}

// Randomize direction when the game starts.
function randomizeDir () {
    var rand_num = Math.random();

    if(rand_num < .25) {
        dir = UP;
    } else if(rand_num < .50) {
        dir = DOWN;
    } else if(rand_num < .75) {
        dir = LEFT;
    } else {
        dir = RIGHT;
    }
}

// Examine the inputs and cause changes.
function keyPressed() {
    if(keyCode === 87) { // 'W'
        dir = UP;
    }
    else if (keyCode === 83) { // 'S'
        dir = DOWN;
    }
    else if(keyCode === 65) { // 'A'
        dir = LEFT;
    }
    else if(keyCode === 68) { // 'D'
        dir = RIGHT;
    }
    else if(keyCode === 32) { // Space to start the game.
        randomizeDir();
        run = true;
    }
}
