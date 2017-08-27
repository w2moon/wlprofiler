"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Director_1 = require("../utils/Director");
var Line_1 = require("../utils/Line");
var Text_1 = require("../utils/Text");
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart(canvas) {
        var _this = _super.call(this, canvas) || this;
        _this.lines = {};
        _this.fontSize = 10;
        _this.maxText = new Text_1.Text('1', _this.fontSize);
        _this.minText = new Text_1.Text('0', _this.fontSize);
        _this.yBottom = _this.fontSize;
        _this.yTop = _this.canvas.height - _this.fontSize;
        _this.viewHeight = _this.yTop - _this.yBottom;
        _this.scene.addEntity(_this.maxText);
        _this.scene.addEntity(_this.minText);
        _this.maxText.setPosition({ x: 0, y: _this.fontSize });
        _this.minText.setPosition({ x: 0, y: _this.canvas.height });
        _this.selectLine = new Line_1.Line([
            { x: 0, y: _this.yBottom },
            { x: 0, y: _this.yTop }
        ], 1, 'blue');
        _this.scene.addEntity(_this.selectLine);
        return _this;
    }
    Chart.prototype.setSelectX = function (selectX) {
        this.selectX = selectX;
    };
    Chart.prototype.beginData = function (startX, finishX) {
        this.startX = startX;
        this.finishX = finishX;
        this.maxY = -Infinity;
        this.minY = Infinity;
        this.cacheLine = [];
    };
    Chart.prototype.endData = function () {
        var _this = this;
        var minY = 0;
        var range = this.maxY - minY;
        var height = this.viewHeight;
        var canvasHeight = this.canvas.height;
        var ratio = height / range;
        var yBottom = this.yBottom;
        if (range === 0) {
            ratio = 0;
        }
        var startX = this.startX;
        this.cacheLine.forEach(function (lineCacheData) {
            var line = _this.lines[lineCacheData.name];
            var pts = lineCacheData.pts;
            pts.forEach(function (p) {
                p.x = p.x - startX;
                p.y = canvasHeight - (yBottom + (p.y - minY) * ratio);
            });
            if (!line) {
                line = new Line_1.Line(pts);
                _this.scene.addEntity(line);
                _this.lines[lineCacheData.name] = line;
            }
            else {
                line.points = pts;
            }
            if (lineCacheData.color) {
                line.color = lineCacheData.color;
            }
        });
        this.minText.text = "" + minY.toFixed(2);
        this.maxText.text = "" + this.maxY.toFixed(2);
        if (this.selectX >= this.startX && this.selectX <= this.finishX) {
            var pts = this.selectLine.points;
            pts.forEach(function (p) {
                p.x = _this.selectX - _this.startX;
                console.log(p.x + "ppp");
            });
        }
    };
    Chart.prototype.setLine = function (name, pts, color) {
        var internalPts = [];
        var maxY = -Infinity;
        var minY = Infinity;
        var startX = this.startX;
        var finishX = this.finishX;
        for (var i = this.startX; i <= this.finishX; ++i) {
            if (!pts[i]) {
                continue;
            }
            var y = pts[i].y;
            if (y > maxY) {
                maxY = y;
            }
            if (y < minY) {
                minY = y;
            }
            internalPts.push({ x: i, y: y });
        }
        if (maxY > this.maxY) {
            this.maxY = maxY;
        }
        if (minY < this.minY) {
            this.minY = minY;
        }
        this.cacheLine.push({
            name: name,
            pts: internalPts,
            color: color
        });
    };
    return Chart;
}(Director_1.Director));
exports.Chart = Chart;
//# sourceMappingURL=Chart.js.map