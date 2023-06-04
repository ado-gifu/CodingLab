r = .82;

difference() {
  sphere($fn = 100, d = 1);

  translate([ r, 0, 0])
    cube(1, true);

  translate([-r, 0, 0])
    cube(1, true);

  translate([0,  r, 0])
    cube(1, true);

  translate([0, -r, 0])
    cube(1, true);

  translate([0, 0,  r])
    cube(1, true);

  translate([0, 0, -r])
    cube(1, true);
}
