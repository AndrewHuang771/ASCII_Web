export class RectangleFactory {
    build(xMin: number, xMax: number, yMin: number, yMax: number, fill: Function, background: Function) {
        return (x: number, y: number, t: number) => {
            if ((x === xMin || x === xMax) && y > yMin && y < yMax) {
                return "-";
            } else if ((y === yMin || y === yMax) && x > xMin && x < xMax) {
                return "|"
            } else if ((x === xMin && y === yMin) || (x === xMax && y === yMax)) {
                return "/"
            } else if ((x === xMin && y === yMax) || (x === xMax && y === yMin)) {
                return "\\"
            } else if (x > xMin && x < xMax && y > yMin && y < yMax) {
                x -= xMin;
                y -= yMin;
                return fill(x, y, t);
            } else {
                return background(x, y, t);
            }
        }
    }
}

export class StaticFactory {
    build(xMin: number, xMax: number, yMin: number, yMax: number, text: String[], fill: Function, background: Function) {
        return (x: number, y: number, t: number) => {
            if (x > xMin && x < xMax && y > yMin && y < yMax) {
                x -= xMin + 1;
                y -= yMin + 1;
                if (x >= 0 && x < text.length) {
                    if (y >= 0 && y < text[x].length) {
                        return text[x][y];
                    }
                }
                return fill(x, y, t);
            } else {
                return background(x, y, t);
            }
        }
    }
}