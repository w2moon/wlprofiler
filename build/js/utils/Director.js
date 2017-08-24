"use strict";
exports.__esModule = true;
var Entity_1 = require("./Entity");
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60, new Date().getTime());
        };
})();
var Director = (function () {
    function Director(canvas) {
        this.updateFuncs = [];
        this.canvas = canvas;
        this.scene = new Entity_1.Entity();
        this.ctx = canvas.getContext('2d');
    }
    Director.prototype.start = function () {
        this.updateFuncs.forEach(function (func) { return func(); });
        this.scene.update();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.scene.draw(this.ctx);
        requestAnimFrame(this.start.bind(this));
    };
    Director.prototype.scheduleUpdate = function (func) {
        this.updateFuncs.push(func);
    };
    return Director;
}());
exports.Director = Director;
//# sourceMappingURL=Director.js.map