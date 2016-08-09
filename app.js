var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Mongoose Schema
require('./models/models');

var session = require('express-session'); //newly
var passport = require('passport'); // newly

var routes = require('./routes/index');
var users = require('./routes/users');

var weather = require('./routes/weather');// newly
var auth = require('./routes/auth')(passport); // newly


var mongoose = require('mongoose');
const env = require('env2')('./config.env');

var mongoURI = process.env.mongoURI;

var MongoDB = mongoose.connect(mongoURI).connection;
MongoDB.on('error', function (err) { console.log(err.message); });
MongoDB.once('open', function () {
    console.log("mongodb connection ok");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({ secret: 'meteoroloji_secret' })); //newly
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//newly
app.use(passport.initialize());
app.use(passport.session());
// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth); // newly
app.use('/weather', weather); // newly

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
