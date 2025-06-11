import { wrapperStyle, titleStyle, descriptionStyle, canvasStyle, actionsStyle, minimapStyle } from "../config/styleConfigs";

export interface DOMconfig {
    baseParent: HTMLElement;
    doActionCallback: Function;
    changePositionCallback: Function;
}

export class DOMcursor {
    baseParent: HTMLElement;
    wrapper: HTMLElement;
    changePositionCallback: Function;
    doActionCallback: Function
    title: HTMLElement;
    description: HTMLElement;
    ASCIIcanvas: HTMLElement;
    actions: HTMLElement;
    minimap: HTMLElement;
    audio?: HTMLAudioElement;

    constructor(config: DOMconfig) {
        this.baseParent = config.baseParent;
        this.changePositionCallback = config.changePositionCallback;
        this.doActionCallback = config.doActionCallback;

        // We construct the game screens as empty divs
        this.wrapper = document.createElement("div");
        this.title = document.createElement("div");
        this.description = document.createElement("div");
        this.ASCIIcanvas = document.createElement("div");
        this.actions = document.createElement("div");
        this.minimap = document.createElement("div");

        // Apply styles to the divs
        this.addStyles(wrapperStyle, this.wrapper);
        this.addStyles(titleStyle, this.title);
        this.addStyles(descriptionStyle, this.description);
        this.addStyles(canvasStyle, this.ASCIIcanvas);
        this.addStyles(actionsStyle, this.actions);
        this.addStyles(minimapStyle, this.minimap);

        // We append the game screens to the base parent
        this.wrapper.appendChild(this.title);
        this.wrapper.appendChild(this.description);
        this.wrapper.appendChild(this.ASCIIcanvas);
        this.wrapper.appendChild(this.actions);
        this.wrapper.appendChild(this.minimap);

        this.baseParent.appendChild(this.wrapper);

        this.initGameListeners();
    }

    addStyles(styles: object, element: HTMLElement) {
        Object.assign(element.style, styles);
    }

    initGameListeners() {
        // We init the main event listeners
        this.baseParent.addEventListener('keydown', (event: KeyboardEvent) => {
            event.preventDefault();
            if (event.key == "ArrowLeft") {
                this.changePositionCallback([0, -1]);
            } else if (event.key == "ArrowRight") {
                this.changePositionCallback([0, 1]);
            } else if (event.key == "ArrowUp") {
                this.changePositionCallback([-1, 0]);
            } else if (event.key == "ArrowDown") {
                this.changePositionCallback([1, 0]);
            }
        });
    }

    printWithWhitespace(text: string, parent: HTMLElement) {
        let innerHTML = "<pre>";
        innerHTML += text;
        innerHTML += "</pre>";
        parent.innerHTML = innerHTML;
    }

    printTileTitle(title: string) {
        this.printWithWhitespace(title, this.title);
    }

    printTileDescription(description: string) {
        this.printWithWhitespace(description, this.description);
    }

    printTileASCIIArt(ASCIIart: string) {
        this.printWithWhitespace(ASCIIart, this.ASCIIcanvas);
    }

    printMinimap(minimap: Array<Array<string>>) {
        let text = "";
        for (let i = 0; i < minimap.length; i++) {
            for (let j = 0; j < minimap[0].length; j++) {
                if (i == Math.floor(minimap.length / 2) && j == Math.floor(minimap[0].length / 2)) {
                    text += `<span style="background-color: black; color: white">` + minimap[i][j] + `</span>`;
                } else {
                    text += minimap[i][j];
                }
            }
            text += "\n";
        }
        this.printWithWhitespace(text, this.minimap);
    }

    playAudio(path: string) {
        // if (!this.audio || this.audio.src != path) {
        //     this.audio = new Audio("../assets/audio/" + path);
        //     this.audio.play();
        // }
    }
}