s = 2;
p = 0.20;

module draw_cube() {
  translate([ 0, 0, s - s*p])
    cube(s, true);
}

difference() {
  sphere($fn = 100, d = s);
  
  // Cut the top and bottom first.
  for(i = [0:1]) {
    rotate(i * 180, [1, 0, 0])
      draw_cube();
  }
  
  // Cut the sides off next.
  for(i = [0:90:270]) {
    rotate(i, [0, 0, 1])
      rotate(90, [0, 1, 0])
        draw_cube();
  }
  
  // Cut the corners off.
  for(j = [0:1])
    for(i = [0:3])
      rotate(j*180, [0, 1, 0])
        rotate(45+i*90, [0, 0, 1])
          rotate(54, [0, 1, 0])
            draw_cube();
}

//draw_cube();