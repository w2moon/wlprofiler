"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
var net = require('net');
var client = net.createConnection({ port: 13 }, function () {
    console.log('connected to server!');
});
client.on('data', function (data) {
    console.log(data.toString());
    client.end();
});
client.on('end', function () {
    console.log('disconnected from server');
});
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map