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
var client = net.createConnection({ port: 4923 }, function () {
    console.log('connected to server!');
});
var bufferData = '';
client.on('data', function (data) {
    bufferData += data.toString();
    if (mainWindow) {
        var pos = bufferData.indexOf('\n');
        while (pos !== -1) {
            var str = bufferData.substr(0, pos);
            bufferData = bufferData.substr(pos + 1);
            var obj = JSON.parse(str);
            var children = {};
            var funcInfos = obj.funcInfos;
            if (funcInfos) {
                for (var i = 0; i < funcInfos.length; ++i) {
                    var funcInfo = children[funcInfos[i].name];
                    if (!funcInfo) {
                        children[funcInfos[i].name] = {
                            num: 1,
                            time: parseFloat(funcInfos[i].elapsed)
                        };
                    }
                    else {
                        funcInfo.num++;
                        funcInfo.time += parseFloat(funcInfos[i].elapsed);
                    }
                }
            }
            var frameData = {
                num: 1,
                frame: parseInt(obj.frame),
                time: parseFloat(obj.elapsed),
                children: children
            };
            mainWindow.webContents.send('newFrame', frameData);
            pos = bufferData.indexOf('\n');
        }
    }
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