"use strict";
exports.__esModule = true;
var Entity = (function () {
    function Entity() {
        this.position = { x: 0, y: 0 };
    }
    Entity.prototype.setPosition = function (position) {
        this.position = position;
        return this;
    };
    Entity.prototype.draw = function (ctx) {
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map