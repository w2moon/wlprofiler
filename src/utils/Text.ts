import { Point } from '../utils/data';
import { Entity } from './Entity';

export class Text extends Entity {
    text: string;
    color: string;
    fontSize: number;
    fontName: string;
    constructor(text: string, fontSize: number = 10, color: string = '#000000', fontName: string = 'Calibri') {
        super();

        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.fontName = fontName;

    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        ctx.font = `${this.fontSize}pt ${this.fontName}`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.position.x, this.position.y);
    }

}
