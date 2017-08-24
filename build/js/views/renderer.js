"use strict";
exports.__esModule = true;
var Chart_1 = require("../widget/Chart");
function createTestData(frame, funcNum) {
    var funcs = {};
    var totalTime = 0;
    for (var i = 0; i < funcNum; ++i) {
        var time = Math.random() * 16;
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
        children: funcs
    };
}
var canvas = document.getElementById('canvas');
var chart = new Chart_1.Chart(canvas);
var frameTest = 1;
var mainLine = [];
var funcLine = {};
chart.scheduleUpdate(function () {
    var data = createTestData(frameTest, 100);
    var frame = data.frame;
    mainLine[frame] = { x: frame, y: data.time };
    for (var funcName in data.children) {
        var lineInfo = funcLine[funcName];
        if (!lineInfo) {
            lineInfo = [];
            funcLine[funcName] = lineInfo;
        }
        lineInfo[frame] = { x: frame, y: data.children[funcName].time };
    }
    chart.drawLine("main", mainLine);
});
chart.start();
//# sourceMappingURL=renderer.js.map