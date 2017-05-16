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

var socketIO=require('socket.io');
var io;
var app = express();
var server = require('http').createServer(app);
app.io=require('socket.io')(server);
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
mongoose.connect(process.env["MONGO_DB"]);  //환경변수 접근 (mongodb://seungwon:789789@ds133271.mlab.com:33271/proj_pp)대신 넣어도댐
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to db server");
});

app.use("/",proj);

var numUsers=0;

app.io.on('connection',function(socket) {
    var addedUser=false;
    console.log("socket server on");
    socket.on('new message',function(data) {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    socket.on('add user', function(username) {
        if(addedUser) return;
        socket.username=username;
        ++numUsers;
        addedUser=true;
        socket.emit('login', {
            numUsers:numUsers
        });

        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers:numUsers
        });
    });

    socket.on('typing',function() {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    socket.on('stop typing',function() {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    socket.on('disconnect',function() {
        if(addedUser) {
            --numUsers;
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

    socket.on('drawing', function(data) {
        socket.broadcast.emit('drawing',data);
    });

});
module.exports = app;
