"use strict";
exports.__esModule = true;
var Entity = (function () {
    function Entity() {
        this.position = { x: 0, y: 0 };
        this.children = [];
    }
    Entity.prototype.setPosition = function (position) {
        this.position = position;
        return this;
    };
    Entity.prototype.addEntity = function (ent) {
        this.children.push(ent);
    };
    Entity.prototype.removeEntity = function (ent) {
        var idx = this.children.indexOf(ent);
        if (idx !== -1) {
            this.children.splice(idx, 1);
        }
    };
    Entity.prototype.update = function () {
        this.children.forEach(function (ent) {
            ent.update();
        });
    };
    Entity.prototype.draw = function (ctx) {
        this.children.forEach(function (ent) {
            ent.draw(ctx);
        });
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map