import { TextPlayer } from "./classes/TextPlayer";
import { Charmap } from "./classes/Charmap";
import { scalemap } from "./config/ASCII";
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
const generatorFunction3 = (x: number, y: number, t: number) => {
    return scalemap[((x * y) % scalemap.length)];
}
let testCharmap: Charmap = new Charmap(0, generatorFunction);
let testCharmap2: Charmap = new Charmap(0, generatorFunction2);
let testCharmap3: Charmap = new Charmap(0, generatorFunction3);

let newNode = document.createElement("div");
newNode.id = "test";
document.body.appendChild(newNode);

const player = new TextPlayer(0, document.getElementById("test")!, testCharmap, 100, 100);

setTimeout(() => {
    player.transitionFade(testCharmap2, () => {
        console.log("DONE!!");
    });
}, 2000);

setTimeout(() => {
    player.transitionFade(testCharmap3, () => {
        console.log("DONE!!");
    });
}, 5000);
