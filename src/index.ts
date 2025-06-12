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
const basestr = "=UwU=";
const generatorFunction3 = (x: number, y: number, t: number) => {
    if (x < text.length) {
        if (y < text[x].length) {
            return text[x][y];
        }
    }
    return generatorFunction(x, y, t);
    return scalemap[Math.floor(Math.random() * scalemap.length)];
    // return scalemap[Math.floor((Math.sin(y) + 1) * scalemap.length) % scalemap.length];
    // return Math.floor((Math.sin(y) + 1) * 10).toString();
    // return basestr[((y) % basestr.length)];
}
let testCharmap: Charmap = new Charmap(0, generatorFunction);
let testCharmap2: Charmap = new Charmap(0, generatorFunction2);
let testCharmap3: Charmap = new Charmap(0, generatorFunction3);

let newNode = document.createElement("div");
newNode.id = "test";
document.body.appendChild(newNode);

const player = new TextPlayer(0, document.getElementById("test")!, testCharmap, 250, 100);

setTimeout(() => {
    player.fadeInto(testCharmap2, () => {
        console.log("DONE!!");
    });
}, 2000);

setTimeout(() => {
    player.fadeInto(testCharmap3, () => {
        console.log("DONE!!");
    });
}, 5000);

setTimeout(() => {
    player.fadeInto(testCharmap, () => {
        console.log("DONE!!");
    });
}, 9000);