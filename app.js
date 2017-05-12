var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var proj = require('./routes/proj_sel');
var mongoose = require('mongoose');
var methodOverride = require("method-override");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());//bodyparser 로 stream의 폼 데이터를 req.body에 옮김, jsondata
app.use(bodyParser.urlencoded({ extended: false }));// urlencoded로 req.body생성
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));
app.use(methodOverride("_method"));

//app.use('/', index);
app.use('/users', users);
mongoose.connect(process.env["MONGO_DB"]);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to db server");
});

app.use("/",proj);




app.listen(30000, function () {
    console.log("server on!");
});

module.exports = app;
