var gulp = require('gulp');
var browserSync = require('browser-sync');

// A sample task
gulp.task('hello', function(done) {
    console.log('Hello World');
    done();
});

gulp.task('default', function() {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // If any of these files change, reload the browser. 
    gulp.watch(['src/*.js', './index.html'], function(done) {
        console.log('Something changed.. Reload the browser.');
        browserSync.reload();
        done();
    });
});