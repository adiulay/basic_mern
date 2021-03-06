var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression'); //Web servers can often compress the HTTP response sent back to a client, significantly reducing the time required for the client to get and load the page.
var helmet = require('helmet'); // Helmet is a middleware package. It can set appropriate HTTP headers that help protect your app

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://admin:P@ssw0rd@cluster0.zjxbz.mongodb.net/localLibrary?retryWrites=true'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
// var mongoDB = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.zjxbz.mongodb.net/${DB_DATA}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

app.use(compression()); //Compress all routes
app.use(helmet()); //HTTP headers that help protect your app from well-known web vulnerabilities

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
