var gulp = require('gulp');
var electron = require('electron-connect').server.create({path:"./build/js/main.js"});


gulp.task('watch',function(){
    electron.start();
    gulp.watch(['./build/**/*.js'],electron.restart);
    gulp.watch(['./build/**/*.{html,js,css}'],electron.reload);
});

