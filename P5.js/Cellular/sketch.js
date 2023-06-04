// Global constants.
const OUTER_PX = 10;
const DIV_PX = 1;

const CELL_PX = 10;

const HORI_NUM = 50;
const VERT_NUM = 50;

// Global variables.
var bgColor;
var deadColor;
var livingColor;

var cellMap;

var run;

var savedTargetState;

// Logic.
// Standard interface for getting colors from input fields.
// Abstraction is an important concept.
function getColor(id) {
  var num_rgx = /[0-9]+/gm;
  var ret_val = color(0, 0, 0);
  var str = $(`#${id}`).val();

  vals = str.match(num_rgx);

  if(vals && vals.length == 3) { // If not null, basically.
    vals = vals.map(v => parseInt(v));

    ret_val = color(vals[0], vals[1], vals[2]);
  }

  return ret_val;
}

// Setup colors and framerate.
function initColorsFps() {
  bgColor     = getColor("input_bg_color");
  deadColor   = getColor("input_dead_color");
  livingColor = getColor("input_living_color");

  var num_rgx = /[0-9]+/gm;
  fpsVals = $("#input_fps").val().match(num_rgx);

  if(fpsVals) {
    frameRate(parseInt(fpsVals[0]));
  }
}

// Setup the entire simulation.
function setup() {
  // Setup the variables.
  run = false;

  var width  = (2 * OUTER_PX) + HORI_NUM * CELL_PX + (HORI_NUM - 1) * DIV_PX;
  var height = (2 * OUTER_PX) + VERT_NUM * CELL_PX + (VERT_NUM - 1) * DIV_PX;

  createCanvas(width, height);

  noStroke();
  cellMap = [];

  mouseState = false;

  initColorsFps();

  // Prepare the map.
  for(var y = 0; y < VERT_NUM; y++) {
    cellMap.push([]); // Add a row at the end.

    for(var x = 0; x < HORI_NUM; x++) {
      var cell = { alive: false, willLive: false};

      cellMap[y].push(cell);
    }
  }
}

function updateRunningInfo() {
  var infoEl = $("#running_info");

  if(run) {
    infoEl.html("RUNNING");
    infoEl.css("background-color", "red");
  } else {
    infoEl.html("STOPPED");
    infoEl.css("background-color", "green");
  }
}

// Draws all cells, but toggles their states (if necessary) before drawing.
function draw() {
  // Update the framerate and colors speed.
  initColorsFps();
  updateRunningInfo()

  // Perform the logic of living.
  if(run)
    makeAlive();

  // Clear the context and draw the ball.
  background(bgColor);

  // Draw cells.
  for(var y = 0; y < VERT_NUM; y++) {
    for(var x = 0; x < HORI_NUM; x++) {

      if(cellMap[y][x].alive)
        fill(livingColor);
      else
        fill(deadColor);

      var startPixelsX = startPosPx(x);
      var startPixelsY = startPosPx(y);

      rect(startPixelsX, startPixelsY, CELL_PX, CELL_PX);
    }
  }
}

// Checks if a cell at coords. (x, y) is alive.
function isAlive(x, y) {
  var alive = false;

  if((x >= 0 && x < HORI_NUM) && (y >= 0 && y < VERT_NUM)) {
    alive = cellMap[y][x].alive;
  }

  return alive;
}

// Change the living state of cells based on their neighborhood.
function makeAlive() {
  // Update the numbers for survival and birth first.
  var num_rgx = /[0-9]/gm;

  var num_survival_str = $("#input_num_survival").val();
  var num_birth_str = $("#input_num_birth").val();

  var sur_nums = num_survival_str.match(num_rgx);
  var bir_nums = num_birth_str.match(num_rgx);

  // If the array variables are null, fill them with default values.
  if( sur_nums ) {
    sur_nums = sur_nums.map(str => parseInt(str, 10));
  } else {
    sur_nums = [2, 3];
  }

  if( bir_nums ) {
    bir_nums = bir_nums.map(str => parseInt(str, 10));
  } else {
    bir_nums = [3];
  }

  // The loop looks for cells that will live in the next step.
  for(var y = 0; y < VERT_NUM; y++) {
    for(var x = 0; x < HORI_NUM; x++) {
      var neighbors = 0;

      if(isAlive( x - 1, y - 1)) neighbors += 1;
      if(isAlive( x - 1, y  )) neighbors += 1;
      if(isAlive( x - 1, y + 1)) neighbors += 1;

      if(isAlive( x, y - 1)) neighbors += 1;
      if(isAlive( x, y + 1)) neighbors += 1;

      if(isAlive( x + 1, y - 1)) neighbors += 1;
      if(isAlive( x + 1, y  )) neighbors += 1;
      if(isAlive( x + 1, y + 1)) neighbors += 1;

      // Check survival first.
      if(cellMap[y][x].alive) {
        if( sur_nums.includes( neighbors ) )
          cellMap[y][x].willLive = true;
      }
      // Check birth next.
      else {
        if( bir_nums.includes( neighbors ) )
          cellMap[y][x].willLive = true;
      }
    }
  }

  // Moves the value from "will live" to "alive".
  for(var y = 0; y < VERT_NUM; y++) {
    for(var x = 0; x < HORI_NUM; x++) {
      cellMap[y][x].alive = cellMap[y][x].willLive;
      cellMap[y][x].willLive = false;
    }
  }
}

// Examines the inputs and performs appropriate actions.
function keyPressed() {
  if(keyCode === 82) { // 'R'
    run = !run;
  }
  else if (keyCode === 83) { // 'S'
    run = false;
    makeAlive();
  }
  else if(keyCode === 73) { // 'I'
    run = false;
    clearMap();
  }
  else if(keyCode === 71) { // 'G'
    randomizeCells();
  }
}

// Calculates the start position of a cell, in pixels, based on given coordinate.
// Used in both dimensions.
function startPosPx(x) {
  return OUTER_PX + (x * CELL_PX) + (x * DIV_PX);
}

// Calculates the coordinate of a cell based on mouse coordinate and number of
// cells in a row/column.
function findCellCoord(mouseCoord, cellNum) {
  var result = -1;

  for(var x = 0; x < cellNum; x++) {
    var xStart = startPosPx(x);

    if(mouseCoord >= xStart && mouseCoord <= (xStart + CELL_PX)) {
      result = x;
      break;
    }
  }

  return result;
}

// Called if the user clicks anywhere within the viewing rectangle.
function mousePressed() {
  var xCell = findCellCoord(mouseX, HORI_NUM);
  var yCell = findCellCoord(mouseY, VERT_NUM);

  // If cell found, keep the cell's current state for dragging movements
  // and change its state to the opposite.
  if(xCell != -1 && yCell != -1) {
    savedTargetState = !cellMap[yCell][xCell].alive;

    cellMap[yCell][xCell].alive = savedTargetState;
  }
}

// Clears the entire map of cells by changing their states to inactive.
function clearMap() {
  for(var y = 0; y < VERT_NUM; y++) {
    for(var x = 0; x < HORI_NUM; x++) {
      cellMap[y][x].alive = false;
      cellMap[y][x].willLive = false;
    }
  }
}

// Activates cells in the map if random number is larger than a threshold.
function randomizeCells() {
  for(var y = 0; y < VERT_NUM; y++) {
    for(var x = 0; x < HORI_NUM; x++) {
      if(Math.random() < .75) {
        cellMap[y][x].alive = false;
        cellMap[y][x].willLive = false;
      }
      else {
        cellMap[y][x].alive = true;
        cellMap[y][x].willLive = true;
      }
    }
  }
}

// If mouse is dragged, changes the states of cells to the target state
// saved from the initial click. This way, the user can cut through large structures
// by clicking on one of the living cells and dragging across them.
function mouseDragged() {
  var xCell = findCellCoord(mouseX, HORI_NUM);
  var yCell = findCellCoord(mouseY, VERT_NUM);

  if(xCell != -1 && yCell != -1) {
    cellMap[yCell][xCell].alive = savedTargetState;
  }
}
