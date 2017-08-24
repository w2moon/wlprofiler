import { point } from '../utils/data'
import { Entity } from "./Entity";

export class Text extends Entity {
    text:string;
    color: string;
    font:string;
    constructor(text:string, color: string = '#000000', font: string = '20pt Calibri') {
        super();

       this.text = text;
       this.color = color;
       this.font = font;

    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.position.x, this.position.y);
    }

}
