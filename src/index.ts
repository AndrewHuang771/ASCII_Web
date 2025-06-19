import { NoiseFunction3D, createNoise3D } from "simplex-noise";
import { RectangleFactory, StaticFactory } from "./classes/Factory";

import { Charmap } from "./classes/Charmap";
import { TextPlayer } from "./classes/TextPlayer";
import { scalemap } from "./config/ASCII";
import { rawText } from "./assets/text";

function splitPreservingWords(input: string, maxLength: number): string[] {
    const rows: string[] = [];
    let line = "";

    // Normalize CRLF (\r\n) and LF (\n) into a common token `\n` for easier handling
    const normalizedInput = input.replace(/\r\n/g, "\n");

    // Tokenize: words, whitespace, and newlines
    const tokens = normalizedInput.match(/[^\s\n]+|\s+|\n/g) || [];

    for (const token of tokens) {
        if (token === "\n") {
            // Force line break on newline
            rows.push(line);
            line = "    ";
        } else if ((line + token).length > maxLength) {
            if (line.length > 0) {
                rows.push(line);
                line = "";
            }

            if (token.trim() === "") {
                // Just whitespace — move it to new line if possible
                line = token;
            } else if (token.length > maxLength) {
                // Word is longer than line — break it into chunks
                const parts = token.match(new RegExp(`.{1,${maxLength}}`, 'g'))!;
                rows.push(...parts.slice(0, -1));
                line = parts[parts.length - 1];
            } else {
                // Start new line with token
                line = token;
            }
        } else {
            // Safe to append token
            line += token;
        }
    }

    if (line.length > 0) {
        rows.push(line);
    }

    return rows;
}

// let ruler = document.createElement("div");
// ruler.innerText = "a";
// ruler.id = "ruler";
// ruler.style.display = "inline-block";
// document.body.appendChild(ruler);
// const charWidth = document.getElementById("ruler")?.clientWidth;
// const charHeight = document.getElementById("ruler")?.clientHeight;

let canvasWidth = Math.ceil(window.innerWidth / 8.8);
let canvasHeight = Math.ceil(window.innerHeight / 16);

function generateTexts() {
    // Given a canvasWidth, generate the text
    return splitPreservingWords(rawText, 60);
}

const text = generateTexts();

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
let maxTextWidth = 0;
for (let x = 0; x < text.length; x++) {
    maxTextWidth = Math.max(maxTextWidth, text[x].length);
}
const staticFunction = staticFactory.build(3, 40, Math.floor((parentWidth - maxTextWidth) / 2), maxTextWidth + Math.floor((parentWidth - maxTextWidth) / 2) + 1, text, () => { return " " }, () => { return " " });
const rectWrapper = rectFactory.build(5, canvasHeight - 10, Math.floor(canvasWidth / 3), Math.floor(2 * canvasWidth / 3), staticFunction, generatorFunction);

let testCharmap: Charmap = new Charmap(0, generatorFunction);
let testCharmap2: Charmap = new Charmap(0, rectWrapper);

let newNode = document.createElement("div");
newNode.id = "test";
document.body.appendChild(newNode);

const player = new TextPlayer(0, document.getElementById("test")!, testCharmap, canvasWidth, canvasHeight);

setTimeout(() => {
    player.fadeInto(testCharmap2, () => {
        console.log("DONE!!");
    });
}, 2000);
