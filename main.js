// variables for simulation
const SIMULATION_SPEED = 10; // frames per second
const MARKER_DISSIPATION_RESISTANCE = 0.9;
const BLUR_RADIUS = 1;
const BLUR_BIAS = 10;
const CAN_WIDTH = 800;
const GRID_WIDTH = 100;
const gs = CAN_WIDTH/GRID_WIDTH;
// end variables for simulation

const can = document.getElementById("can");
const ctx = can.getContext("2d");

let ants = [];
let markers = [];
let food = [];

// init food array
for (let i = 0; i < GRID_WIDTH ; i++) {
    food.push([]);
    for (let j = 0; j < GRID_WIDTH ; j++) {
        food[i].push(0);
    }
}

// init marker array
for (let i = 0; i < GRID_WIDTH ; i++) {
    markers.push([]);
    for (let j = 0; j < GRID_WIDTH ; j++) {
        // markers[i].push(randomRange(-100,100));
        markers[i].push(0);
    }
}

// init ants
for (let i = 0; i < 100 ; i++) {
    ants.push(new Ant(Math.floor(randomRange(10, 90)), Math.floor(randomRange(10, 90))));
}

// place food
fillMapRect(food, 2, 2, 10, 10, 1);


// start main loop
setInterval(()=>{
    fillMapRect(markers, 0, 0, 2, 99, -10);
    fillMapRect(markers, 97, 0, 2, 99, -10);
    fillMapRect(markers, 0, 0, 99, 2, -10);
    fillMapRect(markers, 0, 97, 99, 2, -10);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, can.width, can.height);

    blurMap(markers, BLUR_RADIUS, BLUR_BIAS);
    
    for (let i = 0 ; i < GRID_WIDTH; i++) {
        for (let j = 0 ; j < GRID_WIDTH; j++) {
            // draw the marker in this pixel
            let colourAmount = clamp(lerp(Math.abs(markers[i][j]), 0, 255), 0, 255);
            ctx.fillStyle = (markers[i][j] > 0) ? `rgb(0,${colourAmount},0)` : `rgb(${colourAmount},0,0)`;
            ctx.fillRect(i*gs, j*gs, gs, gs);
            // draw the food in this pixel
            if (food[i][j] > 0) {
                ctx.fillStyle = "pink";
                ctx.fillRect(i*gs, j*gs, gs, gs);
            }
        }
    }

    ants.forEach((a)=>{
        a.update();
        a.draw();
    });

}, 1000/SIMULATION_SPEED);



