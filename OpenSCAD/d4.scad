// Status: not completed.

r = 1;

module draw_cube(r) {
  translate([ 0, 0, r])
    cube(1, true);
}

module draw_sphere() {
  sphere($fn = 100, d = 1, center=true);
}

module diff_objects() {
  // Cut the bottom off first.
  rotate(180, [1, 0, 0])
    draw_cube(r);
  
  // Next, the sides on the top.
  for(i = [0:120:240])
  //for(i = [0:180:180])
    rotate(i, [0, 0, 1])
      rotate(70, [0, 1, 0])
        draw_cube(r);
}

difference() {
  draw_sphere();
  
  diff_objects();
}

//draw_cube(1);
//diff_objects();
