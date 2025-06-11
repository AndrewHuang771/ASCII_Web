export class Charmap {
    // Textfield is to Charmap like DVD player is to a DVD
    id: number;
    generatorFunction: Function;

    constructor(id: number, generatorFunction: Function) {
        this.id = id;
        this.generatorFunction = generatorFunction;
    }

    // Think of this function as requesting the data from a particular time slice of a DVD, eg: a frame of a movie.
    getCharmapFramePixel(x: number, y: number, t: number): string {
        return this.generatorFunction(x, y, t);
    }

    getCharmapFrame(xMin: number = 0, xMax: number, yMin: number = 0, yMax: number, t: number) {
        let localCharmap: Array<Array<string>> = [];
        for (let x = xMin; x < xMax; x++) {
            let row: Array<string> = [];
            for (let y = yMin; y < yMax; y++) {
                row.push("");
            }
            localCharmap.push(row)
        }
        for (let x = xMin; x < xMax; x++) {
            for (let y = yMin; y < yMax; y++) {
                localCharmap[x][y] = this.generatorFunction(x, y, t);
            }
        }
        return localCharmap;
    }
}
