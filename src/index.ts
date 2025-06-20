import { NoiseFunction3D, createNoise3D } from "simplex-noise";
import { RectangleFactory, StaticFactory } from "./classes/Factory";

import { splitPreservingWords } from "./utils/charmapEditor";
import { Charmap } from "./classes/Charmap";
import { TextPlayer } from "./classes/TextPlayer";
import { scalemap } from "./config/ASCII";
import { rawTextStory, rawTextStory2 } from "./assets/text";

// let ruler = document.createElement("div");
// ruler.innerText = "a";
// ruler.id = "ruler";
// ruler.style.display = "inline-block";
// document.body.appendChild(ruler);
// const charWidth = document.getElementById("ruler")?.clientWidth;
// const charHeight = document.getElementById("ruler")?.clientHeight;

let canvasWidth = Math.ceil(window.innerWidth / 8.8);
let canvasHeight = Math.ceil(window.innerHeight / 16);
let textWidth = 60;

function generateTexts(text: string) {
    // Given a canvasWidth, generate the text
    return splitPreservingWords(text, textWidth);
}

const text1 = generateTexts(rawTextStory);
const text2 = generateTexts(rawTextStory2);

// Create 2 configs for a framemap based on simplex noise
const noise3D: NoiseFunction3D = createNoise3D();
const generatorFunction = (x: number, y: number, t: number) => {
    const scalemapIdx = Math.floor(scalemap.length / 2) + Math.floor(scalemap.length / 2 * noise3D((x + 1) * 0.005, (y + 1) * 0.005, 0.005 * t));
    return scalemap[scalemapIdx];
}

const rectFactory = new RectangleFactory();
const staticFactory = new StaticFactory();

// Factories return a function that accepts (x, y, t) and returns a value per pixel
const parentWidth = Math.floor(canvasWidth / 3);

const staticFunction = staticFactory.build(3, 40, Math.floor((parentWidth - textWidth) / 2), textWidth + Math.floor((parentWidth - textWidth) / 2) + 1, text1, () => { return " " }, () => { return " " });
const rectWrapper = rectFactory.build(5, canvasHeight - 10, Math.floor(canvasWidth / 3), Math.floor(2 * canvasWidth / 3), staticFunction, generatorFunction);

const staticFunction2 = staticFactory.build(3, 40, Math.floor((parentWidth - textWidth) / 2), textWidth + Math.floor((parentWidth - textWidth) / 2) + 1, text2, () => { return " " }, () => { return " " });
const rectWrapper2 = rectFactory.build(5, canvasHeight - 10, Math.floor(canvasWidth / 3), Math.floor(2 * canvasWidth / 3), staticFunction2, generatorFunction);


let testCharmap: Charmap = new Charmap(0, generatorFunction);
let testCharmap2: Charmap = new Charmap(0, rectWrapper);
let testCharmap3: Charmap = new Charmap(0, rectWrapper2);

let newNode = document.createElement("div");
newNode.id = "test";
document.body.appendChild(newNode);

const player = new TextPlayer(0, document.getElementById("test")!, testCharmap, canvasWidth, canvasHeight);

setTimeout(() => {
    player.fadeInto(testCharmap2, () => {
        console.log("DONE!!");
    });
}, 2000);

setTimeout(() => {
    console.log("ASDASD");
    player.fadeInto(testCharmap3, () => {
        console.log("DONE!!");
    });
}, 7000);
