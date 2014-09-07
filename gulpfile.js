var gulp = require('gulp')
var traceur = require('gulp-traceur')

gulp.task('default', ['lib.es5', 'component.es5', 'test.es5'])

var traceurOptions = { 
  symbols: true
}

gulp.task('lib.es5', function () {
  return gulp.src('lib/*.js')
    .pipe(traceur(traceurOptions))
    .pipe(gulp.dest('es5/lib'));
})

gulp.task('component.es5', function () {
  return gulp.src('component/*.js')
    .pipe(traceur(traceurOptions))
    .pipe(gulp.dest('es5/component'));
})

gulp.task('test.es5', function () {
  return gulp.src('test/*.js')
    .pipe(traceur(traceurOptions))
    .pipe(gulp.dest('es5/test'));
})