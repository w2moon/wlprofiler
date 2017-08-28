// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import { Chart } from '../widget/Chart';
import { Point } from '../utils/data';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ListView, { ListInfo } from './ListView';
import { ItemInfo } from './ListItem';
import * as _ from 'lodash';
import { ipcRenderer } from 'electron';
import { FrameArray, FrameData, FuncLine } from '../types';
function createTestData(frame: number, funcNum: number): FrameData {
    let funcs: FrameArray = {};
    let totalTime: number = 0;
    for (let i = 0; i < funcNum; ++i) {
        let time = Math.random() * 0.1;
        totalTime += time;
        funcs['func' + i] = {
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

let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

let chart = new Chart(canvas);

// 显示主线和当前选中的线
// 每一个函数在每一帧会建立一个数据，花费的时间，调用次数
let frameTest: number = 1;
let mainLine: Array<Point> = [];
let funcLine: FuncLine = {};
const MaxFrameViewNum = canvas.width;
const CommonFrameTime = 16.6666;

function createline(start: Point, end: Point) {

    let commonLine = [];
    commonLine[start.x] = { x: start.x, y: start.y };
    commonLine[end.x] = { x: end.x, y: end.y };
    return commonLine;
}

let selectFrame = 0;
let frameCurrent = 0;

function xToFrame(x: number, startFrame: number): number {
    return startFrame + x;
}

function frameToX(frame: number, startFrame: number): number {
    return frame - startFrame;
}

let listInfo: ListInfo = new ListInfo();

function showFrameInfo(frame: number) {
    let frames = [];
    for (let k in funcLine) {
        let line = funcLine[k];
        let info = line[frame];
        if (info) {
            frames.push(new ItemInfo(k, info.y, (info.num) as number));
        }
    }
    frames = _.orderBy(frames, ['time', 'amount'], ['desc', 'desc']);
    listInfo.clear();

    for (let i = 0; i < 20 && i < frames.length; ++i) {
        listInfo.add(frames[i]);
    }
}

canvas.addEventListener(
    'click',
    e => {
        let offsetX = 0, offsetY = 0;
        let element: HTMLElement = canvas;
        if (element.offsetParent) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent as HTMLElement));
        }

        let x = e.pageX - offsetX;
        let y = e.pageY - offsetY;
        let startFrame = Math.max(frameCurrent - MaxFrameViewNum, 0);
        selectFrame = xToFrame(x, startFrame);
        chart.setSelectX(selectFrame);
        if (mainLine[selectFrame]) {
            showFrameInfo(selectFrame);
        }
    },
    true
);

let paused = false;
document.getElementById('play').addEventListener('click', e => {
    paused = false;
});
document.getElementById('pause').addEventListener('click', e => {
    paused = true;
});

let dataQueue: Array<FrameData> = [];

ipcRenderer.on('newFrame', (data: FrameData) => {
    console.log('new frame');
    dataQueue.push(data);
});
function processData() {

    // frameTest++;
    //  dataQueue.push(createTestData(frameTest, 100));

    let frame = 0;
    let data = null;
    while (data = dataQueue.shift()) {
        frame = data.frame;
        mainLine[frame] = { x: frame, y: data.time };
        for (let funcName in data.children) {
            let funcInfo = data.children[funcName];
            let lineInfo = funcLine[funcName];
            if (!lineInfo) {
                lineInfo = [];
                funcLine[funcName] = lineInfo;
            }
            lineInfo[frame] = { x: frame, y: funcInfo.time, num: funcInfo.num };
        }
    }
    return frame;
}

chart.scheduleUpdate(() => {
    let frame = processData();
    if (!paused) {
        frameCurrent = frame;
    }
    let startFrame = Math.max(frameCurrent - MaxFrameViewNum, 0);
    let endFrame = startFrame + MaxFrameViewNum;
    chart.beginData(startFrame, endFrame);
    chart.setLine('common', createline({ x: startFrame, y: 16.66 }, { x: endFrame, y: 16.66 }), 'green');
    chart.setLine('main', mainLine, 'black');

    chart.endData();

});

chart.start();

ReactDOM.render(
    <ListView listInfo={listInfo} />,
    document.getElementById('list') as HTMLElement
);
