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
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart(canvas) {
        var _this = _super.call(this, canvas) || this;
        _this.lines = {};
        return _this;
    }
    Chart.prototype.drawLine = function (name, pts) {
        var line = this.lines[name];
        if (!line) {
            line = new Line_1.Line(pts);
            this.lines[name] = line;
        }
    };
    return Chart;
}(Director_1.Director));
exports.Chart = Chart;
//# sourceMappingURL=Chart.js.map