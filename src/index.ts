import { TextPlayer } from "./classes/TextPlayer";
import { Charmap } from "./classes/Charmap";
import { scalemap } from "./config/ASCII";
import { text } from "./assets/test_long";
import { createNoise3D, NoiseFunction3D } from "simplex-noise";

// Create 2 configs for a framemap based on simplex noise
const noise3D: NoiseFunction3D = createNoise3D();
const generatorFunction = (x: number, y: number, t: number) => {
    const scalemapIdx = Math.floor(scalemap.length / 2) + Math.floor(scalemap.length / 2 * noise3D((x + 1) * 0.005, (y + 1) * 0.005, 0.005 * t));
    return scalemap[scalemapIdx];
}
const generatorFunction2 = (x: number, y: number, t: number) => {
    const scalemapIdx = Math.floor(scalemap.length / 2) + Math.floor(scalemap.length / 2 * noise3D((x + 100000) * 0.005, (y + 100000) * 0.005, 0.005 * t));
    return scalemap[scalemapIdx];
}

const generatorFunction4 = (x: number, y: number, t: number) => {
    // if (t >= 1 && t <= 109) {
    //     x -= Math.floor(t / 10);
    //     y -= Math.floor(t / 10);
    // } else {
    x -= 11;
    y -= 11;
    // }

    if (x >= 0 && x < text.length) {
        if (y >= 0 && y < text[x].length) {
            return text[x][y];
        }
    }
    return " ";
}

const rectangleFunctionFactory = (xMin: number, xMax: number, yMin: number, yMax: number, fill: Function, background: Function) => {
    const rectangleFunction = (x: number, y: number, t: number) => {
        if ((x === xMin || x === xMax) && y > yMin && y < yMax) {
            return "-";
        } else if ((y === yMin || y === yMax) && x > xMin && x < xMax) {
            return "|"
        } else if ((x === xMin && y === yMin) || (x === xMax && y === yMax)) {
            return "/"
        } else if ((x === xMin && y === yMax) || (x === xMax && y === yMin)) {
            return "\\"
        } else if (x > xMin && x < xMax && y > yMin && y < yMax) {
            return fill(x, y, t);
        } else {
            return background(x, y, t);
        }
    }
    return rectangleFunction;
}

const sampleRectGenFun = rectangleFunctionFactory(10, 40, 10, 100, generatorFunction4, generatorFunction);
const nestedRectFun = rectangleFunctionFactory(15, 25, 15, 30, generatorFunction, sampleRectGenFun)

let testCharmap: Charmap = new Charmap(0, generatorFunction);
let testCharmap2: Charmap = new Charmap(0, nestedRectFun);

let newNode = document.createElement("div");
newNode.id = "test";
document.body.appendChild(newNode);

const player = new TextPlayer(0, document.getElementById("test")!, testCharmap, 250, 100);

setTimeout(() => {
    player.fadeInto(testCharmap2, () => {
        console.log("DONE!!");
    });
}, 2000);
