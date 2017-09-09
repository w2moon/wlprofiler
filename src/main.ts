import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { FrameData, FrameArray } from './types';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

const net = require('net');
const client = net.createConnection({ port: 4923 }, () => {

  console.log('connected to server!');

});
let bufferData: string = '';
client.on('data', (data: {}) => {
  bufferData += data.toString();
  if (mainWindow) {
    let pos = bufferData.indexOf('\n');
    while (pos !== -1) {
      let str = bufferData.substr(0, pos);
      bufferData = bufferData.substr(pos + 1);
      let obj = JSON.parse(str);
      let children: FrameArray = {};
      let funcInfos = obj.funcInfos;
      if (funcInfos) {
        for (let i = 0; i < funcInfos.length; ++i) {
          let funcInfo = children[funcInfos[i].name];
          if (!funcInfo) {
            children[funcInfos[i].name] = {
              num: 1,
              time: parseFloat(funcInfos[i].elapsed),
            };
          } else {
            funcInfo.num++;
            funcInfo.time += parseFloat(funcInfos[i].elapsed);
          }

        }

      }
      let frameData: FrameData = {
        num: 1,
        frame: parseInt(obj.frame),
        time: parseFloat(obj.elapsed),
        children: children,
      };

      mainWindow.webContents.send('newFrame', frameData);

      pos = bufferData.indexOf('\n');
    }

  }

  // client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
