import { Entity } from "./Entity";

var requestAnimFrame: (callback: () => void) => void = (function(){ 
    return window.requestAnimationFrame || 
    (<any>window).webkitRequestAnimationFrame || 
    (<any>window).mozRequestAnimationFrame || 
    (<any>window).oRequestAnimationFrame || 
    (<any>window).msRequestAnimationFrame || 
    function(callback:any){ 
        window.setTimeout(callback, 1000 / 60, new Date().getTime()); 
    }; 
  })(); 

export class Director{
    canvas:HTMLCanvasElement;
    scene:Entity;
    ctx:CanvasRenderingContext2D;
    updateFuncs:Array<()=>void> = [];
    constructor(canvas:HTMLCanvasElement){
        this.canvas = canvas
        this.scene = new Entity();
        this.ctx = canvas.getContext('2d');

       
    }

    start(){
        this.updateFuncs.forEach(func=>func());
        this.scene.update();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.scene.draw(this.ctx);
        requestAnimFrame(this.start.bind(this))
    }

    scheduleUpdate(func:()=>void){
        this.updateFuncs.push(func);
    }
}