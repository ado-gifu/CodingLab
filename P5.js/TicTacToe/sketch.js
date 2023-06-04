// Global constants.
const CELL_SIZE = 60;

const BOARD_W = 9;
const BOARD_H = 9;

const STROKE_W = 5;

const PLAYER_1 = 1;
const PLAYER_2 = -1;

const WIN_SCORE = 3;

// Global state.
var grid = [];
var turn = 0;

var turn = PLAYER_1;
var gameOver = false;

var mainColor = 0;
var bgColor = 0;
var p1Color = 0;
var p2Color = 0;

// Logic.
function setup() {
  createCanvas(BOARD_W * CELL_SIZE, BOARD_H * CELL_SIZE);

  // Prepare the colors.
  mainColor = color(100, 100, 100);
  bgColor   = color(  0,   0,   0);
  p1Color   = color(  0,   0, 255);
  p2Color   = color(255,   0,   0);

  // Prepare the grid.
  for(var y = 0; y < BOARD_H; y++) {
    grid.push([]);

    for(var x = 0; x < BOARD_W; x++) {
      grid[y].push(0);
    }
  }
}

function drawX (posX, posY) {
  stroke(p1Color);

  var ul = [ posX +  CELL_SIZE / 4,      posY +  CELL_SIZE / 4];
  var ur = [ posX + (CELL_SIZE / 4) * 3, posY +  CELL_SIZE / 4];
  var dl = [ posX +  CELL_SIZE / 4,      posY + (CELL_SIZE / 4) * 3];
  var dr = [ posX + (CELL_SIZE / 4) * 3, posY + (CELL_SIZE / 4) * 3];

  line(ul[0], ul[1], dr[0], dr[1]);
  line(ur[0], ur[1], dl[0], dl[1]);
}

function drawO (posX, posY) {
  stroke(p2Color);
  fill(bgColor);

  var ul = [ posX +  CELL_SIZE / 2,      posY +  CELL_SIZE / 2];

  circle(ul[0], ul[1], CELL_SIZE / 2)
}

function drawLines() {
  stroke(mainColor);
  strokeWeight(STROKE_W);

  var boardWidthPx  = BOARD_W * CELL_SIZE;
  var boardHeightPx = BOARD_H * CELL_SIZE;

  // Vertical lines.
  for(var i = 0; i <= BOARD_W; i++) {
    var x = i * CELL_SIZE;

    line(x, 0, x, BOARD_H * CELL_SIZE);
  }

  // Horizontal lines.
  for(var i = 0; i <= BOARD_H; i++) {
    var y = i * CELL_SIZE;

    line(0, y, BOARD_W * CELL_SIZE, y);
  }
}

function drawAllMarked() {
  for(var y = 0; y < grid.length; y++) {
    for(var x = 0; x < grid[0].length; x++) {
      var val = grid[y][x];

      var posX = x * CELL_SIZE;
      var posY = y * CELL_SIZE;

      if(val == PLAYER_1)
        drawX(posX, posY);
      else if(val == PLAYER_2)
        drawO(posX, posY);
    }
  }
}

function draw() {
  background(bgColor);

  // Draw all graphics.
  drawLines();
  drawAllMarked();
}

// P5 callback function for responding to keyboard characters.
function keyPressed() {
  if(keyIsDown(65)) { // 'A', let AI decide on placement.
    runAI();
  }
  else if(keyCode === 73) { // 'I', initialize (reset) the board.
    run = false;
    //clearMap();
  }
}

// P5 callback function for responding to mouse presses.
function mousePressed() {
  // When a mouse is pressed, the only thing that can happen is
  // that a cell on the grid is changed to a player's marker.
  // Which one, depends on the turn.
  var x = 0;
  var y = 0;

  // Find the 'x' first.
  for(var i = 0; i < BOARD_W; i++) {
    if((mouseX >= i * CELL_SIZE) && (mouseX < (i+1) * CELL_SIZE)) {
      x = i;
      break;
    }
  }

  // Find the 'y' second.
  for(var i = 0; i < BOARD_H; i++) {
    if((mouseY >= i * CELL_SIZE) && (mouseY < (i+1) * CELL_SIZE)) {
      y = i;
      break;
    }
  }

  // Both found; insert the marker appropriate for the turn.
  var val = grid[y][x];

  if(!gameOver && val == 0) {
    grid[y][x] = turn; // Easy since turn represents the player.

    if(turn == PLAYER_1)
      turn = PLAYER_2;
    else
      turn = PLAYER_1;
  }

  // See if any player won.
  var winner = checkWin(grid);

  if(!gameOver && winner != 0) {
    gameOver = true;

    $("#win_label").html();
  }
}

function checkWin(inGrid) {
  // Returns 0 if no one wins.
  // Otherwise, returns the player who wins on given map.
  // The way it works this way is because this function is used
  // by both the win conditional (in this file) as well as the AIs.
  var curPlayer = 0;
  var curPoints = 0;

  function stepper(x, y, reset) {
    if(reset) {
      curPlayer = 0;
      curPoints = 0;

    } else {
      var val = inGrid[y][x];

      if(curPlayer == val) {
        curPoints++;

        if(curPoints == WIN_SCORE && curPlayer != 0) {
          return curPlayer;
        }
      } else {
        curPlayer = val;
        curPoints = 1;
      }
    }
  };

  // Check rows first.
  for(var y = 0; y < grid.length; y++) {
    for(var x = 0; x < grid[0].length; x++) {
      var res = stepper(x, y, false);

      if(res)
        return res; // Any non-0 will be returned.
    }

    stepper(0, 0, true);
  }

  // Check columns.
  for(var x = 0; x < grid[0].length; x++) {
    for(var y = 0; y < grid.length; y++) {
      var res = stepper(x, y, false);

      if(res)
        return res; // Any non-0 will be returned.
    }

    stepper(0, 0, true);
  }

  // Check left-right diagonals.

  // Check right-left diagonals.
}

// Runs the AI and places a circle or cross depending on the results
// of search & evaluation. Can be applied by either player by pressing 'A'.
function runAI() {

}
