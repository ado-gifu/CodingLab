// Status: not completed.

r = .85;
m = 6;
a = 45;

module draw_cube(r) {
  translate([ 0, 0, r])
    cube(1, true);
}

module draw_sphere() {
  sphere($fn = 200, d = 1, center=true);
}

module diff_objects() {
  for(i = [0:m])
    rotate(i * (360/m), [0, 0, 1]) {
      rotate(a, [0, 1, 0])
        draw_cube(r);
      if(m % 2) {
      rotate(360/(2*m), [0, 0, 1])
        rotate(180-a, [0, 1, 0])
          draw_cube(r);
      } else {
        rotate(180-a, [0, 1, 0])
          draw_cube(r);
      }
    }
}

difference() {
  draw_sphere();
  
  diff_objects();
}

//draw_cube(1);
//diff_objects();
