class Ant{
    // radius = ANT_FOLLOW_RADIUS;
    markerStrength = ANT_MARKER_STRENGTH;
    x = 0;
    y = 0;
    hasFood = false;
    direction = 0;
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
    sample(map, scalar) {
        let possibles = [];
        for (let i = 0 ; i < dirs.length ; i++) {
            let current = map?.[this.x+(sampleLocs[i].x)]?.[this.y+(sampleLocs[i].y)];
            if (wall?.[this.x+(sampleLocs[i].x)]?.[this.y+(sampleLocs[i].y)] == 1)
                current = 0;
            if (wall?.[this.x+(dirs[i].x)]?.[this.y+(dirs[i].y)] == 1)
                current = 100 * -scalar;
            possibles.push(current ?? 0);
        }
        return possibles
    }
    track(trackingX, trackingY) {
        if (trackingX != -1) {
            let dirX = 0, dirY = 0;
            if (trackingX > this.x) dirX = 1;
            if (trackingX < this.x) dirX = -1;
            if (trackingY > this.y) dirY = 1;
            if (trackingY < this.y) dirY = -1;
            this.direction = getIndexOfDirection(dirX, dirY);
        }
    }
    wander() {
        // add random movement
        if (Math.floor(randomRange(0,ANT_RANDOM_MOVE_CHANCE)) == 0) {
            this.direction += Math.floor(randomRange(-1, 2));
            this.direction = wrap(this.direction, 0, dirs.length);
        }
    }
    mark(map, scalar) {
        map[this.x][this.y] += this.markerStrength * scalar;
        map[this.x][this.y] = clamp(map[this.x][this.y], MIN_MARKER_STRENGTH, MAX_MARKER_STRENGTH);
    }
    move() {
        // move in that direction
        this.x += dirs[this.direction].x;
        this.y += dirs[this.direction].y;
        // wrap around world
        this.x = wrap(this.x, 0, GRID_WIDTH-1);
        this.y = wrap(this.y, 0, GRID_WIDTH-1);
        // collide with walls
        if (wall[this.x][this.y]) {
            // move in that direction
            this.x -= dirs[this.direction].x;
            this.y -= dirs[this.direction].y;
            // wrap around world
            this.x = wrap(this.x, 0, GRID_WIDTH-1);
            this.y = wrap(this.y, 0, GRID_WIDTH-1);
            this.direction = wrap(this.direction+4, 0, dirs.length);
        }

    }
    update() {
        if (this.hasFood) {
            // sample markers
            let possibles = this.sample(negMarkers, -1);
            // cut possibles into directions neighbouring current direction
            possibles = getWrapppingNeighbors(possibles, this.direction, 1);
            // go in direction of most positive marker
            let largestIndex = indexOfSmallest(possibles);
            if (possibles[largestIndex] < -MARKER_FOLLOW_THRESHOLD) {
                this.direction = largestIndex+this.direction-1;
                this.direction = wrap(this.direction, 0, dirs.length);
            }
            // leave a marker at the current position
            this.mark(posMarkers, 1);
            // add random movement
            this.wander();
            // move towards anthill is close enough
            if (dist(this.x, this.y, homeX, homeY) < 15)
                this.track(homeX, homeY);
            this.move();
            // check if hill here
            if (dist(this.x, this.y, homeX, homeY) < 5) {
                // make a 180 degree turn
                this.direction = wrap(this.direction+4, 0, dirs.length);
                this.hasFood = false;
                foodDelivered++;
                updateInitcators();
            }
        } else {
            // sample markers
            let possibles = this.sample(posMarkers, 1);
            // cut possibles into directions neighbouring current direction
            possibles = getWrapppingNeighbors(possibles, this.direction, 1);
            // go in direction of most positive marker
            let largestIndex = indexOfLargest(possibles);
            if (possibles[largestIndex] > MARKER_FOLLOW_THRESHOLD) {
                this.direction = largestIndex+this.direction-1;
                this.direction = wrap(this.direction, 0, dirs.length);
            }
            // leave a marker at the current position
            this.mark(negMarkers,-1);
            this.wander();
            // move towards food if close enough
            let foodX = -1, foodY = -1;
            for (let i = -5; i <= 5 ; i++) {
                for (let j = -5; j <= 5 ; j++) {
                    if (food?.[i+this.x]?.[j+this.y] == 1) {
                        foodX = i+this.x;
                        foodY = j+this.y;
                        break;
                    }
                }
                if (foodX != -1) break;
            }
            this.track(foodX, foodY);
            this.move();
            // check if food here
            if (food[this.x][this.y] == 1) {
                // make a 180 degree turn
                this.direction = wrap(this.direction+4, 0, dirs.length);
                this.hasFood = true;
            }
        }
    }
    draw() {
        ctx.fillStyle = this.hasFood ? "blue" : "magenta";
        ctx.fillRect(this.x*gs, this.y*gs, gs, gs);
    }
}