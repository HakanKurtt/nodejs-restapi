var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket_io = require('socket.io');


var mongoose = require('mongoose');
var db = require('./model/db');
var User = require('./model/models').user;
var Message = require('./model/models').message;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var io = socket_io();
app.io = io;






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function(client){
  console.log("Client connected..");
  client.on('join', function(data){
    console.log(data);
  });

  client.on('new user', function(data){
    console.log("New user"+data.nickname);
    User.findOne({'nickname': data.nickname}, function(err, result){
      if(err){
        throw err;
      }

      if(result){

        User.findOneAndUpdate({nickname:data.nickname},{$set:{socketid:client.id}}, function(err, doc){
          if(err) throw err;

          console.log("Güncelleme basarılı");
        });

      }else{
        var newUser = new User({nickname:data.nickname, socketid:client.id});

        newUser.save(function(err){
          if(err) throw err;
          console.log("Kisi kaydedildi");
        })
      }
    });
  });

  client.on('send message', function(data){
        var newMsg = new Message({sender:data.nickname, message:data.message});
        console.log("New message= "+data.message);

        newMsg.save(function(err, docs){
            if(err) throw err;
            console.log(docs.sender);
            io.emit('new message', {nickname:docs.sender, message:docs.message, created:docs.created});
        })
  });
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

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
