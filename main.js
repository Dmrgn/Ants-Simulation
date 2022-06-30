// variables for simulation
const SIMULATION_SPEED = 60; // frames per second
const MARKER_DISSIPATION_RESISTANCE = 0.997;
const ANT_RANDOM_MOVE_CHANCE = 7;
const MARKER_FOLLOW_THRESHOLD = 0.1;
// const ANT_FOLLOW_RADIUS = 5;
const MIN_MARKER_STRENGTH = -1;
const MAX_MARKER_STRENGTH = 1;
const ANT_MARKER_STRENGTH = 100;
const BLUR_RADIUS = 1;
const BLUR_BIAS = 100;
const CAN_WIDTH = 800;
const GRID_WIDTH = 100;
const gs = CAN_WIDTH/GRID_WIDTH;
const homeX = Math.floor(GRID_WIDTH/2);
const homeY = Math.floor(GRID_WIDTH/2);
// end variables for simulation

const can = document.getElementById("can");
const ctx = can.getContext("2d");
const deliveredElm = document.getElementById("delivered");
const populationElm = document.getElementById("population");

let foodDelivered = 0;

let ants = [];
let posMarkers = [];
let negMarkers = [];
let food = [];
let wall = [];

function init() {
    foodDelivered = 0;
    ants = [];
    posMarkers = [];
    negMarkers = [];
    food = [];
    wall = [];

    // init food array
    for (let i = 0; i < GRID_WIDTH ; i++) {
        food.push([]);
        for (let j = 0; j < GRID_WIDTH ; j++) {
            food[i].push(0);
        }
    }

    // init wall array
    for (let i = 0; i < GRID_WIDTH ; i++) {
        wall.push([]);
        for (let j = 0; j < GRID_WIDTH ; j++) {
            wall[i].push(0);
        }
    }

    // init marker array
    for (let i = 0; i < GRID_WIDTH ; i++) {
        posMarkers.push([]);
        negMarkers.push([]);
        for (let j = 0; j < GRID_WIDTH ; j++) {
            // posMarkers[i].push(randomRange(-100,100));
            posMarkers[i].push(0);
            negMarkers[i].push(0);
        }
    }

    // init ants
    for (let i = 0; i < 50 ; i++) {
        ants.push(new Ant(homeX, homeY, Math.floor(randomRange(0, dirs.length))));
    }

    updateInitcators();
}

function updateInitcators() {
    deliveredElm.innerText = foodDelivered;
    populationElm.innerText = ants.length;
}

// allow loading a map
document.addEventListener("keypress", (e)=> {
    e.preventDefault();
    if (e.key == 'l') {
        const raw = prompt();
        const data = JSON.parse(raw);
        init();
        wall = data.wall;
        food = data.food;
    }
    if (e.key == 'k') {
        const num = Number(prompt("Number of ants to kill:"));
        for (let i = 0; i < num ; i++) {
            ants.shift();
        }
    }
    if (e.key == 'a') {
        const num = Number(prompt("Number of ants to add:"));
        for (let i = 0; i < num ; i++) {
            ants.push(new Ant(homeX, homeY, Math.floor(randomRange(0, dirs.length))));
        }
    }
    updateInitcators();
});

init();

// place food
// fillMapRect(food, 80, 2, 18, 3, 1);
fillMapRect(food, 2, 45, 10, 10, 1);

// place walls
fillMapRect(wall, 25, 25, 8, 50, 1);

// start main loop
setInterval(()=>{
    // fillMapRect(posMarkers, 0, 48, 50, 3, 1);
    // fillMapRect(negMarkers, 0, 48, 50, 3, -1);
    // fillMapRect(posMarkers, 50, 48, 48, 3, 1);
    // fillMapRect(negMarkers, 50, 48, 48, 3, -1);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, can.width, can.height);

    
    blurMap(posMarkers, BLUR_RADIUS, BLUR_BIAS);
    blurMap(negMarkers, BLUR_RADIUS, BLUR_BIAS);
    
    for (let i = 0 ; i < GRID_WIDTH; i++) {
        for (let j = 0 ; j < GRID_WIDTH; j++) {
            posMarkers[i][j] = clamp(posMarkers[i][j], -1, 1);
            negMarkers[i][j] = clamp(negMarkers[i][j], -1, 1);
            // draw the marker in this pixel
            // let avgValue = posMarkers[i][j]+negMarkers[i][j];
            // if (Math.floor(randomRange(0,1200)) == 0)
            //     console.log(posMarkers[i][j]);
            let green = clamp(lerp(Math.abs(posMarkers[i][j]), 0, 255), 0, 255);
            let red = clamp(lerp(Math.abs(negMarkers[i][j]), 0, 255), 0, 255);
            ctx.fillStyle = `rgb(${red},${green},0)`;
            ctx.fillRect(i*gs, j*gs, gs, gs);
            // draw the food in this pixel
            if (food[i][j] > 0) {
                ctx.fillStyle = "pink";
                ctx.fillRect(i*gs, j*gs, gs, gs);
            }
            // draw walls
            if (wall[i][j] > 0) {
                ctx.fillStyle = "grey";
                ctx.fillRect(i*gs, j*gs, gs,gs);
            }
        }
    }
    
    // draw ant hill
    ctx.fillStyle = "brown";
    ctx.ellipse(homeX*gs, homeY*gs, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();

    ants.forEach((a)=>{
        a.update();
        a.draw();
    });

}, 1000/SIMULATION_SPEED);



