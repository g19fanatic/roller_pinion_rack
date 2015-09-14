//all units are in mm

//user modifications
pinion_radius = 50;
pinion_num_teeth = 8;
pinion_tooth_radius = 8;
pinion_base_height = 10;
pinion_tooth_height = 10;

rack_height = 30;
rack_length = 314.159 / 2;  //ends finish nicely if its a pow2 divisor of the pinion circumference
rack_tooth_percent = .65;    //percentage of rack bar that gets teeth cut into it

//constants
pi = 3.14159265359;
rack_resolution = 1;       //angle step taken when moving the pinion across the rack for cutting

//calculated
rack_thickness = pinion_tooth_height - 0.1;
pinion_circumference = 2 * pi * pinion_radius;
rotate_step_length = rack_resolution * pi / 180 * pinion_radius;
num_steps = 360.0 / rack_resolution;
rotations_per_rack = round(rack_length / pinion_circumference);
steps_per_rack = round(rack_length / rotate_step_length);

module pinion()
{
    union()
    {
        //create the base 
        cylinder(h=pinion_base_height, r=pinion_radius, center=true);
        
        //create the teeth
        for (i = [0:pinion_num_teeth-1])
        {
            //translate each one into place
            translate([cos(i * (360/pinion_num_teeth)) * (pinion_radius - pinion_tooth_radius),
                       sin(i * (360/pinion_num_teeth)) * (pinion_radius - pinion_tooth_radius),
                       pinion_base_height / 2 + pinion_tooth_height / 2])
            //create each tooth with a little bit of extra height
            //this height gets removed in the union
            cylinder(h=pinion_tooth_height + .1, r=pinion_tooth_radius, center=true);
        }
    }
}

module rack()
{
    difference()
    {
        //create the blank rack and move it into position
        translate([0,-pinion_radius - rack_height/2 + rack_tooth_percent * rack_height, pinion_base_height + 0.05])
        cube([rack_length, rack_height, rack_thickness],center=true);
        
        for (i = [0:rack_resolution:steps_per_rack + 360 / rack_resolution])
        {
            translate([(-1 * rack_length - pinion_circumference/4) + (rotate_step_length * i),0,0])
            rotate([0,0,-1 * i])
            pinion();
        }
    }
}

rack();
//pinion();