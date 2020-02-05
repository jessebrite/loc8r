// Imports
const mongoose = require('mongoose');
const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon'); // Not using this feature currently
require('dotenv').config();
require('./app_api/models/db') // importing the DB

const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const routesAPI = require('./app_api/routes/index');

const app = express();

// Sets appropirate HTTP headers to help against vulnerabilites
app.use(helmet());

// view engine setup
app
  .set('views', path.join(__dirname, 'app_server', 'views'))
  .set('view engine', 'pug');

// Binding the imports
app
  .use(logger('dev'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')));

// Routes
app
  .use('/', indexRouter)
  .use('/users', usersRouter)
  .use('/api', routesAPI);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(createError(404));
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
