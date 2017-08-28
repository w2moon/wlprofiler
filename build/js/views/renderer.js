"use strict";
exports.__esModule = true;
var Chart_1 = require("../widget/Chart");
var React = require("react");
var ReactDOM = require("react-dom");
var ListView_1 = require("./ListView");
var ListItem_1 = require("./ListItem");
var _ = require("lodash");
var electron_1 = require("electron");
function createTestData(frame, funcNum) {
    var funcs = {};
    var totalTime = 0;
    for (var i = 0; i < funcNum; ++i) {
        var time = Math.random() * 0.1;
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
        children: funcs
    };
}
var canvas = document.getElementById('canvas');
var chart = new Chart_1.Chart(canvas);
var frameTest = 1;
var mainLine = [];
var funcLine = {};
var MaxFrameViewNum = canvas.width;
var CommonFrameTime = 16.6666;
function createline(start, end) {
    var commonLine = [];
    commonLine[start.x] = { x: start.x, y: start.y };
    commonLine[end.x] = { x: end.x, y: end.y };
    return commonLine;
}
var selectFrame = 0;
var frameCurrent = 0;
var frameMax = 0;
var minFrame = 0;
function xToFrame(x, startFrame) {
    return startFrame + x;
}
function frameToX(frame, startFrame) {
    return frame - startFrame;
}
var listInfo = new ListView_1.ListInfo();
function showFrameInfo(frame) {
    var frames = [];
    for (var k in funcLine) {
        var line = funcLine[k];
        var info = line[frame];
        if (info) {
            frames.push(new ListItem_1.ItemInfo(k, info.y, (info.num)));
        }
    }
    frames = _.orderBy(frames, ['time', 'amount'], ['desc', 'desc']);
    listInfo.clear();
    for (var i = 0; i < 20 && i < frames.length; ++i) {
        listInfo.add(frames[i]);
    }
}
canvas.addEventListener('click', function (e) {
    var offsetX = 0, offsetY = 0;
    var element = canvas;
    if (element.offsetParent) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }
    var x = e.pageX - offsetX;
    var y = e.pageY - offsetY;
    var startFrame = Math.max(frameCurrent - MaxFrameViewNum, minFrame);
    selectFrame = xToFrame(x, startFrame);
    chart.setSelectX(selectFrame);
    if (mainLine[selectFrame]) {
        showFrameInfo(selectFrame);
    }
}, true);
var paused = false;
document.getElementById('play').addEventListener('click', function (e) {
    paused = false;
});
document.getElementById('pause').addEventListener('click', function (e) {
    paused = true;
});
var dataQueue = [];
electron_1.ipcRenderer.on('newFrame', function (event, data) {
    dataQueue.push(data);
});
function processData() {
    var frame = frameMax;
    var data = null;
    while (data = dataQueue.shift()) {
        frame = data.frame;
        if (minFrame === 0) {
            minFrame = frame;
        }
        mainLine[frame] = { x: frame, y: data.time };
        for (var funcName in data.children) {
            var funcInfo = data.children[funcName];
            var lineInfo = funcLine[funcName];
            if (!lineInfo) {
                lineInfo = [];
                funcLine[funcName] = lineInfo;
            }
            lineInfo[frame] = { x: frame, y: funcInfo.time, num: funcInfo.num };
        }
    }
    if (frame > frameMax) {
        frameMax = frame;
    }
    return frame;
}
chart.scheduleUpdate(function () {
    var frame = processData();
    if (!paused) {
        frameCurrent = frame;
    }
    var startFrame = Math.max(frameCurrent - MaxFrameViewNum, minFrame);
    var endFrame = startFrame + MaxFrameViewNum;
    chart.beginData(startFrame, endFrame);
    chart.setLine('common', createline({ x: startFrame, y: 16.66 }, { x: endFrame, y: 16.66 }), 'green');
    chart.setLine('main', mainLine, 'black');
    chart.endData();
});
chart.start();
ReactDOM.render(React.createElement(ListView_1["default"], { listInfo: listInfo }), document.getElementById('list'));
//# sourceMappingURL=renderer.js.map