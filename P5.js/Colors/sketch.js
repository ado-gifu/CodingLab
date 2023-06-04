// Global constants.
const CELL_SIZE = 18;

// Logic.
// Setup the entire simulation.
function setup() {
  createCanvas(42 * CELL_SIZE, 24 * CELL_SIZE);

  noStroke();
}

function drawLuminance(pos, r, g, b) {
  for(l = 0; l < 32; l++) {
    let red   = (r * 255 * l) / 31;
    let green = (g * 255 * l) / 31;
    let blue  = (b * 255 * l) / 31;

    let c  = color(red, green, blue);

    fill(c);
    square(l * CELL_SIZE, pos * CELL_SIZE, CELL_SIZE)
  }
}

// Draws all colors.
function draw() {
  // Each two bits in a color byte are dedicated to a different color fields.
  // As such, a single byte consists of the following four fields:
  //
  // (brightness, red, green, blue)
  //
  // Each of these fields can have a value between 0-3, inclusive.
  // Together, there are 256 possible combinations.

  background(0);

  // Draw 2-2-2 table.
  for(r = 0; r < 4; r++)
    for(g = 0; g < 4; g++)
      for(b = 0; b < 4; b++) {
        var xOffset = (CELL_SIZE * g) + (4 * CELL_SIZE * (r % 2));
        var yOffset = (CELL_SIZE * b) + (4 * CELL_SIZE * (r < 2 ? 0: 1));

        var red   = 85 * r;
        var green = 85 * g;
        var blue  = 85 * b;

        let c = color(red, green, blue);

        fill(c);
        square( xOffset, yOffset, CELL_SIZE);
      }

  // Draw the 2-3-3 table. Red has less, because it's somewhat less
  // significant naturally. Consider: a lot of terrestial animals miss a
  // red cone in their eyes.
  for(r = 0; r < 4; r++)
    for(g = 0; g < 8; g++)
      for(b = 0; b < 8; b++) {
        var offset  = (CELL_SIZE * 9);
        var xOffset = offset + (CELL_SIZE * g) + (8 * CELL_SIZE * (r % 2));
        var yOffset = (CELL_SIZE * b) + (8 * CELL_SIZE * (r < 2 ? 0: 1));

        var red   = 85 * r;
        var green = 36 * g;
        var blue  = 36 * b;

        // One way to achieve gray is to consider "r=0" to be a certain mode.
        // Then, if colors match, gray can be produced.
        // NOTE: this way, two valid white values can be produced.
        //       One of them may thus be used as a "transparent" color in games.
        //
        let c =
          (r == 0 && g == b && g < 7)  ?
            color(green, green, green):
            color(  red, green,  blue);

        fill(c);
        square( xOffset, yOffset, CELL_SIZE);
      }

  // 3-3-2 this time.
  for(r = 0; r < 8; r++)
    for(g = 0; g < 8; g++)
      for(b = 0; b < 4; b++) {
        var offset  = (CELL_SIZE * 26);
        var xOffset = offset + (CELL_SIZE * r) + (8 * CELL_SIZE * (b % 2));
        var yOffset = (CELL_SIZE * g) + (8 * CELL_SIZE * (b < 2 ? 0: 1));

        var red   = 36 * r;
        var green = 36 * g;
        var blue  = 85 * b;

        // One way to achieve gray is to consider "r=0" to be a certain mode.
        // Then, if colors match, gray can be produced.
        // NOTE: this way, two valid white values can be produced.
        //       One of them may thus be used as a "transparent" color in games.
        //
        let c =
          (b == 0 && r == g && r < 7)  ?
            color(green, green, green):
            color(  red, green,  blue);

        fill(c);
        square( xOffset, yOffset, CELL_SIZE);
      }

  // 7 primary + luminance.
  drawLuminance(17, 1, 0, 0);
  drawLuminance(18, 0, 1, 0);
  drawLuminance(19, 0, 0, 1);
  drawLuminance(20, 1, 1, 0);
  drawLuminance(21, 0, 1, 1);
  drawLuminance(22, 1, 0, 1);
  drawLuminance(23, 1, 1, 1);
}
