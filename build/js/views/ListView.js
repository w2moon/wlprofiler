"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var ListItem_1 = require("./ListItem");
var ListInfo = (function () {
    function ListInfo() {
        this.itemInfos = [];
    }
    ListInfo.prototype.add = function (itemInfo) {
        this.itemInfos.push(itemInfo);
    };
    ListInfo.prototype.clear = function () {
        this.itemInfos = [];
    };
    __decorate([
        mobx_1.observable
    ], ListInfo.prototype, "itemInfos");
    return ListInfo;
}());
exports.ListInfo = ListInfo;
var ListView = mobx_react_1.observer(function (_a) {
    var listInfo = _a.listInfo;
    return (React.createElement("div", null, listInfo.itemInfos.map(function (itemInfo, key) { return React.createElement(ListItem_1["default"], { key: key, itemInfo: itemInfo }); })));
});
exports["default"] = ListView;
//# sourceMappingURL=ListView.js.map