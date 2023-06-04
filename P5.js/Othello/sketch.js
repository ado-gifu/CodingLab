// Global constants.
const CELL_SIZE = 60;

const BOARD_W = 8;
const BOARD_H = 8;

const STROKE_W = 5;

const PLAYER_1 = 1;
const PLAYER_2 = -1;

const SEARCH_D = 7;

// Global state.
var mainBoard = [];
var turn = 0;

var turn = PLAYER_1;
var gameOver = false;

var mainColor  = 0;
var bgColor    = 0;
var p1Color    = 0;
var p2Color    = 0;
var legalColor = 0;

var legals = [];

var showLegal = true;

var latestPos = null;

// Logic.
function genGrid() {
  var newGrid = [];

  for(var y = 0; y < BOARD_H; y++) {
    newGrid.push([]);

    for(var x = 0; x < BOARD_W; x++) {
      newGrid[y].push(0);
    }
  }

  return newGrid;
}

// P5's callback function for setting everything up.
function setup() {
  createCanvas(BOARD_W * CELL_SIZE, BOARD_H * CELL_SIZE);

  // Prepare the colors.
  mainColor  = color(   0,   0,   0);
  bgColor    = color(   0, 160,   0);
  p1Color    = color(   0,   0,   0);
  p2Color    = color( 255, 255, 255);
  legalColor = color( 100, 255, 100);

  // Prepare the main board.
  mainBoard = genGrid();

  mainBoard[(BOARD_W / 2) - 1][(BOARD_H / 2) - 1] = PLAYER_1;
  mainBoard[(BOARD_W / 2)    ][(BOARD_H / 2) - 1] = PLAYER_2;
  mainBoard[(BOARD_W / 2) - 1][(BOARD_H / 2)    ] = PLAYER_2;
  mainBoard[(BOARD_W / 2)    ][(BOARD_H / 2)    ] = PLAYER_1;

  // Don't forget to generate initial legal positions.
  legals = generateLegals(turn, mainBoard);

  $('#indicator').html( getTurnText(turn) );
}

// Draws a mark.
function drawO (x, y, color, mag = 1.0) {
  var posX = x * CELL_SIZE;
  var posY = y * CELL_SIZE;

  stroke(color);
  fill(color);

  var ul = [ posX +  CELL_SIZE / 2, posY +  CELL_SIZE / 2];

  circle(ul[0], ul[1], ((CELL_SIZE * 3) / 5) * mag)
}

// Changes other marks to player's side.
function drawLines() {
  stroke(mainColor);
  strokeWeight(STROKE_W);

  var boardWidthPx  = (BOARD_W + 2) * CELL_SIZE;
  var boardHeightPx = (BOARD_H + 2) * CELL_SIZE;

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

// Draw all marked spots.
function drawAllMarked() {
  for(var y = 0; y < mainBoard.length; y++) {
    for(var x = 0; x < mainBoard[0].length; x++) {
      var val = mainBoard[y][x];

      if(val == PLAYER_1)
        drawO(x, y, p1Color)
      else if(val == PLAYER_2)
        drawO(x, y, p2Color);
    }
  }
}

// Highlights the latest mark for easier visibility.
function drawLatestHighlight() {
  if(latestPos) {
    drawO(latestPos[0], latestPos[1], color(255, 150, 0), mag = 1.3)
  }
}

// Draws all legal movements on the board.
function drawLegals() {
  for(var i = 0; i < legals.length; i++) {
    drawO(legals[i][0], legals[i][1], legalColor, 0.25);
  }
}

// Generate all legal positions for given player and grid.
function generateLegals(p, grid) {
  // First, match all positions of the current player.
  marks = [];

  for(var y = 0; y < grid.length; y++) {
    for(var x = 0; x < grid[0].length; x++) {
      if(grid[y][x] == turn)
        marks.push([x, y]);
    }
  }

  // The next step is to generate all legal positions based on
  // selected marks.
  var legals = [];

  for(var i = 0; i < marks.length; i++) {
    var x = marks[i][0];
    var y = marks[i][1];

    for(var xDir = -1; xDir <= 1; xDir++)
      for(var yDir = -1; yDir <= 1; yDir++)
        if(!(xDir == 0 && yDir == 0)) {
          var coords = scanDir(p, grid, false, x, y, xDir, yDir);

          if(coords)
            insertLegal(legals, coords);
        }
  }

  return legals;
}

// Only inserts a legal move into given array if no duplicates found.
function insertLegal(a, l) {
  var isDup = false;

  for(var i = 0; i < a.length; i++) {
    var v = a[i];

    if(a[i][0] == l[0] && a[i][1] == l[1]) {
      isDup = true;
      break;
    }
  }

  if(!isDup)
    a.push(l);
}

// Returns the coords of the legal move.
function scanDir(p, g, crossed, xPos, yPos, xDir, yDir) {
  // The starting point is a player's mark.
  // If no legal move, return 'null'.
  var nextX = xPos + xDir;
  var nextY = yPos + yDir;

  var result = null;

  if(!coordsAreValid(nextX, nextY))
    result = null;
  else {
    // Do the logic for empty cells first.
    var nextV = g[nextY][nextX];

    if(nextV == 0) {
      // Empty field... decide whether legal.
      if(crossed)
        result = [nextX, nextY];
      else
        result =  null;
    }
    else if(nextV == p) {
      // Cell is player's.
      if(crossed)
        // Because crossed over opposing player's cells to reach own type.
        result = null;
      else
        result = scanDir(p, g, false, nextX, nextY, xDir, yDir);
    }
    else {
      // Cell of the enemy player.
      result = scanDir(p, g, true, nextX, nextY, xDir, yDir);
    }
  }

  return result;
}

// Draw everything.
function draw() {
  background(bgColor);

  // Draw all graphics.
  drawLines();
  drawLatestHighlight();
  drawAllMarked();
  drawLegals();
}

// P5 callback function for responding to keyboard characters.
function keyPressed() {
  if(keyIsDown(65)) { // 'A', let AI decide on placement.
    runAI(turn, turn, mainBoard);
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

  // Both coords found; proceed with game logic.
  gameLogic(x, y);
}

// As suggested, counts the scores for the given grid 'g'.
// Not necessarily used by the main function.
function countScores(g) {
  var scoreP1 = 0;
  var scoreP2 = 0;

  for(var y = 0; y < g.length ; y++)
    for(var x = 0; x < g[0].length; x++)
      if(g[y][x] == PLAYER_1)
        scoreP1 += 1;
      else if(g[y][x] == PLAYER_2)
        scoreP2 += 1;

  return [scoreP1, scoreP2];
}

// Copies the values from the given grid 'g' to a new one.
function copyGrid(g) {
  var newGrid = [];

  for(var y = 0; y < g.length ; y++) {
    var row = []

    for(var x = 0; x < g[0].length; x++)
      row.push(g[y][x]);

    newGrid.push(row);
  }

  return newGrid;
}

// Generates the indication for a player's turn.
function getTurnText(p) {
  return p == PLAYER_1 ?
         "Black player's turn." :
         "White player's turn." ;
}

// Generates the winning text to be shown in the indicator.
function getWinText(scores) {
  var winText = "Tie";

  if(scores[0] > scores[1])
    winText = "Black player has won.";
  else if(scores[1] > scores[0])
    winText = "White player has won.";

  return winText;
}

// Performs game logic - inserts a mark and decides what to do.
function gameLogic(x, y) {
  var legal = false;

  for(var i = 0; i < legals.length; i++) {
    if(legals[i][0] == x && legals[i][1] == y) {

      legal = true;
      break;
    }
  }

  // Player selected a legal spot.
  // Proceed with game logic.
  if(legal) {
    latestPos = [x, y];
    placeMark(turn, mainBoard, x, y);

    turn = -turn; // Switch to the other player. Easy due to mathematics, hah.

    var legalsP1   = generateLegals(PLAYER_1, mainBoard);
    var legalsP2   = generateLegals(PLAYER_2, mainBoard);

    var legalsTurn = turn == PLAYER_1 ? legalsP1 : legalsP2;

    if((legalsP1.length == 0) && (legalsP2.length == 0)) {
      // Neither player can move, so game over.
      legals = [];

      $('#indicator').html( getWinText( countScores(mainBoard) ) );
    }
    else if(legalsTurn.length != 0) {
      legals = legalsTurn;

      $('#indicator').html( getTurnText(turn) );
    }
    else {
      turn = -turn; // Go back to the previous player.

      legalsTurn = turn == PLAYER_1 ? legalsP1 : legalsP2;

      legals = legalsTurn;

      $('#indicator').html( getTurnText(turn) );
    }
  }
}

// Make sure the given coords are on the board. NOT PIXELS.
function coordsAreValid(x, y) {
  var condA = (y >= 0 && y < BOARD_H);
  var condB = (x >= 0 && x < BOARD_W);

  return condA && condB;
}

// Place a player's mark on the given grid and replace stones as appropriate.
function placeMark(p, g, x, y) {
  g[y][x] = p;

  for(var xDir = -1; xDir <= 1; xDir++)
    for(var yDir = -1; yDir <= 1; yDir++)
      if(!(xDir == 0 && yDir == 0)) { // Ignore the center.
        var nextX = x + xDir;
        var nextY = y + yDir;

        colorLine(p, g, nextX, nextY, xDir, yDir);
      }
}

// Changes the marks of the opponent to player's.
function colorLine(p, g, x, y, xDir, yDir) {
  if(coordsAreValid(x, y)) {
    var v = g[y][x];

    if(v == p) // Reached player's stone. Permission to recolor.
      return true;
    else if (v == 0)
      return false; // Reached an empty cell. No permission.
    else {
      var nextX = x + xDir;
      var nextY = y + yDir;

      var canColor = colorLine(p, g, nextX, nextY, xDir, yDir);

      if(canColor) {
        g[y][x] = p;
        return canColor;
      }
    }
  }
}

// Runs the AI and places a mark based on the results of search & evaluation.
// Can be applied by either player by pressing 'A'.
// Currently, gets to depth specified within the code and compares paths
// that arrive at the best score at maximum depth.
// Nothing crazy, but it's probably not the strongest AI possible.
function runAI(player, turn, grid, n = 0) {
  var maxScore = -1;
  var maxPos   = [0, 0];

  // Determine the best score possible and position.
  if(n == SEARCH_D) {
    // Time to count the scores for the caller.
    var scores = countScores(grid);

    // Return only the score of the player.
    maxScore = player == PLAYER_1 ? scores[0]: scores[1];
  }
  else {
    // Basically, test each placement out and keep drilling down.
    var legals = generateLegals(turn, grid)

    if(legals.length == 0) {
      // Can't do much, but keep drilling.
      maxScore = runAI(player, turn, grid, n + 1)
    }
    else {
      for(var i = 0; i < legals.length; i++) {
        var tempGrid = copyGrid(grid);
        var pos = legals[i];
        var x = pos[0];
        var y = pos[1];

        placeMark(turn, tempGrid, x, y);

        var score = runAI(player, -turn, tempGrid, n + 1);

        if(score > maxScore) {
          maxScore = score;
          maxPos = pos;
        }
      }

      result = maxScore;
    }
  }

  // Back to the root of the call stack.
  // Time to mark a point.
  if(n == 0) {
    var x = maxPos[0];
    var y = maxPos[1];

    gameLogic(x, y); // Point determined - go with the main game flow.
  }

  return maxScore;
}
