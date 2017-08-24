import { Director } from "../utils/Director"
import { Line } from "../utils/Line"
import { point } from "../utils/data"

interface LineMap {
    [index:string]:Line;
}
export class Chart extends Director{
    lines:LineMap = {};
    constructor(canvas:HTMLCanvasElement){
        super(canvas);
    }

    drawLine(name:string,pts:Array<point>){
        let line = this.lines[name];
        if(!line){
            line = new Line(pts);
            this.lines[name] = line;
        }
    }
}