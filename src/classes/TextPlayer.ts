import { Charmap } from "./Charmap";
import { scalemap } from "../config/ASCII";

export class TextPlayer {
    // Textfield is to Charmap like DVD player is to a DVD
    id: number;
    parentNode: HTMLElement;
    width: number;
    height: number;
    frame: number = 1
    charmap: Charmap;
    screen: Array<Array<string>>;
    currentInterval: any;
    transitionInterval: any;
    timerInterval: any;
    fps: number = 50;
    intervalDelay = 50; // milliseconds

    constructor(id: number, parentNode: HTMLElement, charmap: Charmap, width: number, height: number) {
        this.id = id;
        this.parentNode = parentNode;
        this.charmap = charmap;
        this.height = height;
        this.width = width;
        this.screen = this.charmap.getCharmapFrame(0, height, 0, width, this.frame);

        // We render the current charmap at frame 1
        this.start();
        this.startTimer();
    }

    start() {
        clearInterval(this.currentInterval);
        this.currentInterval = setInterval(() => {
            this.updateScreen();
            this.render();
        }, this.intervalDelay);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.frame += 1;
        }, this.fps);
    }

    getTransitionPixel(targetPixel: string, currentPixel: string) {
        let targetIdx = scalemap.indexOf(targetPixel);
        let currentIdx = scalemap.indexOf(currentPixel);
        if (targetIdx == -1) {
            // If the target pixel doesn't exist in the scalemap, give a 25% chance of rendering it.
            if (Math.random() <= 0.05) {
                return targetPixel;
            }
            return scalemap[(currentIdx + 1) % scalemap.length];
        }
        const difference = targetIdx - currentIdx;
        return scalemap[currentIdx + (difference / Math.abs(difference))];
    }

    fadeInto(newCharmap: Charmap, callback?: Function) {
        this.charmap = newCharmap;

        clearInterval(this.currentInterval);
        clearInterval(this.transitionInterval);
        this.transitionInterval = setInterval(() => {
            // Each iteration of the interval represents a small shift towards the desired final frame. 
            let done = true;
            for (let x = 0; x < this.height; x++) {
                for (let y = 0; y < this.width; y++) {
                    const targetPixel = this.charmap.getCharmapFramePixel(x, y, this.frame);
                    const currentPixel = this.screen[x][y];
                    if (targetPixel !== currentPixel) {
                        this.screen[x][y] = this.getTransitionPixel(targetPixel, currentPixel);
                        done = false;
                    } else {
                        this.screen[x][y] = this.charmap.getCharmapFramePixel(x, y, this.frame);
                    }
                }
            }
            this.render();
            if (done) {
                clearInterval(this.transitionInterval);
                this.start();
                if (callback) {
                    callback();
                }
            }
        }, this.intervalDelay / 2);
    }

    setGeneratorFunction(newGeneratorFunction: Function) {
        this.charmap.setGeneratorFunction(newGeneratorFunction);
    }

    setCharmapTo(newCharmap: Charmap) {
        this.frame = 1;
        this.charmap = newCharmap;
    }

    updateScreen() {
        this.screen = this.charmap.getCharmapFrame(0, this.height, 0, this.width, this.frame);
    }

    render() {
        // Remove existing text
        this.parentNode.innerHTML = "";

        // Add new text
        for (let x = 0; x < this.height; x++) {
            let node = document.createElement("div");
            let divText = "";
            for (let y = 0; y < this.width; y++) {
                divText += this.screen[x][y];
            }
            node.innerText = divText;
            this.parentNode.appendChild(node);
        }
    }
}