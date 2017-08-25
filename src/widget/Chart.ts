import { Director } from "../utils/Director"
import { Line } from "../utils/Line"
import { point } from "../utils/data"

interface LineMap {
    [index:string]:Line;
}
export class Chart extends Director{
    lines:LineMap = {};
    xPixel:number;
    yPixel:number;
    constructor(canvas:HTMLCanvasElement,xPixel:number = 1,yPixel:number = 60){
        super(canvas);

        this.xPixel = xPixel

    }

    drawLine(name:string,pts:Array<point>){
        

        let line = this.lines[name];
        if(!line){
            line = new Line(pts);
            this.lines[name] = line;
        }

        let width = this.canvas.width;
        let height = this.canvas.height;
        pts.forEach(p=>{
            if(p.)
        })
    }
}