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
var Entity_1 = require("./Entity");
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(points, lineWidth, color, lineCap) {
        if (lineWidth === void 0) { lineWidth = 5; }
        if (color === void 0) { color = '#000000'; }
        if (lineCap === void 0) { lineCap = 'round'; }
        var _this = _super.call(this) || this;
        _this.points = points;
        _this.lineWidth = lineWidth;
        _this.color = color;
        _this.lineCap = lineCap;
        return _this;
    }
    Line.prototype.draw = function (ctx) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.lineCap = this.lineCap;
        ctx.beginPath();
        this.points.forEach(function (p, idx) {
            if (idx != 0) {
                ctx.lineTo(p.x, p.y);
            }
            ctx.moveTo(p.x, p.y);
        });
        ctx.stroke();
    };
    return Line;
}(Entity_1.Entity));
exports.Line = Line;
//# sourceMappingURL=Line.js.map