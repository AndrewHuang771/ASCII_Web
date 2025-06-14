import { NoiseFunction3D, createNoise3D } from "simplex-noise";
import { RectangleFactory, StaticFactory } from "./classes/Factory";

import { Charmap } from "./classes/Charmap";
import { TextPlayer } from "./classes/TextPlayer";
import { scalemap } from "./config/ASCII";
import { text } from "./assets/test_long";

// Create 2 configs for a framemap based on simplex noise
const noise3D: NoiseFunction3D = createNoise3D();
const generatorFunction = (x: number, y: number, t: number) => {
    const scalemapIdx = Math.floor(scalemap.length / 2) + Math.floor(scalemap.length / 2 * noise3D((x + 1) * 0.005, (y + 1) * 0.005, 0.005 * t));
    return scalemap[scalemapIdx];
}

const rectFactory = new RectangleFactory();
const staticFactory = new StaticFactory();

const staticFunction = staticFactory.build(10, 40, 10, 100, text, generatorFunction);

const sampleRectGenFun = rectFactory.build(10, 40, 10, 100, staticFunction, generatorFunction);
const nestedRectFun = rectFactory.build(15, 25, 15, 30, generatorFunction, sampleRectGenFun)

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
