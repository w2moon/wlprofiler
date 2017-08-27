import { Director } from '../utils/Director';
import { Line } from '../utils/Line';
import { Point } from '../utils/data';
import { Text } from '../utils/Text';

interface LineMap {
    [index: string]: Line;
}

interface LineCacheData {
    name: string;
    pts: Array<Point>;
    color: string;
}

export class Chart extends Director {
    lines: LineMap = {};
    startX: number;
    finishX: number;
    selectX: number;
    maxY: number;
    minY: number;
    cacheLine: Array<LineCacheData>;
    maxText: Text;
    minText: Text;
    yBottom: number;
    yTop: number;
    viewHeight: number;
    fontSize: number = 10;
    selectLine: Line;
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.maxText = new Text('1', this.fontSize);
        this.minText = new Text('0', this.fontSize);
        this.yBottom = this.fontSize;
        this.yTop = this.canvas.height - this.fontSize;
        this.viewHeight = this.yTop - this.yBottom;
        this.scene.addEntity(this.maxText);
        this.scene.addEntity(this.minText);

        this.maxText.setPosition({ x: 0, y: this.fontSize });
        this.minText.setPosition({ x: 0, y: this.canvas.height });

        this.selectLine = new Line([
            { x: 0, y: this.yBottom },
            { x: 0, y: this.yTop }
        ],                         1, 'blue');
        this.scene.addEntity(this.selectLine);
    }

    setSelectX(selectX: number) {
        this.selectX = selectX;

    }

    beginData(startX: number, finishX: number) {
        this.startX = startX;
        this.finishX = finishX;
        this.maxY = -Infinity;
        this.minY = Infinity;
        this.cacheLine = [];
    }

    endData() {
        let minY = 0; // this.minY;
        let range = this.maxY - minY;
        let height = this.viewHeight;
        let canvasHeight = this.canvas.height;
        let ratio = height / range;
        let yBottom = this.yBottom;
        if (range === 0) {
            ratio = 0;
        }
        let startX = this.startX;
        this.cacheLine.forEach(lineCacheData => {

            let line = this.lines[lineCacheData.name];
            let pts = lineCacheData.pts;
            pts.forEach(p => {
                p.x = p.x - startX;
                p.y = canvasHeight - (yBottom + (p.y - minY) * ratio);
            });
            if (!line) {
                line = new Line(pts);
                this.scene.addEntity(line);
                this.lines[lineCacheData.name] = line;
            } else {
                line.points = pts;
            }
            if (lineCacheData.color) {

                line.color = lineCacheData.color;
            }
        });

        this.minText.text = `${minY.toFixed(2)}`;
        this.maxText.text = `${this.maxY.toFixed(2)}`;

        if (this.selectX >= this.startX && this.selectX <= this.finishX) {
            let pts = this.selectLine.points;
            pts.forEach(p => {
                p.x = this.selectX - this.startX;
                console.log(`${p.x}ppp`);
            });
        }

    }

    setLine(name: string, pts: Array<Point>, color: string) {

        let internalPts: Array<Point> = [];
        let maxY = -Infinity;
        let minY = Infinity;
        let startX = this.startX;
        let finishX = this.finishX;

        for (let i = this.startX; i <= this.finishX; ++i) {
            if (!pts[i]) {

                continue;
            }
            let y = pts[i].y;
            if (y > maxY) {
                maxY = y;
            }
            if (y < minY) {
                minY = y;
            }
            internalPts.push({ x: i, y: y });
        }
        if (maxY > this.maxY) {
            this.maxY = maxY;
        }
        if (minY < this.minY) {
            this.minY = minY;
        }

        this.cacheLine.push({
            name: name,
            pts: internalPts,
            color: color,
        });
    }
}