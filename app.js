// Imports
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon'); // Not using this feature currently
const passport = require('passport');
require('./app_api/models/db'); // importing the DB
require('./app_api/config/passport');

// const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const routesAPI = require('./app_api/routes/index');

const app = express();

// Sets appropirate HTTP headers to help against HTTP vulnerabilites
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
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'app_public', 'build')))
  .use(passport.initialize());

// Allowing CORS from all origins
// Insecure, might want to change that
app.use('/api', (req, res, next) => {
  res
    .header('Access-Control-Allow-Origin', '*')
    .header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
  next();
});

// Routes
app
  // .use('/', indexRouter)
  .use('/users', usersRouter)
  .use('/api', routesAPI);
app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});

// error handlers
// // catch 'unauthorized' errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: `${err.name}: ${err.message}` });
  }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
