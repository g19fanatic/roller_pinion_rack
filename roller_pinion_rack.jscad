function getParameterDefinitions() {
    return [{
        name: 'pinion_radius',
        type: 'float',
        initial: 50
    }, {
        name: 'pinion_num_teeth',
        type: 'float',
        initial: 8
    }, {
        name: 'pinion_tooth_radius',
        type: 'float',
        initial: 8
    }, {
        name: 'pinion_base_height',
        type: 'float',
        initial: 10
    }, {
        name: 'pinion_tooth_height',
        type: 'float',
        initial: 10
    }, {
        name: 'rack_height',
        type: 'float',
        initial: 30
    }, {
        name: 'rack_length',
        type: 'float',
        initial: 314.159 / 2
    }, {
        name: 'rack_tooth_percent',
        type: 'float',
        initial: 0.65
    }];
}

function pinion(radius, num_teeth, tooth_radius, base_height, tooth_height) {

    //create the base 
    var base = cylinder({
        h: base_height,
        r: radius,
        center: true
    });
    var teeth = [];
    //create the teeth
    for (i = 0; i < num_teeth; i++) {
        var tooth = translate([cos(i * (360 / num_teeth)) * (radius - tooth_radius),
                sin(i * (360 / num_teeth)) * (radius - tooth_radius),
                base_height / 2 + tooth_height / 2
            ],
            cylinder({
                h: tooth_height + 0.1,
                r: tooth_radius,
                center: true
            }));
        teeth.push(tooth);
    }
    return union(base, teeth);

}

function rack(radius, num_teeth, tooth_radius, base_height, tooth_height, rack_height, rack_length, rack_tooth_percent) {
    var pi = 3.14159265359;
    var rack_resolution = 1;

    var rack_thickness = tooth_height - 0.1;
    var pinion_circumference = 2 * pi * radius;
    var rotate_step_length = rack_resolution * pi / 180 * radius;
    var num_steps = 360.0 / rack_resolution;
    var rotations_per_rack = round(rack_length / pinion_circumference);
    var steps_per_rack = round(rack_length / rotate_step_length);

    var rackObj = cube({
        size: [rack_length, rack_height, rack_thickness],
        center: true
    }).translate([0, -radius - rack_height / 2 + rack_tooth_percent * rack_height, base_height + 0.05]);
    var pin = pinion(radius, num_teeth, tooth_radius, base_height, tooth_height);

    for (i = 0; i < steps_per_rack + 360 / rack_resolution; i += rack_resolution) {
        var newPin = translate([(-1 * rack_length - pinion_circumference / 4) + (rotate_step_length * i), 0, 0],
            rotate([0, 0, -1 * i], pin));
        rackObj = rackObj.subtract(newPin);
    }

    return rackObj;
}

function main(params) {
    var p = params;
    //return pinion(p.pinion_radius, p.pinion_num_teeth, p.pinion_tooth_radius, p.pinion_base_height, p.pinion_tooth_height);
    return rack(p.pinion_radius, p.pinion_num_teeth, p.pinion_tooth_radius, p.pinion_base_height, p.pinion_tooth_height, p.rack_height, p.rack_length, p.rack_tooth_percent);
}