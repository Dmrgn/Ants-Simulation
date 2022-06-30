class Ant{
    radius = 5;
    markerStrength = 0.5;
    x = 0;
    y = 0;
    hasFood = false;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    sample() {
        let possibles = [];
        for (let i = 0 ; i < dirs.length ; i++) {
            let current = markers?.[this.x+(dirs[i].x*this.radius)]?.[this.y+(dirs[i].y*this.radius)];
            possibles.push(current ? current : 0);
        }
        return possibles
    }
    update() {
        if (this.hasFood) {

        } else {
            // sample markers
            let possibles = this.sample();
            // go in direction of most positive marker
            console.log(possibles);
            let directionIndex = indexOfLargest(possibles);
            // leave a marker at the current position
            markers[this.x][this.y] -= this.markerStrength;
            // move in that direction
            this.x += dirs[directionIndex].x;
            this.y += dirs[directionIndex].y;
            // wrap around world
            if (this.x < 0)
                this.x = GRID_WIDTH-1;
            if (this.y < 0)
                this.y = GRID_WIDTH-1;
            this.x%=GRID_WIDTH;
            this.y%=GRID_WIDTH;
            // check if food here
            // for (let i = 0; i < food.length; i++) {
            //     if (food[i].x ==) {

            //     }
            // }
        }
    }
    draw() {
        ctx.fillStyle = "purple";
        ctx.fillRect(this.x*gs, this.y*gs, gs, gs);
    }
}