const CAN_WIDTH = 800;
const GRID_WIDTH = 100;
const gs = CAN_WIDTH/GRID_WIDTH;
const homeX = Math.floor(GRID_WIDTH/2);
const homeY = Math.floor(GRID_WIDTH/2);

const can = document.getElementById("can");
const ctx = can.getContext("2d");
const selectionElm = document.getElementById("selection");

let mouseX = 0, mouseY = 0;
let isMouseDown = false;

let startX = -1, startY = -1;

let selectionIndex = 0;
let wall = [];
let food = [];
let selections = [wall, food];
let selectionNames= ["Wall", "Food"];

for (let i = 0; i < GRID_WIDTH; i++) {
    wall.push([]);
    food.push([]);
    for (let j = 0; j < GRID_WIDTH; j++) {
        wall[i].push(false);
        food[i].push(false);
    }
}

document.addEventListener("keypress", (e)=> {
    e.preventDefault();
    if (e.key > 0 && e.key <= selections.length) {
        selectionIndex = Number(e.key)-1;
        selectionElm.innerText = selectionNames[selectionIndex];
    }
    if (e.key == 's') {
        document.body.innerHTML = "";
        const data = {
            wall:wall,
            food:food
        };
        document.body.innerText = JSON.stringify(data);
    }
    if (e.key == 'l') {
        const raw = prompt();
        const data = JSON.parse(raw);
        wall = data.wall;
        food = data.food;
    }
});

can.addEventListener("mousemove", (e)=>{
    let rect = can.getBoundingClientRect();
    mouseX = e.clientX-rect.left;
    mouseY = e.clientY-rect.top;
});

can.addEventListener("mousedown", (e)=>{
    e.preventDefault();
    if (e.button == 0) { // left mouse button
        isMouseDown = true;
        startX = Math.floor(mouseX/gs);
        startY = Math.floor(mouseY/gs);
    } else if (e.button == 2) { // right mouse button
        isMouseDown = false;
        startX = -1;
        startY = -1;
    }
});

can.addEventListener("mouseup", (e)=>{
    e.preventDefault();
    if (e.button == 0) isMouseDown = false;
    if (e.button == 0 && startX != -1) { // left mouse button
        let endX = Math.floor(mouseX/gs);
        let endY = Math.floor(mouseY/gs);
        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                if (selections[selectionIndex]?.[i]?.[j] != undefined)
                    selections[selectionIndex][i][j] = (!selections[selectionIndex][i][j]);
                console.log(selections[selectionIndex][i][j]);
            }
        }
    }
});

can.addEventListener("contextmenu", (e)=>{
    e.preventDefault();
});

setInterval(()=>{
    // drazw background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, can.width, can.height);
    // draw cursor
    let x = Math.floor(mouseX/gs);
    let y = Math.floor(mouseY/gs);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(x*gs, y*gs, gs, gs)
    // draw elements
    for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            if (wall[i][j]) {
                ctx.fillStyle = "grey";
                ctx.fillRect(i*gs, j*gs, gs, gs);
            }
            if (food[i][j]) {
                ctx.fillStyle = "pink";
                ctx.fillRect(i*gs, j*gs, gs, gs);
            }
        }
    }
    // draw blueprint
    if (isMouseDown) {
        ctx.fillStyle = "blue";
        ctx.fillRect(startX*gs, startY*gs,(x-startX+1)*gs,(y-startY+1)*gs);
    }
    // draw ant hill
    ctx.fillStyle = "brown";
    ctx.ellipse(homeX*gs, homeY*gs, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();
},1000/60);