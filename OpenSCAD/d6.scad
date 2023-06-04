r = .85;

module draw_cube(r) {
  translate([ 0, 0, r])
    cube(1, true);
}

difference() {
  sphere($fn = 100, d = 1);
  
  // Cut top and bottom first.
  for(i = [0:1]) {
    rotate(i * 180, [1, 0, 0])
      draw_cube(r);
  }
  
  // Cut the sides off next.
  for(i = [0:90:270]) {
    rotate(i, [0, 0, 1])
      rotate(90, [0, 1, 0])
        draw_cube(r);
  }
}

//draw_cube(1);
