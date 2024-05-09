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



// Установка заголовка Content-Security-Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Разрешаем загрузку ресурсов только из текущего источника
      scriptSrc: ["'self'"], // Разрешаем загрузку скриптов только из текущего источника
      styleSrc: ["'self'"], // Разрешаем загрузку стилей только из текущего источника
      fontSrc: ["'self'"], // Разрешаем загрузку шрифтов только из текущего источника
      imgSrc: ["'self'"], // Разрешаем загрузку изображений только из текущего источника
    },
  })
);



// Добавление заголовка X-Content-Type-Options
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
