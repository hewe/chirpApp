/*jslint node: true*/
'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Initialize the passport with the configuration in passport-init.js
// since passport-init.js is exposed as a function via the 
// modules.export = function(passport){..}, so here we use it
// like a function call aliased via passportInit().
var passportInit = require('./passport-init.js');
passportInit(passport);

//require to get our routers
var api = require('./routes/api.js');
var index = require('./routes/index.js');

// we require the authenticate module here but since it is really a function that takes a passport and
// returns a router, we must execute the function passed in with passport
var authenticate = require('./routes/authenticate.js')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session({secret : 'super secret key to create hashes'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//set the express app to use passport and passport session middleware
app.use(passport.initialize());
app.use(passport.session());

//mount the routes to express
app.use('/', index);
app.use('/api', api);
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
