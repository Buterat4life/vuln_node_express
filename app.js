var createError = require('http-errors');
var express = require('express');
var helmet = require('helmet');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');
var apiRouter = require('./routes/api');
var robots = require('express-robots-txt')

var app = express();

app.disable('x-powered-by');

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], 
      scriptSrc: ["'self'"], 
      styleSrc: ["'self'"], 
      fontSrc: ["'self'"],
      imgSrc: ["'self'"], 
    },
  })
);

app.use(helmet.xContentTypeOptions());

app.use(robots({
    UserAgent: '*',
    Disallow: [ '/', '/search' ]
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/api', apiRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
