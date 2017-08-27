import { Point } from '../utils/data';
import { Entity } from './Entity';

export class Line extends Entity {
    points: Array<Point>;
    lineWidth: number;
    color: string;
    lineCap: string;
    constructor(points: Array<Point>, lineWidth: number = 1, color: string = '#000000', lineCap: string = 'round') {
        super();

        this.points = points;
        this.lineWidth = lineWidth;
        this.color = color;
        this.lineCap = lineCap;

    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.lineCap = this.lineCap;

        ctx.beginPath();
        this.points.forEach((p, idx) => {
            if (idx !== 0) {
                ctx.lineTo(p.x, p.y);

            }
            ctx.moveTo(p.x, p.y);

        });

        ctx.stroke();
    }
}
