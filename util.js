function fillMapRect(map, x, y, width, height, value) {
    for (let i = x; i <= x+width; i++) {
        for (let j = y; j <= y+height; j++) {
            map[i][j] = value;
        }
    }
}

function cloneMap(map) {
    let newMap = [];
    for (let i = 0; i < map.length; i++) {
        newMap.push([]);
        for (let j = 0; j < map[i].length; j++) {
            newMap[i].push(map[i][j]);
        }
    }
    return newMap;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function lerp(scalar, one, two) {
  return (two - one) * scalar + one;
}

function blurMap(map, radius, bias) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let avg = map[i][j]*bias;
            let total = bias;
            for (let k = -radius; k <= radius; k++) {
                for (let l = -radius; l <= radius; l++) {
                    cur = map?.[i+k]?.[j+l];
                    if (cur) {
                        avg += cur;
                        total++;
                    } else {
                        total++;
                    }
                }
            }
            avg /= total;
            map[i][j] = avg*MARKER_DISSIPATION_RESISTANCE;
        }
    }
    return map;
}

function randomRange(min, max) {
    return Math.random()*(max-min)+min;
}

function createMap(size, min, max) {
    let map = [];
    for (let i = 0 ; i < size; i++) {
        map.push([]);
        for (let j = 0; j < size; j++) {
            map[i].push(randomRange(min,max));
        }
    }
    return map;
}

function indexOfLargest(arr) {
    let max = -Infinity;
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
            index = i;
        }
    }
    return index;
}
