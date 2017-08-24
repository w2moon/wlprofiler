// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//import * as data from "../utils/data"
import { Chart } from "../widget/Chart";
import {point} from "../utils/data";

interface FrameData{
    num:number;
    time:number;
    frame?:number;
    children?:StringArray;
}

interface FrameArray {
    [index: string]: FrameData;
}

interface FuncLine {
    [index:string]:Array<point>;
}

function createTestData(frame: number, funcNum: number):FrameData {
    let funcs:FrameArray = {};
    let totalTime: number = 0;
    for (let i = 0; i < funcNum; ++i) {
        let time = Math.random() * 16;
        totalTime += time;
        funcs["func" + funcNum] = {
            time: time,
            num: Math.floor(Math.random() * 100)
        };
    }


    return {
        frame: frame,
        time: totalTime,
        num: 1,
        children: funcs,

    };
}

let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');

let chart = new Chart(canvas);

//显示主线和当前选中的线
//每一个函数在每一帧会建立一个数据，花费的时间，调用次数
let frameTest = 1;
let mainLine:Array<point> = [];
let funcLine:FuncLine = {};
chart.scheduleUpdate(() => {
    let data = createTestData(frameTest, 100);
    let frame = data.frame;
    mainLine[frame] = {x:frame,y:data.time};
   
    for(let funcName in data.children){
        let lineInfo = funcLine[funcName];
        if(!lineInfo){
            lineInfo = [];
            funcLine[funcName] = lineInfo;
        }
        lineInfo[frame] = {x:frame,y:data.children[funcName].time};
    }

    chart.drawLine("main",mainLine);

});

chart.start();
