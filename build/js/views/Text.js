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
var Text = (function (_super) {
    __extends(Text, _super);
    function Text(text, color, font) {
        if (color === void 0) { color = '#000000'; }
        if (font === void 0) { font = '20pt Calibri'; }
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.color = color;
        _this.font = font;
        return _this;
    }
    Text.prototype.draw = function (ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.position.x, this.position.y);
    };
    return Text;
}(Entity_1.Entity));
exports.Text = Text;
//# sourceMappingURL=Text.js.map