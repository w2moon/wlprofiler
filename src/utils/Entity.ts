import {point} from '../utils/data'
   
export class Entity{
        name:string;
        position:point = {x:0,y:0};
        children:Array<Entity> = [];
        constructor(){
        }

        setPosition(position:point) {
            this.position = position;
            return this;
        }

        addEntity(ent:Entity){
            this.children.push(ent);
        }
    
        removeEntity(ent:Entity){
           let idx = this.children.indexOf(ent);
           if(idx != -1){
                this.children.splice(idx,1);
           }
        }

        update(){
            this.children.forEach(ent => {
                ent.update();
            });
        }
    
         draw(ctx:CanvasRenderingContext2D){
            this.children.forEach(ent => {
                ent.draw(ctx);
            });
         }

      
    }
